import { json } from '@sveltejs/kit';
import {
	updateActor,
	getActor,
	getSpecFile,
	saveActorConcept,
	saveActorSpeech,
	getSpeechSpecFile
} from '$lib/server/filesystem';
import { generateImage, buildConceptPrompt, buildSpeechPrompt } from '$lib/server/gemini';
import fs from 'fs/promises';
import path from 'path';

export async function POST({ request, params }) {
	const { action, content } = await request.json();

	if (action === 'save') {
		try {
			await updateActor(params.actorId, content);
			return json({ success: true });
		} catch (error) {
			console.error('Error saving actor:', error);
			return json({ success: false, error: 'Failed to save actor' }, { status: 500 });
		}
	}

	if (action === 'generate') {
		try {
			// Get actor and base portrait spec
			const actor = await getActor(params.actorId);
			const baseConcept = await getSpecFile('base-concept');

			if (!actor || !baseConcept) {
				return json({ success: false, error: 'Actor or base concept not found' }, { status: 404 });
			}

			// Build prompt
			const prompt = buildConceptPrompt(actor.content, baseConcept.content);

			// Generate image
			const result = await generateImage({ prompt });

			if (!result) {
				return json({ success: false, error: 'Failed to generate image' }, { status: 500 });
			}

			// Save image
			await saveActorConcept(params.actorId, result.data);

			return json({ success: true });
		} catch (error) {
			console.error('Error generating portrait:', error);
			return json(
				{
					success: false,
					error: error instanceof Error ? error.message : 'Failed to generate portrait'
				},
				{ status: 500 }
			);
		}
	}

	if (action === 'generate-speech-neutral' || action === 'generate-speech-talking') {
		try {
			const speechType = action === 'generate-speech-neutral' ? 'neutral' : 'talking';

			// Get actor, base speech spec, and expression spec
			const actor = await getActor(params.actorId);
			const baseSpeech = await getSpecFile('base-speech');
			const expressionSpec = await getSpeechSpecFile(speechType);

			if (!actor || !baseSpeech || !expressionSpec) {
				return json({ success: false, error: 'Required specs not found' }, { status: 404 });
			}

			// Try to load concept image as reference
			let conceptImage: Buffer | undefined;
			try {
				const ASSETS_DIR = path.resolve(process.cwd(), '../../assets');
				const conceptPath = path.join(ASSETS_DIR, 'actors', params.actorId, 'concept.png');
				conceptImage = await fs.readFile(conceptPath);
			} catch {
				// Concept image not available, continue without it
			}

			// Build prompt
			const prompt = buildSpeechPrompt(actor.content, baseSpeech.content, expressionSpec.content);

			// Generate image with optional concept reference
			const result = await generateImage({
				prompt,
				referenceImage: conceptImage
			});

			if (!result) {
				return json(
					{ success: false, error: 'Failed to generate speech portrait' },
					{ status: 500 }
				);
			}

			// Save image
			await saveActorSpeech(params.actorId, speechType, result.data);

			return json({ success: true });
		} catch (error) {
			console.error('Error generating speech portrait:', error);
			return json(
				{
					success: false,
					error: error instanceof Error ? error.message : 'Failed to generate speech portrait'
				},
				{ status: 500 }
			);
		}
	}

	return json({ success: false, error: 'Invalid action' }, { status: 400 });
}
