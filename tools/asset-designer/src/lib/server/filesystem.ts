import fs from 'fs/promises';
import path from 'path';

const SPEC_DIR = path.resolve(process.cwd(), '../../docs/spec');
const ACTORS_DIR = path.join(SPEC_DIR, 'actors');
const ASSETS_DIR = path.resolve(process.cwd(), '../../assets');

export interface Actor {
	id: string;
	name: string;
	description: string;
	content: string;
}

export interface SpecFile {
	id: string;
	name: string;
	content: string;
}

/**
 * Get all base spec files (excluding actors)
 */
export async function getSpecFiles(): Promise<SpecFile[]> {
	const files = await fs.readdir(SPEC_DIR);
	const specFiles: SpecFile[] = [];

	for (const file of files) {
		const filePath = path.join(SPEC_DIR, file);
		const stat = await fs.stat(filePath);
		// Skip directories and non-markdown files
		if (stat.isDirectory() || !file.endsWith('.md')) {
			continue;
		}
		const content = await fs.readFile(filePath, 'utf-8');
		specFiles.push({
			id: file.replace('.md', ''),
			name: file.replace('.md', '').replace(/-/g, ' '),
			content: content
		});
	}

	return specFiles;
}

/**
 * Get a specific spec file
 */
export async function getSpecFile(id: string): Promise<SpecFile | null> {
	try {
		const filePath = path.join(SPEC_DIR, `${id}.md`);
		const content = await fs.readFile(filePath, 'utf-8');
		return { id, name: id.replace(/-/g, ' '), content };
	} catch (error) {
		return null;
	}
}

/**
 * Update a spec file
 */
