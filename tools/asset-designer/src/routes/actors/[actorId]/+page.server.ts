import {
	getActor,
	getActorConceptDataUrl,
	getActorSpeechDataUrl,
	getActorFrameDataUrl,
	hasActorConcept,
	hasActorSpeech,
	hasActorFrame
} from '$lib/server/filesystem';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const actor = await getActor(params.actorId);

	if (!actor) {
		throw error(404, 'Actor not found');
	}

	// Define available expression types and animation types
	const expressionTypes = ['talking'];
	const animationTypes = ['idle', 'walk'];
	const directions = ['down', 'left', 'right', 'up'];

	// Load speech portraits for all expression types
	const speechPortraits: Record<string, { exists: boolean; dataUrl: string | null }> = {};
	for (const expressionType of expressionTypes) {
		speechPortraits[expressionType] = {
			exists: await hasActorSpeech(params.actorId, expressionType),
			dataUrl: await getActorSpeechDataUrl(params.actorId, expressionType)
		};
	}

	// Load frames for all animation types
	const animations: Record<string, { exists: boolean; dataUrl: string | null }> = {};
	for (const animationType of animationTypes) {
		animations[animationType] = {
			exists: await hasActorFrame(params.actorId, animationType),
			dataUrl: await getActorFrameDataUrl(params.actorId, animationType)
		};
	}

	return {
		actor,
		hasConcept: await hasActorConcept(params.actorId),
		conceptDataUrl: await getActorConceptDataUrl(params.actorId),
		expressionTypes,
		speechPortraits,
		animationTypes,
		animations,
		directions
	};
}
