import { GoogleGenAI } from '@google/genai';
import { env } from '$env/dynamic/private';

const ai = env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: env.GEMINI_API_KEY }) : null;

export type AspectRatio = '16:9' | '3:4' | '1:1';

export interface GenerateImageOptions {
	prompt: string;
	referenceImages?: Buffer[]; // Optional multiple reference images
	aspectRatio?: AspectRatio; // Aspect ratio for the generated image
}

/**
 * Generate an image using Gemini
 */
export async function generateImage(
	options: GenerateImageOptions
): Promise<{ data: Buffer; mimeType: string } | null> {
	if (!ai) {
		throw new Error('Gemini API key not configured');
	}

	try {
		// Build content parts
		const contentParts: any[] = [{ text: options.prompt }];

		// Add reference images if provided
		if (options.referenceImages && options.referenceImages.length > 0) {
			for (const refImage of options.referenceImages) {
				// Detect mime type based on buffer header
				let mimeType = 'image/png';
				if (refImage[0] === 0xff && refImage[1] === 0xd8) {
					mimeType = 'image/jpeg';
				}

				contentParts.push({
					inlineData: {
						data: refImage.toString('base64'),
						mimeType
					}
				});
			}
		}

		// Build config with aspect ratio if provided
		const config: any = {
			responseModalities: ['image']
		};

		if (options.aspectRatio) {
			config.imageGenerationConfig = {
				aspectRatio: options.aspectRatio
			};
		}

		const response = await ai.models.generateContent({
			model: 'gemini-3-pro-image-preview',
			contents: contentParts,
			config
		});

		// Extract image data from response
		const candidates = response.candidates;
		if (!candidates || candidates.length === 0) {
			return null;
		}

		const firstCandidate = candidates[0];
		if (!firstCandidate.content || !firstCandidate.content.parts) {
			return null;
		}

		// Find the image part
		for (const part of firstCandidate.content.parts) {
			if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
				const base64Data = part.inlineData.data;
				if (!base64Data) continue;
				const buffer = Buffer.from(base64Data, 'base64');
				return {
					data: buffer,
					mimeType: part.inlineData.mimeType
				};
			}
		}

		return null;
	} catch (error) {
		console.error('Error generating image:', error);
		throw error;
	}
}

/**
 * Build a prompt for concept art generation
 */
export function buildConceptPrompt(systemPrompt: string, characterDescription: string): string {
	const typeInstruction = 'Extract this character from the reference images provided, showing the full body from head to toe. Keep the character design, colors, and style exactly as shown in the reference images. You may make minor adjustments to the pose, but maintain complete visual consistency with the reference character. Center the character in the frame with appropriate spacing around them.';
	return `${systemPrompt}\n\nCharacter Description:\n${characterDescription}\n\n${typeInstruction}`;
}

/**
 * Build a prompt for portrait generation
 */
export function buildPortraitPrompt(systemPrompt: string, characterDescription: string): string {
	const typeInstruction = 'Generate a portrait for this character.';
	return `${systemPrompt}\n\nCharacter Description:\n${characterDescription}\n\n${typeInstruction}`;
}

/**
 * Build a prompt for spritesheet generation
 */
export function buildSpritesheetPrompt(systemPrompt: string, characterDescription: string): string {
	const typeInstruction = 'Generate a spritesheet for this character.';
	return `${systemPrompt}\n\nCharacter Description:\n${characterDescription}\n\n${typeInstruction}`;
}