export async function updateSpecFile(id: string, content: string): Promise<void> {
	const filePath = path.join(SPEC_DIR, `${id}.md`);
	await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Get all actors
 */
export async function getActors(): Promise<Actor[]> {
	const files = await fs.readdir(ACTORS_DIR);
	const actors: Actor[] = [];

	for (const file of files) {
		if (!file.endsWith('.md')) continue;

		const filePath = path.join(ACTORS_DIR, file);
		const content = await fs.readFile(filePath, 'utf-8');
		const id = file.replace('.md', '');
		actors.push({
			id,
			name: id.replace(/-/g, ' '),
			description: '',
			content
		});
	}

	return actors;
}

/**
 * Get a specific actor
 */
export async function getActor(id: string): Promise<Actor | null> {
	try {
		const filePath = path.join(ACTORS_DIR, `${id}.md`);
		const content = await fs.readFile(filePath, 'utf-8');
		return {
			id,
			name: id.replace(/-/g, ' '),
			description: '',
			content
		};
	} catch (error) {
		return null;
	}
}

/**
 * Update an actor
 */
export async function updateActor(id: string, content: string): Promise<void> {
	const filePath = path.join(ACTORS_DIR, `${id}.md`);
	await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Get actor concept image path
 */
function getActorConceptPath(actorId: string): string {
	return path.join(ASSETS_DIR, 'actors', actorId, 'concept.png');
}

/**
 * Check if actor has a concept
 */
export async function hasActorConcept(actorId: string): Promise<boolean> {
	try {
		const conceptPath = getActorConceptPath(actorId);
		await fs.access(conceptPath);
		return true;
	} catch {
		return false;
	}
}

/**
 * Save actor concept image
 */
export async function saveActorConcept(actorId: string, imageData: Buffer): Promise<void> {
	const conceptPath = getActorConceptPath(actorId);
	const dir = path.dirname(conceptPath);

	// Create directory if it doesn't exist
	await fs.mkdir(dir, { recursive: true });
	await fs.writeFile(conceptPath, imageData);
}

/**
 * Get actor concept as base64 data URL
 */
export async function getActorConceptDataUrl(actorId: string): Promise<string | null> {
	try {
		const conceptPath = getActorConceptPath(actorId);
		const imageBuffer = await fs.readFile(conceptPath);
		const base64 = imageBuffer.toString('base64');
		return `data:image/png;base64,${base64}`;
	} catch {
		return null;
	}
}

/**
 * Get actor speech portrait path
 */
function getActorSpeechPath(actorId: string, expressionType: string): string {
	return path.join(ASSETS_DIR, 'actors', actorId, 'speech', `${expressionType}.png`);
}

/**
 * Check if actor has a speech portrait
 */
export async function hasActorSpeech(actorId: string, expressionType: string): Promise<boolean> {
	try {
		const speechPath = getActorSpeechPath(actorId, expressionType);
		await fs.access(speechPath);
		return true;
	} catch {
		return false;
	}
}

/**
 * Save actor speech portrait image
 */
export async function saveActorSpeech(
	actorId: string,
	expressionType: string,
	imageData: Buffer
): Promise<void> {
	const speechPath = getActorSpeechPath(actorId, expressionType);
	const dir = path.dirname(speechPath);

	// Create directory if it doesn't exist
	await fs.mkdir(dir, { recursive: true });
	await fs.writeFile(speechPath, imageData);
}

/**
 * Get actor speech portrait as base64 data URL
 */
export async function getActorSpeechDataUrl(
	actorId: string,
	expressionType: string
): Promise<string | null> {
	try {
		const speechPath = getActorSpeechPath(actorId, expressionType);
		const imageBuffer = await fs.readFile(speechPath);
		const base64 = imageBuffer.toString('base64');
		return `data:image/png;base64,${base64}`;
	} catch {
		return null;
	}
}

/**
 * Get speech spec file
 */
export async function getSpeechSpecFile(type: string): Promise<SpecFile | null> {
	try {
		const filePath = path.join(SPEC_DIR, 'speech', `${type}.md`);
		const content = await fs.readFile(filePath, 'utf-8');
		return { id: type, name: type, content };
	} catch (error) {
		return null;
	}
}

/**
 * Get all available speech expression types
 */
export async function getSpeechExpressionTypes(): Promise<string[]> {
	try {
		const speechDir = path.join(SPEC_DIR, 'speech');
		const files = await fs.readdir(speechDir);
		return files.filter((f) => f.endsWith('.md')).map((f) => f.replace('.md', ''));
	} catch {
		return [];
	}
}

/**
 * Get frame spec file
 */
export async function getFrameSpecFile(frameType: string): Promise<SpecFile | null> {
	try {
		const filePath = path.join(SPEC_DIR, 'frames', `${frameType}.md`);
		const content = await fs.readFile(filePath, 'utf-8');
		return { id: frameType, name: frameType, content };
	} catch (error) {
		return null;
	}
}

/**
 * Get all available frame types
 */
export async function getFrameTypes(): Promise<string[]> {
	try {
		const framesDir = path.join(SPEC_DIR, 'frames');
		const files = await fs.readdir(framesDir);
		return files.filter((f) => f.endsWith('.md')).map((f) => f.replace('.md', ''));
	} catch {
		return [];
	}
}

/**
 * Get actor frame image path
 */
function getActorFramePath(actorId: string, frameType: string): string {
	return path.join(ASSETS_DIR, 'actors', actorId, 'frames', `${frameType}.png`);
}

/**
 * Check if actor has a specific frame
 */
export async function hasActorFrame(actorId: string, frameType: string): Promise<boolean> {
	try {
		const framePath = getActorFramePath(actorId, frameType);
		await fs.access(framePath);
		return true;
	} catch {
		return false;
	}
}

/**
 * Save actor frame image
 */
export async function saveActorFrame(
	actorId: string,
	frameType: string,
	imageData: Buffer
): Promise<void> {
	const framePath = getActorFramePath(actorId, frameType);
	const dir = path.dirname(framePath);

	// Create directory if it doesn't exist
	await fs.mkdir(dir, { recursive: true });
	await fs.writeFile(framePath, imageData);
}

/**
 * Get actor frame as base64 data URL
 */
export async function getActorFrameDataUrl(
	actorId: string,
	frameType: string
): Promise<string | null> {
	try {
		const framePath = getActorFramePath(actorId, frameType);
		const imageBuffer = await fs.readFile(framePath);
		const base64 = imageBuffer.toString('base64');
		return `data:image/png;base64,${base64}`;
	} catch {
		return null;
	}
}
