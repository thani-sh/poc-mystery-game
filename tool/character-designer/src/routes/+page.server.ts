import { fail } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { GoogleGenAI } from '@google/genai';
import mime from 'mime';

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

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const apiKey = formData.get('apiKey') as string;

		if (!apiKey) {
			return fail(400, { error: 'API key is required' });
		}

		try {
			// Load prompts
			const { portraitPrompt, spritesheetPrompt } = await loadPrompts();
			const characterType = formData.get('characterType') as string;
			const basePrompt = characterType === 'portrait' ? portraitPrompt : spritesheetPrompt;

			// Build prompt
			const prompt = buildPrompt(formData, basePrompt);

			// Initialize Google GenAI
			const ai = new GoogleGenAI({
				apiKey: apiKey,
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

			const contents = [
				{
					role: 'user',
					parts: [
						{
							text: prompt,
						},
					],
				},
			];

			// Generate content
			const response = await ai.models.generateContentStream({
				model,
				config,
				contents,
			});

			const images: Array<{ dataUrl: string; extension: string }> = [];
			let textResponse = '';

			for await (const chunk of response) {
				if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
					continue;
				}

				if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
					const inlineData = chunk.candidates[0].content.parts[0].inlineData;
					const fileExtension = mime.getExtension(inlineData.mimeType || '') || 'png';
					const buffer = Buffer.from(inlineData.data || '', 'base64');
					const dataUrl = `data:${inlineData.mimeType};base64,${buffer.toString('base64')}`;
					images.push({ dataUrl, extension: fileExtension });
				} else if (chunk.text) {
					textResponse += chunk.text;
				}
			}

			if (images.length === 0) {
				return fail(500, { 
					error: 'No images were generated. The AI might not support image generation for this prompt or model.' 
				});
			}

			return {
				success: true,
				images,
				prompt,
				textResponse
			};

		} catch (error: any) {
			console.error('Error generating character:', error);
			return fail(500, { 
				error: error.message || 'Failed to generate character. Please check your API key and try again.' 
			});
		}
	}
};
