import { command } from '$app/server';
import { z } from 'zod';
import {
	getActor,
	saveActorConcept,
	saveActorSpeech,
	saveActorFrame,
	getSystemPrompt,
	getPrompt,
	getConceptArtImages,
	hasActorSpeech,
	hasActorFrame
} from '$lib/server/filesystem';
import {
	generateImage,
	buildConceptPrompt,
	buildPortraitPrompt,
	buildSpritesheetPrompt
} from '$lib/server/gemini';
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
	console.log(`Generating concept art for actor: ${actorId}`);

	const result = await generateImage({
		prompt,
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
		const actor = await getActor(actorId);
		if (!actor) {
			throw new Error('Actor not found');
		}

		const systemPrompt = await getSystemPrompt();
		const extraInstructions =
			expressionType === 'talking' ? await getPrompt('talking-portrait.prompt.md') : undefined;
		const prompt = buildPortraitPrompt(systemPrompt, actor.content, extraInstructions ?? undefined);

		const referenceImages: Buffer[] = [];
		const conceptArtImages = await getConceptArtImages();
		referenceImages.push(...conceptArtImages);
		console.log(`Generating ${expressionType} portrait for actor: ${actorId}`);

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
		console.log(`Done generating ${expressionType} portrait for actor: ${actorId}`);
		return { success: true };
	}
);

/**
 * Generate spritesheet for an actor (1:1 aspect ratio)
 */
