import type { PageServerLoad } from './$types';
import {
	getTileset,
	hasTilesetImage,
	hasTilesetJson,
	getTilesetImageDataUrl,
	getTilesetJson
} from '$lib/server/filesystem';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { tilesetId } = params;
	const tileset = await getTileset(tilesetId);

	if (!tileset) {
		throw error(404, 'Tileset not found');
	}

	const hasImage = await hasTilesetImage(tilesetId);
	const hasJson = await hasTilesetJson(tilesetId);

	let imageDataUrl: string | null = null;
	let jsonData: any | null = null;

	if (hasImage) {
		imageDataUrl = await getTilesetImageDataUrl(tilesetId);
	}

	if (hasJson) {
		jsonData = await getTilesetJson(tilesetId);
	}

	return {
		tileset,
		hasImage,
		hasJson,
		imageDataUrl,
		jsonData
	};
};
