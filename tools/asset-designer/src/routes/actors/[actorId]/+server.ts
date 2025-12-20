import { json } from '@sveltejs/kit';
import { updateActor, getActor, getSpecFile, saveActorConcept } from '$lib/server/filesystem';
import { generateImage, buildConceptPrompt } from '$lib/server/gemini';

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

	return json({ success: false, error: 'Invalid action' }, { status: 400 });
}
