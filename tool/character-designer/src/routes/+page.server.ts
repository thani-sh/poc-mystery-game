import { fail } from '@sveltejs/kit';
import { readFile, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { GoogleGenAI } from '@google/genai';
import mime from 'mime';
import { GEMINI_API_KEY } from '$env/static/private';

// Load prompt templates - use absolute path from project root
const projectRoot = process.cwd().includes('tool/character-designer') 
	? join(process.cwd(), '../..')
	: process.cwd();
const promptsPath = join(projectRoot, 'docs/prompts');
const dataPath = join(projectRoot, 'tool/character-designer/data');

async function loadPrompts() {
	const portraitPrompt = await readFile(join(promptsPath, 'character-portrait-prompt.md'), 'utf-8');
	const spritesheetPrompt = await readFile(join(promptsPath, 'character-spritesheet-prompt.md'), 'utf-8');
	return { portraitPrompt, spritesheetPrompt };
}

// Constants for character generation
const DEFAULT_CHARACTER_CONTEXT = 'a human character from the UK';
const DEFAULT_CLOTHING = 'everyday casual clothes from the 1980s';
const DEFAULT_FEATURES = 'typical features for their age';

function buildPrompt(formData: FormData, basePrompt: string) {
	const baseCharacter = (formData.get('baseCharacter') as string)?.trim();
	const customDetails = (formData.get('customDetails') as string)?.trim();

	// Build character description
	let characterDesc = '';
	
	// Start with base character reference if provided
	if (baseCharacter) {
		characterDesc = `${baseCharacter}, ${DEFAULT_CHARACTER_CONTEXT}`;
	} else {
		characterDesc = DEFAULT_CHARACTER_CONTEXT;
	}

	// Add custom details if provided
	if (customDetails) {
		characterDesc += '. ' + customDetails;
	}

	// Replace placeholders in base prompt
	let finalPrompt = basePrompt;

	// Replace the INSERT markers with our character description
	// For the simplified form, all custom details go into CHARACTER DESCRIPTION
	// The other placeholders use generic defaults since we can't parse details
	finalPrompt = finalPrompt.replace(
		/\[INSERT CHARACTER DESCRIPTION\]/g,
		characterDesc
	);

	finalPrompt = finalPrompt.replace(
		/\[INSERT KEY PHYSICAL FEATURES:[^\]]*\]/g,
		DEFAULT_FEATURES
	);

	finalPrompt = finalPrompt.replace(
		/\[INSERT CLOTHING DETAILS:[^\]]*\]/g,
		DEFAULT_CLOTHING
	);

	return finalPrompt;
}

// Generate a short description for directory naming
function generateShortDescription(baseCharacter: string, customDetails: string): string {
	const text = baseCharacter || customDetails || 'character';
	// Take first few words and clean them
	const words = text
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, '')
		.split(/\s+/)
		.filter(w => w.length > 0)
		.slice(0, 3);
	return words.join('-') || 'character';
}

// Generate timestamp-based directory name
function generateDirectoryName(baseCharacter: string, customDetails: string): string {
	const now = new Date();
	const timestamp = now.toISOString().replace(/:/g, '-').replace(/\..+/, '').replace('T', '_');
	const description = generateShortDescription(baseCharacter, customDetails);
	return `${timestamp}_${description}`;
}

// Save prompt and images to disk
async function saveGenerationData(
	dirName: string,
	prompt: string,
	images: Array<{ base64Data: string; extension: string; mimeType: string }>,
	metadata: { baseCharacter: string; customDetails: string }
) {
	const savePath = join(dataPath, dirName);
	await mkdir(savePath, { recursive: true });

	// Save metadata and prompt
	await writeFile(
		join(savePath, 'metadata.json'),
		JSON.stringify({
			timestamp: new Date().toISOString(),
			baseCharacter: metadata.baseCharacter,
			customDetails: metadata.customDetails,
		}, null, 2)
	);

	await writeFile(join(savePath, 'prompt.txt'), prompt);

	// Save images
	for (let i = 0; i < images.length; i++) {
		const image = images[i];
		const filename = i === 0 ? `portrait.${image.extension}` : `spritesheet.${image.extension}`;
		const buffer = Buffer.from(image.base64Data, 'base64');
		await writeFile(join(savePath, filename), buffer);
	}

	return savePath;
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
	generatePrompt: async ({ request }) => {
		const formData = await request.formData();

		try {
			// Load prompts
			const { portraitPrompt, spritesheetPrompt } = await loadPrompts();

			// Generate prompts
			const portraitPromptText = buildPrompt(formData, portraitPrompt);
			const spritesheetPromptText = buildPrompt(formData, spritesheetPrompt);

			const combinedPrompt = `Portrait:\n${portraitPromptText}\n\nSprite Sheet:\n${spritesheetPromptText}`;

			return {
				success: true,
				generatedPrompt: combinedPrompt,
			};

		} catch (error: any) {
			console.error('Error generating prompt:', error);
			return fail(500, { 
				error: error.message || 'Failed to generate prompt.' 
			});
		}
	},

	generateImages: async ({ request }) => {
		const formData = await request.formData();
		const customPrompt = (formData.get('prompt') as string)?.trim();

		if (!GEMINI_API_KEY) {
			return fail(500, { error: 'GEMINI_API_KEY environment variable is not set. Please add it to your .env file.' });
		}

		if (!customPrompt) {
			return fail(400, { error: 'No prompt provided. Please generate a prompt first.' });
		}

		try {
			// Split the combined prompt
			const prompts = customPrompt.split('\n\nSprite Sheet:\n');
			const portraitPromptText = prompts[0]?.replace('Portrait:\n', '') || customPrompt;
			const spritesheetPromptText = prompts[1] || '';

			// Step 1: Generate portrait sprite sheet first
			const portraitResult = await generateImage(portraitPromptText);

			if (portraitResult.images.length === 0) {
				return fail(500, { 
					error: 'No portrait images were generated. The AI might not support image generation for this prompt or model.' 
				});
			}

			// Step 2: Generate game sprite sheet using portrait as reference (if we have a spritesheet prompt)
			let spritesheetResult = { images: [], textResponse: '' };
			if (spritesheetPromptText) {
				spritesheetResult = await generateImage(
					spritesheetPromptText, 
					{
						base64Data: portraitResult.images[0].base64Data,
						mimeType: portraitResult.images[0].mimeType
					}
				);
			}

			const allImages = [...portraitResult.images, ...spritesheetResult.images];

			// Save to disk
			const baseCharacter = (formData.get('baseCharacter') as string)?.trim() || '';
			const customDetails = (formData.get('customDetails') as string)?.trim() || '';
			const dirName = generateDirectoryName(baseCharacter, customDetails);
			
			const savedPath = await saveGenerationData(
				dirName,
				customPrompt,
				allImages,
				{ baseCharacter, customDetails }
			);

			// Return result
			const warning = spritesheetResult.images.length === 0 && spritesheetPromptText
				? 'Sprite sheet generation failed. Showing portrait only.'
				: undefined;

			return {
				success: true,
				images: allImages,
				prompt: customPrompt,
				generatedPrompt: customPrompt,
				savedPath: dirName,
				warning,
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
