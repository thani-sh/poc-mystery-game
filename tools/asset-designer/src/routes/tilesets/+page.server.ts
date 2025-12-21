import type { PageServerLoad } from './$types';
import { getTilesets, hasTilesetImage, hasTilesetJson } from '$lib/server/filesystem';

export const load: PageServerLoad = async () => {
	const tilesets = await getTilesets();

	// Check which tilesets have images and JSON
	const tilesetsWithStatus = await Promise.all(
		tilesets.map(async (tileset) => {
			const hasImage = await hasTilesetImage(tileset.id);
			const hasJson = await hasTilesetJson(tileset.id);
			return {
				...tileset,
				hasImage,
				hasJson
			};
		})
	);

	return {
		tilesets: tilesetsWithStatus
	};
};
