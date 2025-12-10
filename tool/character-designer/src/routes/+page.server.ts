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
	const baseCharacter = (formData.get('baseCharacter') as string)?.trim();
	const customDetails = (formData.get('customDetails') as string)?.trim();

	// Build character description
	let characterDesc = '';
	
	// Start with base character reference if provided
	if (baseCharacter) {
		characterDesc = `${baseCharacter}, a human character from the UK`;
	} else {
		characterDesc = 'a human character from the UK';
	}

	// Add custom details if provided
	if (customDetails) {
		characterDesc += '. ' + customDetails;
	}

	// Replace placeholders in base prompt
	let finalPrompt = basePrompt;

	// Replace the INSERT markers with our character description
	finalPrompt = finalPrompt.replace(
		/\[INSERT CHARACTER DESCRIPTION\]/g,
		characterDesc
	);

	// Extract features and clothing from custom details for other placeholders
	// Default to simple descriptions if not specified
	finalPrompt = finalPrompt.replace(
		/\[INSERT KEY PHYSICAL FEATURES:[^\]]*\]/g,
		customDetails || 'typical features for their age'
	);

	finalPrompt = finalPrompt.replace(
		/\[INSERT CLOTHING DETAILS:[^\]]*\]/g,
		'everyday casual clothes suitable for adventure'
	);

	return finalPrompt;
}

async function generateImage(prompt: string, referenceImage?: { base64Data: string; mimeType: string }) {
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
				mimeType: referenceImage.mimeType,
				data: referenceImage.base64Data,
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

	const images: Array<{ dataUrl: string; extension: string; base64Data: string; mimeType: string }> = [];
	let textResponse = '';

	for await (const chunk of response) {
		if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
			continue;
		}

		if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
			const inlineData = chunk.candidates[0].content.parts[0].inlineData;
			const mimeType = inlineData.mimeType || 'image/png';
			const fileExtension = mime.getExtension(mimeType) || 'png';
			const base64Data = inlineData.data || '';
			const dataUrl = `data:${mimeType};base64,${base64Data}`;
			images.push({ dataUrl, extension: fileExtension, base64Data, mimeType });
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

			// Step 1: Generate portrait sprite sheet first
			const portraitPromptText = buildPrompt(formData, portraitPrompt);
			const portraitResult = await generateImage(portraitPromptText);

			if (portraitResult.images.length === 0) {
				return fail(500, { 
					error: 'No portrait images were generated. The AI might not support image generation for this prompt or model.' 
				});
			}

			// Step 2: Generate game sprite sheet using portrait as reference
			const spritesheetPromptText = buildPrompt(formData, spritesheetPrompt);
			const spritesheetResult = await generateImage(
				spritesheetPromptText, 
				{
					base64Data: portraitResult.images[0].base64Data,
					mimeType: portraitResult.images[0].mimeType
				}
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

		} catch (error: any) {
			console.error('Error generating character:', error);
			return fail(500, { 
				error: error.message || 'Failed to generate character. Please check your API key and try again.' 
			});
		}
	}
};
