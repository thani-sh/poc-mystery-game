import { command } from '$app/server';
import {
	getActors,
	hasActorConcept,
	saveActorConcept,
	getSystemPrompt,
	getConceptArtImages
} from '$lib/server/filesystem';
import { generateImage, buildConceptPrompt } from '$lib/server/gemini';

/**
 * Generate concept art for all actors that don't have one
 */
export const generateMissingConcepts = command(async () => {
	const actors = await getActors();
	const systemPrompt = await getSystemPrompt();
	const referenceImages = await getConceptArtImages();

	const results: { actorId: string; success: boolean; error?: string }[] = [];

	for (const actor of actors) {
		// Check if actor already has a concept
		const hasConcept = await hasActorConcept(actor.id);
		if (hasConcept) {
			continue; // Skip actors that already have concepts
		}

		try {
			const { systemInstruction, prompt: userPrompt } = buildConceptPrompt(
				systemPrompt,
				actor.content
			);

			const result = await generateImage({
				prompt: userPrompt,
				systemInstruction,
				referenceImages: referenceImages.length > 0 ? referenceImages : undefined,
				aspectRatio: '16:9'
			});

			if (!result) {
				results.push({
					actorId: actor.id,
					success: false,
					error: 'Failed to generate image'
				});
				continue;
			}

			await saveActorConcept(actor.id, result.data);
			results.push({
				actorId: actor.id,
				success: true
			});
		} catch (error) {
			results.push({
				actorId: actor.id,
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			});
		}
	}

	return { results };
});
