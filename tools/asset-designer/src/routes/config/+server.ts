import { json } from '@sveltejs/kit';
import { updateSpecFile } from '$lib/server/filesystem';

export async function POST({ request }) {
	const { action, id, content } = await request.json();

	if (action === 'save') {
		try {
			await updateSpecFile(id, content);
			return json({ success: true });
		} catch (error) {
			console.error('Error saving spec file:', error);
			return json({ success: false, error: 'Failed to save file' }, { status: 500 });
		}
	}

	return json({ success: false, error: 'Invalid action' }, { status: 400 });
}
