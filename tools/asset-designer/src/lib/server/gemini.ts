import { GoogleGenAI } from '@google/genai';
import { env } from '$env/dynamic/private';

const ai = env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: env.GEMINI_API_KEY }) : null;

export interface GenerateImageOptions {
	prompt: string;
	referenceImage?: Buffer; // Optional reference image
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

		// Add reference image if provided
		if (options.referenceImage) {
			contentParts.push({
				inlineData: {
					data: options.referenceImage.toString('base64'),
					mimeType: 'image/png'
				}
			});
		}

		const response = await ai.models.generateContent({
			model: 'gemini-3-pro-image-preview',
			contents: contentParts,
			config: {
				responseModalities: ['image']
			}
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
 * Build a prompt for character concept generation
 */
export function buildConceptPrompt(characterDescription: string, basePrompt: string): string {
	return `${basePrompt}\n\nCharacter Description:\n${characterDescription}\n\nPlease generate a character concept image following the style guidelines above.`;
}

/**
 * Build a prompt for character speech portrait generation
 */
export function buildSpeechPrompt(
	characterDescription: string,
	baseSpeechPrompt: string,
	expressionPrompt: string
): string {
	return `${baseSpeechPrompt}\n\n${expressionPrompt}\n\nCharacter Description:\n${characterDescription}\n\nPlease generate a character speech portrait following the style guidelines and expression requirements above.\n\nReference the provided concept image for the character's appearance, ensuring consistency in design, colors, and features.`;
}
