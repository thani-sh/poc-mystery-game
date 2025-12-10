import { fail } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { GoogleGenAI } from '@google/genai';
import mime from 'mime';
import { GEMINI_API_KEY } from '$env/static/private';

// Load prompt templates - use absolute path from project root
const projectRoot = process.cwd().includes('tool/character-designer') 
	? join(process.cwd(), '../..')
	: process.cwd();
const promptsPath = join(projectRoot, 'docs/prompts');

async function loadPrompts() {
	const portraitPrompt = await readFile(join(promptsPath, 'character-portrait-prompt.md'), 'utf-8');
	const spritesheetPrompt = await readFile(join(promptsPath, 'character-spritesheet-prompt.md'), 'utf-8');
	return { portraitPrompt, spritesheetPrompt };
}

function buildPrompt(formData: FormData, basePrompt: string) {
	const characterType = formData.get('characterType') as string;
	const race = (formData.get('race') as string)?.trim();
	const characterClass = (formData.get('class') as string)?.trim();
	const gender = formData.get('gender') as string;
	const age = (formData.get('age') as string)?.trim();
	const hairColor = (formData.get('hairColor') as string)?.trim();
	const eyeColor = (formData.get('eyeColor') as string)?.trim();
	const skinTone = (formData.get('skinTone') as string)?.trim();
	const physicalFeatures = (formData.get('physicalFeatures') as string)?.trim();
	const clothing = (formData.get('clothing') as string)?.trim();
	const additionalDetails = (formData.get('additionalDetails') as string)?.trim();

	// Build character description
	const parts = [];

	// Race and class
	if (race || characterClass) {
		parts.push(`${race || 'character'}${characterClass ? ' ' + characterClass : ''}`);
	}

	// Gender and age
	if (gender || age) {
		const genderAge = [gender, age].filter(Boolean).join(', ');
		if (genderAge) parts.push(genderAge);
	}

	// Physical features with colors
	const features = [];
	if (hairColor) features.push(`${hairColor} hair`);
	if (eyeColor) features.push(`${eyeColor} eyes`);
	if (skinTone) features.push(`${skinTone} skin`);
	if (physicalFeatures) features.push(physicalFeatures);

	if (features.length > 0) {
		parts.push(features.join(', '));
	}

	// Build the character description line
	let characterDesc = parts.join(', ');

	// Additional details
	if (additionalDetails) {
		characterDesc += '. ' + additionalDetails;
	}

	// Replace placeholders in base prompt
	let finalPrompt = basePrompt;

	// Replace the INSERT markers with our character description
	if (characterDesc) {
		finalPrompt = finalPrompt.replace(
			/\[INSERT CHARACTER RACE AND CLASS\]/g,
			race || characterClass || 'character'
		);

		finalPrompt = finalPrompt.replace(
			/\[INSERT KEY PHYSICAL FEATURES:[^\]]*\]/g,
			features.join(', ') || 'distinctive features'
		);

		finalPrompt = finalPrompt.replace(
			/\[INSERT CLOTHING\/ARMOR DETAILS\]/g,
			clothing || 'appropriate attire'
		);
	}

	return finalPrompt;
}

async function generateImage(prompt: string, referenceImage?: string) {
	if (!GEMINI_API_KEY) {
		throw new Error('GEMINI_API_KEY environment variable is not set');
	}

	// Initialize Google GenAI
	const ai = new GoogleGenAI({
		apiKey: GEMINI_API_KEY,
	});

	const tools = [
		{
			googleSearch: {}
		},
	];

	const config = {
		responseModalities: ['IMAGE', 'TEXT'],
		imageConfig: {
			imageSize: '1K',
		},
		tools,
	};

	const model = 'gemini-3-pro-image-preview';

	const contents: any[] = [
		{
			role: 'user',
			parts: [
				{
					text: prompt,
				},
			],
		},
	];

	// If reference image is provided, add it to the content
	if (referenceImage) {
		contents[0].parts.unshift({
			inlineData: {
				mimeType: 'image/png',
				data: referenceImage,
			},
		});
		contents[0].parts[1].text = `Using this character portrait as reference, ${prompt}`;
	}

	// Generate content
	const response = await ai.models.generateContentStream({
		model,
		config,
		contents,
	});

	const images: Array<{ dataUrl: string; extension: string; base64Data: string }> = [];
	let textResponse = '';

	for await (const chunk of response) {
		if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
			continue;
		}

		if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
			const inlineData = chunk.candidates[0].content.parts[0].inlineData;
			const fileExtension = mime.getExtension(inlineData.mimeType || '') || 'png';
			const base64Data = inlineData.data || '';
			const dataUrl = `data:${inlineData.mimeType};base64,${base64Data}`;
			images.push({ dataUrl, extension: fileExtension, base64Data });
		} else if (chunk.text) {
			textResponse += chunk.text;
		}
	}

	return { images, textResponse };
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		if (!GEMINI_API_KEY) {
			return fail(500, { error: 'GEMINI_API_KEY environment variable is not set. Please add it to your .env file.' });
		}

		try {
			// Load prompts
			const { portraitPrompt, spritesheetPrompt } = await loadPrompts();
			const characterType = formData.get('characterType') as string;

			// Step 1: Generate portrait sprite sheet first
			const portraitPromptText = buildPrompt(formData, portraitPrompt);
			const portraitResult = await generateImage(portraitPromptText);

			if (portraitResult.images.length === 0) {
				return fail(500, { 
					error: 'No portrait images were generated. The AI might not support image generation for this prompt or model.' 
				});
			}

			// If user wants sprite sheet, generate it using portrait as reference
			if (characterType === 'spritesheet') {
				const spritesheetPromptText = buildPrompt(formData, spritesheetPrompt);
				const spritesheetResult = await generateImage(
					spritesheetPromptText, 
					portraitResult.images[0].base64Data
				);

				if (spritesheetResult.images.length === 0) {
					// If sprite sheet generation fails, return just the portrait
					return {
						success: true,
						images: portraitResult.images,
						prompt: `Portrait:\n${portraitPromptText}`,
						textResponse: portraitResult.textResponse,
						warning: 'Sprite sheet generation failed. Showing portrait only.'
					};
				}

				// Return both portrait and sprite sheet
				return {
					success: true,
					images: [...portraitResult.images, ...spritesheetResult.images],
					prompt: `Portrait:\n${portraitPromptText}\n\nSprite Sheet:\n${spritesheetPromptText}`,
					textResponse: `Portrait: ${portraitResult.textResponse}\n\nSprite Sheet: ${spritesheetResult.textResponse}`
				};
			}

			// Return just the portrait
			return {
				success: true,
				images: portraitResult.images,
				prompt: portraitPromptText,
				textResponse: portraitResult.textResponse
			};

		} catch (error: any) {
			console.error('Error generating character:', error);
			return fail(500, { 
				error: error.message || 'Failed to generate character. Please check your API key and try again.' 
			});
		}
	}
};