export const generateSpritesheet = command(
	z.tuple([z.string(), z.string()]),
	async ([actorId, animationType]) => {
		const actor = await getActor(actorId);
		if (!actor) {
			throw new Error('Actor not found');
		}

		const systemPrompt = await getSystemPrompt();
		const extraInstructions = await getPrompt(`${animationType}-spritesheet.prompt.md`);
		const prompt = buildSpritesheetPrompt(
			systemPrompt,
			actor.content,
			extraInstructions ?? undefined
		);

		const referenceImages: Buffer[] = [];
		const conceptArtImages = await getConceptArtImages();
		referenceImages.push(...conceptArtImages);
		console.log(`Generating ${animationType} spritesheet for actor: ${actorId}`);

		// Add actor's concept if it exists
		try {
			const ASSETS_DIR = path.resolve(process.cwd(), '../../assets');
			const conceptPath = path.join(ASSETS_DIR, 'actors', actorId, 'concept.png');
			const conceptImage = await fs.readFile(conceptPath);
			referenceImages.push(conceptImage);
		} catch {
			// Continue without actor concept
		}

		// Add idle spritesheet as reference for other animations
		if (animationType !== 'idle') {
			try {
				const ASSETS_DIR = path.resolve(process.cwd(), '../../assets');
				const idlePath = path.join(ASSETS_DIR, 'actors', actorId, 'frames', 'idle.png');
				const idleImage = await fs.readFile(idlePath);
				referenceImages.push(idleImage);
				console.log(`Added idle spritesheet as reference for ${animationType}`);
			} catch {
				console.warn(`Idle spritesheet not found for ${actorId}, continuing without it`);
			}
		} else {
			// For idle animation, add Bets idle spritesheet as reference if available
			try {
				const ASSETS_DIR = path.resolve(process.cwd(), '../../assets');
				const betsIdlePath = path.join(ASSETS_DIR, 'actors', 'bets', 'frames', 'idle.png');
				const betsIdleImage = await fs.readFile(betsIdlePath);
				referenceImages.push(betsIdleImage);
				console.log(`Added Bets idle spritesheet as reference for ${animationType}`);
			} catch {
				console.log(`Bets idle spritesheet not found, continuing without it`);
			}
		}

		const result = await generateImage({
			prompt,
			referenceImages: referenceImages.length > 0 ? referenceImages : undefined,
			aspectRatio: '1:1'
		});

		if (!result) {
			throw new Error('Failed to generate spritesheet');
		}

		await saveActorFrame(actorId, animationType, result.data);
		console.log(`Done generating ${animationType} spritesheet for actor: ${actorId}`);
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
				// We call the existing generatePortrait logic directly
				// But since it's a command wrapper, we need to extract the logic or just use it if possible
				// Actually, it's better to just call the same underlying logic.
				// Since generatePortrait is already exported, we can't easily "un-command" it here without refactoring.
				// However, we can just perform the same steps.

				const actor = await getActor(actorId);
				if (!actor) throw new Error('Actor not found');

				const systemPrompt = await getSystemPrompt();
				const extraInstructions =
					type === 'talking' ? await getPrompt('talking-portrait.prompt.md') : undefined;
				const prompt = buildPortraitPrompt(
					systemPrompt,
					actor.content,
					extraInstructions ?? undefined
				);

				const referenceImages: Buffer[] = [];
				const conceptArtImages = await getConceptArtImages();
				referenceImages.push(...conceptArtImages);
				console.log(`Generating missing portrait: ${type} for actor: ${actorId}`);

				try {
					const ASSETS_DIR = path.resolve(process.cwd(), '../../assets');
					const conceptPath = path.join(ASSETS_DIR, 'actors', actorId, 'concept.png');
					const conceptImage = await fs.readFile(conceptPath);
					referenceImages.push(conceptImage);
				} catch {
					/* Continue */
				}

				const result = await generateImage({
					prompt,
					referenceImages: referenceImages.length > 0 ? referenceImages : undefined,
					aspectRatio: '3:4'
				});

				if (!result) throw new Error('Failed to generate portrait');

				await saveActorSpeech(actorId, type, result.data);
				console.log(`Done generating missing portrait: ${type} for actor: ${actorId}`);
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
				const actor = await getActor(actorId);
				if (!actor) throw new Error('Actor not found');

				const systemPrompt = await getSystemPrompt();
				const extraInstructions = await getPrompt(`${type}-spritesheet.prompt.md`);
				const prompt = buildSpritesheetPrompt(
					systemPrompt,
					actor.content,
					extraInstructions ?? undefined
				);

				const referenceImages: Buffer[] = [];
				const conceptArtImages = await getConceptArtImages();
				referenceImages.push(...conceptArtImages);
				console.log(`Generating missing spritesheet: ${type} for actor: ${actorId}`);

				try {
					const ASSETS_DIR = path.resolve(process.cwd(), '../../assets');
					const conceptPath = path.join(ASSETS_DIR, 'actors', actorId, 'concept.png');
					const conceptImage = await fs.readFile(conceptPath);
					referenceImages.push(conceptImage);
				} catch {
					/* Continue */
				}

				// Add idle spritesheet as reference for other animations
				if (type !== 'idle') {
					try {
						const ASSETS_DIR = path.resolve(process.cwd(), '../../assets');
						const idlePath = path.join(ASSETS_DIR, 'actors', actorId, 'frames', 'idle.png');
						const idleImage = await fs.readFile(idlePath);
						referenceImages.push(idleImage);
						console.log(`Added idle spritesheet as reference for ${type}`);
					} catch {
						console.warn(`Idle spritesheet not found for ${actorId}, continuing without it`);
					}
				} else {
					// For idle animation, add Bets idle spritesheet as reference if available
					try {
						const ASSETS_DIR = path.resolve(process.cwd(), '../../assets');
						const betsIdlePath = path.join(ASSETS_DIR, 'actors', 'bets', 'frames', 'idle.png');
						const betsIdleImage = await fs.readFile(betsIdlePath);
						referenceImages.push(betsIdleImage);
						console.log(`Added Bets idle spritesheet as reference for ${type}`);
					} catch {
						console.log(`Bets idle spritesheet not found, continuing without it`);
					}
				}

				const result = await generateImage({
					prompt,
					referenceImages: referenceImages.length > 0 ? referenceImages : undefined,
					aspectRatio: '1:1'
				});

				if (!result) throw new Error('Failed to generate spritesheet');

				await saveActorFrame(actorId, type, result.data);
				console.log(`Done generating missing spritesheet: ${type} for actor: ${actorId}`);
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
