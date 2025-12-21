import { command } from '$app/server';
import { z } from 'zod';
import {
	getActor,
	saveActorConcept,
	getSystemPrompt,
	getConceptArtImages,
	hasActorSpeech,
	hasActorFrame
} from '$lib/server/filesystem';
import { generateImage, buildConceptPrompt } from '$lib/server/gemini';
import { generateActorPortrait, generateActorSpritesheet } from '$lib/server/generation';
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
	const { systemInstruction, prompt: userPrompt } = buildConceptPrompt(systemPrompt, actor.content);
	const referenceImages = await getConceptArtImages();
	console.log(`Generating concept art for actor: ${actorId}`);

	const result = await generateImage({
		prompt: userPrompt,
		systemInstruction,
		referenceImages: referenceImages.length > 0 ? referenceImages : undefined,
		aspectRatio: '16:9'
	});

	if (!result) {
		throw new Error('Failed to generate concept image');
	}

	await saveActorConcept(actorId, result.data);
	console.log(`Done generating concept art for actor: ${actorId}`);
	return { success: true };
});

/**
 * Generate portrait for an actor (3:4 aspect ratio)
 */
export const generatePortrait = command(
	z.tuple([z.string(), z.string()]),
	async ([actorId, expressionType]) => {
		await generateActorPortrait(actorId, expressionType);
		return { success: true };
	}
);

/**
 * Generate spritesheet for an actor (1:1 aspect ratio)
 */
export const generateSpritesheet = command(
	z.tuple([z.string(), z.string()]),
	async ([actorId, animationType]) => {
		await generateActorSpritesheet(actorId, animationType);
		return { success: true };
	}
);

/**
 * Generate all missing portraits for an actor
 */
export const generateMissingPortraits = command(
	z.tuple([z.string(), z.array(z.string())]),
	async ([actorId, expressionTypes]) => {
		const results: { expressionType: string; success: boolean; error?: string }[] = [];

		for (const type of expressionTypes) {
			const exists = await hasActorSpeech(actorId, type);
			if (exists) continue;

			try {
				await generateActorPortrait(actorId, type);
				results.push({ expressionType: type, success: true });
			} catch (error) {
				results.push({
					expressionType: type,
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error'
				});
			}
		}

		return { results };
	}
);

/**
 * Generate all missing spritesheets for an actor
 */
export const generateMissingSpritesheets = command(
	z.tuple([z.string(), z.array(z.string())]),
	async ([actorId, animationTypes]) => {
		const results: { animationType: string; success: boolean; error?: string }[] = [];

		for (const type of animationTypes) {
			const exists = await hasActorFrame(actorId, type);
			if (exists) continue;

			try {
				await generateActorSpritesheet(actorId, type);
				results.push({ animationType: type, success: true });
			} catch (error) {
				results.push({
					animationType: type,
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error'
				});
			}
		}

		return { results };
	}
);
