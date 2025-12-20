import {
	getActor,
	getActorConceptDataUrl,
	getActorSpeechDataUrl,
	getActorFrameDataUrl,
	hasActorConcept,
	hasActorSpeech,
	hasActorFrame,
	getSpeechExpressionTypes,
	getFrameTypes
} from '$lib/server/filesystem';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const actor = await getActor(params.actorId);

	if (!actor) {
		throw error(404, 'Actor not found');
	}

	// Get all available expression types
	const expressionTypes = await getSpeechExpressionTypes();

	// Load speech portraits for all expression types
	const speechPortraits: Record<string, { exists: boolean; dataUrl: string | null }> = {};
	for (const expressionType of expressionTypes) {
		speechPortraits[expressionType] = {
			exists: await hasActorSpeech(params.actorId, expressionType),
			dataUrl: await getActorSpeechDataUrl(params.actorId, expressionType)
		};
	}

	// Get all available frame types
	const frameTypes = await getFrameTypes();

	// Load frames for all frame types
	const frames: Record<string, { exists: boolean; dataUrl: string | null }> = {};
	for (const frameType of frameTypes) {
		frames[frameType] = {
			exists: await hasActorFrame(params.actorId, frameType),
			dataUrl: await getActorFrameDataUrl(params.actorId, frameType)
		};
	}

	return {
		actor,
		hasConcept: await hasActorConcept(params.actorId),
		conceptDataUrl: await getActorConceptDataUrl(params.actorId),
		expressionTypes,
		speechPortraits,
		frameTypes,
		frames
	};
}
