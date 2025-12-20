import { GoogleGenAI } from '@google/genai';
import { env } from '$env/dynamic/private';

const ai = env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: env.GEMINI_API_KEY }) : null;

export interface GenerateImageOptions {
	prompt: string;
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
		const response = await ai.models.generateContent({
			model: 'gemini-3-pro-image-preview',
			contents: options.prompt,
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
