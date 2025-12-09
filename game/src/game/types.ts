/**
 * Core type definitions for the mystery game
 */

/**
 * 2D grid position
 */
export interface GridPosition {
  x: number;
  y: number;
}

/**
 * Character statistics
 */
export interface CharacterStats {
  speed: number;
  movement: number; // Movement range in tiles
}

/**
 * Tile types that define terrain properties
 */
export enum TileType {
  Ground = "ground",
  Obstacle = "obstacle",
  Water = "water",
  Forest = "forest",
  Mountain = "mountain",
}

/**
 * Tile definition
 */
export interface Tile {
  id: number;
  type: TileType;
  movementCost: number; // Cost to move through this tile
  sprite: string; // Asset path for the tile sprite
}

/**
 * Direction enumeration for character facing and movement
 */
export enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

/**
 * Character class types
 */
export enum CharacterClass {
  Detective = "detective",
  Journalist = "journalist",
  Scientist = "scientist",
  Officer = "officer",
}

/**
 * Clue types
 */
export enum ClueType {
  Physical = "physical",
  Testimony = "testimony",
  Document = "document",
  Photograph = "photograph",
}

/**
 * Clue definition
 */
export interface Clue {
  id: string;
  name: string;
  description: string;
  type: ClueType;
  relatedCharacters: string[]; // Character IDs related to this clue
  relatedClues: string[]; // Other clue IDs related to this clue
}

/**
 * Character/NPC definition
 */
export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  stats: CharacterStats;
  position: GridPosition;
  direction: Direction;
  sprite: string; // Base sprite name for this character
  isPlayer: boolean; // true for player character, false for NPCs
  dialogueId?: string; // ID of dialogue tree for this character
  clues: string[]; // Clue IDs that this character knows about
}

/**
 * Unit placement on a map
 */
export interface UnitPlacement {
  characterId: string;
  position: GridPosition;
  direction: Direction;
}

/**
 * Event trigger types
 */
export enum TriggerType {
  OnEnter = "onEnter",
  OnInteract = "onInteract",
  OnClueFound = "onClueFound",
  OnDialogueComplete = "onDialogueComplete",
}

/**
 * Map trigger/event
 */
export interface Trigger {
  id: string;
  type: TriggerType;
  position: GridPosition;
  action: string; // Action identifier (e.g., "startDialogue", "openChest")
  data: Record<string, unknown>; // Additional data for the action
}

/**
 * Game map definition
 */
export interface GameMap {
  id: string;
  name: string;
  width: number; // Width in tiles
  height: number; // Height in tiles
  tiles: number[][]; // 2D array of tile IDs
  characters: UnitPlacement[]; // Character placements (renamed from units)
  triggers: Trigger[];
  clues: ClueLocation[]; // Clues that can be found on this map
}

/**
 * Clue location on a map
 */
export interface ClueLocation {
  clueId: string;
  position: GridPosition;
  revealed: boolean; // Whether the clue has been found
}

/**
 * Dialogue choice
 */
export interface DialogueChoice {
  text: string;
  nextNodeId: string;
  requiresClue?: string; // Optional clue ID required to see this choice
}

/**
 * Dialogue node
 */
export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  choices: DialogueChoice[];
}

/**
 * Dialogue tree
 */
export interface DialogueTree {
  id: string;
  startNodeId: string;
  nodes: DialogueNode[];
}
