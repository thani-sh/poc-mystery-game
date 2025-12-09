/**
 * Core type definitions for the JRPG game
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
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
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
  defenseBonus: number; // Defense bonus for units on this tile
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
  Warrior = "warrior",
  Mage = "mage",
  Healer = "healer",
  Archer = "archer",
  Knight = "knight",
}

/**
 * Status effect types
 */
export enum StatusEffect {
  Poisoned = "poisoned",
  Stunned = "stunned",
  Strengthened = "strengthened",
  Weakened = "weakened",
  Protected = "protected",
}

/**
 * Status effect instance
 */
export interface StatusEffectInstance {
  type: StatusEffect;
  duration: number; // Turns remaining
  power: number; // Effect strength
}

/**
 * Ability/skill definition
 */
export interface Ability {
  id: string;
  name: string;
  description: string;
  mpCost: number;
  range: number; // Attack range in tiles
  areaOfEffect: number; // 0 for single target, >0 for area
  damage: number;
  healing: number;
  statusEffects: StatusEffect[];
}

/**
 * Character/unit definition
 */
export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  experience: number;
  stats: CharacterStats;
  position: GridPosition;
  direction: Direction;
  sprite: string; // Base sprite name for this character
  abilities: Ability[];
  statusEffects: StatusEffectInstance[];
  isPlayer: boolean; // true for player units, false for enemies
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
  OnBattleWin = "onBattleWin",
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
  units: UnitPlacement[];
  triggers: Trigger[];
}

/**
 * Turn order entry
 */
export interface TurnEntry {
  characterId: string;
  initiative: number;
}

/**
 * Combat action types
 */
export enum ActionType {
  Move = "move",
  Attack = "attack",
  UseAbility = "useAbility",
  UseItem = "useItem",
  Wait = "wait",
}

/**
 * Combat action
 */
export interface CombatAction {
  type: ActionType;
  actorId: string;
  targetId?: string;
  targetPosition?: GridPosition;
  abilityId?: string;
  itemId?: string;
}
