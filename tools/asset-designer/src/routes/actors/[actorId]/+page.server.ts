import { getActorConceptDataUrl, hasActorConcept } from '$lib/server/filesystem';
import { getActor, getSpecFile } from '$lib/server/filesystem';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const actor = await getActor(params.actorId);

	if (!actor) {
		throw error(404, 'Actor not found');
	}

	return {
		actor,
		hasConcept: await hasActorConcept(params.actorId),
		conceptDataUrl: await getActorConceptDataUrl(params.actorId)
	};
}
