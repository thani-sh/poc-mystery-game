import { command } from '$app/server';
import { z } from 'zod';
import {
	getTileset,
	getSystemPrompt,
	saveTilesetImage,
	saveTilesetJson
} from '$lib/server/filesystem';
import { generateImage, generateText, buildTilesetPrompt } from '$lib/server/gemini';

/**
 * Generate tileset image and JSON for a tileset
 */
export const generateTileset = command(z.string(), async (tilesetId) => {
	const tileset = await getTileset(tilesetId);
	if (!tileset) {
		throw new Error('Tileset not found');
	}

	const systemPrompt = await getSystemPrompt();

	console.log(`Generating tileset JSON for: ${tilesetId}`);

	// Step 1: Generate the tileset JSON descriptor using Gemini Flash
	const jsonPrompt = `${tileset.content}

Generate a detailed JSON descriptor for a 16x16 tile grid (256 tiles total) for this tileset. The JSON should include:
- name: The tileset name
- tileSize: 16 (pixels per tile)
- gridWidth: 16
- gridHeight: 16
- totalTiles: 256
- tiles: An array of 256 tile objects, each with:
  - id: tile index (0-255)
  - x: column position (0-15)
  - y: row position (0-15)
  - type: tile type/category (e.g., "grass", "dirt", "path", "water", "flower", "tree", "fence", etc.)
  - description: brief description of the tile content

Provide a diverse set of tiles suitable for creating the described environment. Include ground tiles, decorative elements, transitions, and variations. Return ONLY the JSON, no other text.`;

	const jsonText = await generateText(jsonPrompt);
	if (!jsonText) {
		throw new Error('Failed to generate tileset JSON');
	}

	// Parse and validate the JSON
	let tilesetJson: any;
	try {
		// Extract JSON from markdown code blocks if present
		const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
		const cleanJson = jsonMatch ? jsonMatch[1].trim() : jsonText.trim();
		tilesetJson = JSON.parse(cleanJson);
		console.log(`Generated JSON with ${tilesetJson.tiles?.length || 0} tiles`);
	} catch (error) {
		console.error('Failed to parse generated JSON:', error);
		throw new Error('Failed to parse tileset JSON from AI response');
	}

	// Save the JSON first
	await saveTilesetJson(tilesetId, tilesetJson);
	console.log(`Saved tileset JSON for: ${tilesetId}`);

	// Step 2: Generate the tileset image using the JSON as guidance
	console.log(`Generating tileset image for: ${tilesetId}`);

	// Build a detailed prompt that includes the tile layout from JSON
	const tileDescriptions = tilesetJson.tiles
		.map((tile: any) => `Tile ${tile.id} (${tile.x},${tile.y}): ${tile.type} - ${tile.description}`)
		.join('\n');

	const imagePrompt = await buildTilesetPrompt(
		systemPrompt,
		`${tileset.content}\n\nTile Layout:\n${tileDescriptions}`
	);

	const result = await generateImage({
		prompt: imagePrompt,
		aspectRatio: '1:1'
	});

	if (!result) {
		throw new Error('Failed to generate tileset image');
	}

	// Save the tileset image
	await saveTilesetImage(tilesetId, result.data);
	console.log(`Saved tileset image for: ${tilesetId}`);

	return { success: true };
});
