import { json } from '@sveltejs/kit';
import {
	updateActor,
	getActor,
	getSpecFile,
	saveActorConcept,
	saveActorSpeech,
	saveActorFrame,
	getSpeechSpecFile,
	getFrameSpecFile
} from '$lib/server/filesystem';
import {
	generateImage,
	buildConceptPrompt,
	buildSpeechPrompt,
	buildFramePrompt
} from '$lib/server/gemini';
import fs from 'fs/promises';
import path from 'path';

export async function POST({ request, params }) {
	const { action, content, expressionType, frameType } = await request.json();

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

	// Handle generic speech portrait generation
	if (action === 'generate-speech') {
		try {
			if (!expressionType) {
				return json({ success: false, error: 'Expression type is required' }, { status: 400 });
			}

			// Get actor, base speech spec, and expression spec
			const actor = await getActor(params.actorId);
			const baseSpeech = await getSpecFile('base-speech');
			const expressionSpec = await getSpeechSpecFile(expressionType);

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
			await saveActorSpeech(params.actorId, expressionType, result.data);

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

	// Handle frame generation
	if (action === 'generate-frame') {
		try {
			if (!frameType) {
				return json({ success: false, error: 'Frame type is required' }, { status: 400 });
			}

			// Get actor, base frames spec, and specific frame spec
			const actor = await getActor(params.actorId);
			const baseFrames = await getSpecFile('base-frames');
			const frameSpec = await getFrameSpecFile(frameType);

			if (!actor || !baseFrames || !frameSpec) {
				return json({ success: false, error: 'Required specs not found' }, { status: 404 });
			}

			// Try to load concept image as reference
			const ASSETS_DIR = path.resolve(process.cwd(), '../../assets');
			const referenceImages: Buffer[] = [];

			try {
				const conceptPath = path.join(ASSETS_DIR, 'actors', params.actorId, 'concept.png');
				const conceptImage = await fs.readFile(conceptPath);
				referenceImages.push(conceptImage);
			} catch {
				// Concept image not available
			}

			// For frames other than idle-down, also use idle-down as reference
			let hasIdleDownReference = false;
			if (frameType !== 'idle-down') {
				try {
					const idleDownPath = path.join(
						ASSETS_DIR,
						'actors',
						params.actorId,
						'frames',
						'idle-down.png'
					);
					const idleDownImage = await fs.readFile(idleDownPath);
					referenceImages.push(idleDownImage);
					hasIdleDownReference = true;
				} catch {
					// Idle-down frame not available yet
				}
			}

			// Build prompt
			const prompt = buildFramePrompt(
				actor.content,
				baseFrames.content,
				frameSpec.content,
				hasIdleDownReference
			);

			// Generate image with reference images
			const result = await generateImage({
				prompt,
				referenceImages: referenceImages.length > 0 ? referenceImages : undefined
			});

			if (!result) {
				return json({ success: false, error: 'Failed to generate frame' }, { status: 500 });
			}

			// Save image
			await saveActorFrame(params.actorId, frameType, result.data);

			return json({ success: true });
		} catch (error) {
			console.error('Error generating frame:', error);
			return json(
				{
					success: false,
					error: error instanceof Error ? error.message : 'Failed to generate frame'
				},
				{ status: 500 }
			);
		}
	}

	// Keep backward compatibility for old action names
	if (action === 'generate-speech-neutral' || action === 'generate-speech-talking') {
		const speechType = action === 'generate-speech-neutral' ? 'neutral' : 'talking';
		// Reuse the speech generation logic
		try {
			const actor = await getActor(params.actorId);
			const baseSpeech = await getSpecFile('base-speech');
			const expressionSpec = await getSpeechSpecFile(speechType);

			if (!actor || !baseSpeech || !expressionSpec) {
				return json({ success: false, error: 'Required specs not found' }, { status: 404 });
			}

			let conceptImage: Buffer | undefined;
			try {
				const ASSETS_DIR = path.resolve(process.cwd(), '../../assets');
				const conceptPath = path.join(ASSETS_DIR, 'actors', params.actorId, 'concept.png');
				conceptImage = await fs.readFile(conceptPath);
			} catch {
				// Concept image not available
			}

			const prompt = buildSpeechPrompt(actor.content, baseSpeech.content, expressionSpec.content);
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
