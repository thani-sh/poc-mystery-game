import { command } from '$app/server';
import { z } from 'zod';
import {
	getActor,
	saveActorConcept,
	saveActorSpeech,
	saveActorFrame,
	getSystemPrompt,
	getConceptArtImages
} from '$lib/server/filesystem';
import { generateImage, buildConceptPrompt, buildPortraitPrompt, buildSpritesheetPrompt } from '$lib/server/gemini';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generate concept art for an actor (16:9 aspect ratio)
 */
export const generateConcept = command(z.string(), async (actorId) => {
	const actor = await getActor(actorId);
	if (!actor) {
		throw new Error('Actor not found');
	}

	const systemPrompt = await getSystemPrompt();
	const prompt = buildConceptPrompt(systemPrompt, actor.content);
	const referenceImages = await getConceptArtImages();

	const result = await generateImage({
		prompt,
		referenceImages: referenceImages.length > 0 ? referenceImages : undefined,
		aspectRatio: '16:9'
	});

	if (!result) {
		throw new Error('Failed to generate concept image');
	}

	await saveActorConcept(actorId, result.data);
	return { success: true };
});

/**
 * Generate portrait for an actor (3:4 aspect ratio)
 */
export const generatePortrait = command(z.tuple([z.string(), z.string()]), async ([actorId, expressionType]) => {
	const actor = await getActor(actorId);
	if (!actor) {
		throw new Error('Actor not found');
	}

	const systemPrompt = await getSystemPrompt();
	const prompt = buildPortraitPrompt(systemPrompt, actor.content);

	const referenceImages: Buffer[] = [];
	const conceptArtImages = await getConceptArtImages();
	referenceImages.push(...conceptArtImages);

	// Add actor's concept if it exists
	try {
		const ASSETS_DIR = path.resolve(process.cwd(), '../../assets');
		const conceptPath = path.join(ASSETS_DIR, 'actors', actorId, 'concept.png');
		const conceptImage = await fs.readFile(conceptPath);
		referenceImages.push(conceptImage);
	} catch {
		// Continue without actor concept
	}

	const result = await generateImage({
		prompt,
		referenceImages: referenceImages.length > 0 ? referenceImages : undefined,
		aspectRatio: '3:4'
	});

	if (!result) {
		throw new Error('Failed to generate portrait');
	}

	await saveActorSpeech(actorId, expressionType, result.data);
	return { success: true };
});

/**
 * Generate spritesheet for an actor (1:1 aspect ratio)
 */
export const generateSpritesheet = command(z.tuple([z.string(), z.string()]), async ([actorId, frameType]) => {
	const actor = await getActor(actorId);
	if (!actor) {
		throw new Error('Actor not found');
	}

	const systemPrompt = await getSystemPrompt();
	const prompt = buildSpritesheetPrompt(systemPrompt, actor.content);

	const referenceImages: Buffer[] = [];
	const conceptArtImages = await getConceptArtImages();
	referenceImages.push(...conceptArtImages);

	// Add actor's concept if it exists
	try {
		const ASSETS_DIR = path.resolve(process.cwd(), '../../assets');
		const conceptPath = path.join(ASSETS_DIR, 'actors', actorId, 'concept.png');
		const conceptImage = await fs.readFile(conceptPath);
		referenceImages.push(conceptImage);
	} catch {
		// Continue without actor concept
	}

	const result = await generateImage({
		prompt,
		referenceImages: referenceImages.length > 0 ? referenceImages : undefined,
		aspectRatio: '1:1'
	});

	if (!result) {
		throw new Error('Failed to generate spritesheet');
	}

	await saveActorFrame(actorId, frameType, result.data);
	return { success: true };
});
