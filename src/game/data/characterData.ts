import type { Character } from "../types";
import { CharacterClass, Direction } from "../types";

/**
 * Sample player characters
 */
export const HERO: Character = {
  id: "hero",
  name: "Hero",
  class: CharacterClass.Warrior,
  level: 1,
  experience: 0,
  stats: {
    hp: 100,
    maxHp: 100,
    mp: 20,
    maxMp: 20,
    attack: 15,
    defense: 10,
    speed: 12,
    movement: 5,
  },
  position: { x: 0, y: 0 },
  direction: Direction.Down,
  sprite: "characters/hero",
  abilities: [
    {
      id: "power_strike",
      name: "Power Strike",
      description: "A powerful melee attack",
      mpCost: 5,
      range: 1,
      areaOfEffect: 0,
      damage: 25,
      healing: 0,
      statusEffects: [],
    },
  ],
  statusEffects: [],
  isPlayer: true,
};

export const MAGE: Character = {
  id: "mage",
  name: "Mage",
  class: CharacterClass.Mage,
  level: 1,
  experience: 0,
  stats: {
    hp: 70,
    maxHp: 70,
    mp: 50,
    maxMp: 50,
    attack: 8,
    defense: 5,
    speed: 10,
    movement: 4,
  },
  position: { x: 0, y: 0 },
  direction: Direction.Down,
  sprite: "characters/mage",
  abilities: [
    {
      id: "fireball",
      name: "Fireball",
      description: "A ball of fire that damages enemies",
      mpCost: 10,
      range: 3,
      areaOfEffect: 1,
      damage: 30,
      healing: 0,
      statusEffects: [],
    },
  ],
  statusEffects: [],
  isPlayer: true,
};

export const HEALER: Character = {
  id: "healer",
  name: "Healer",
  class: CharacterClass.Healer,
  level: 1,
  experience: 0,
  stats: {
    hp: 80,
    maxHp: 80,
    mp: 40,
    maxMp: 40,
    attack: 10,
    defense: 8,
    speed: 11,
    movement: 4,
  },
  position: { x: 0, y: 0 },
  direction: Direction.Down,
  sprite: "characters/healer",
  abilities: [
    {
      id: "heal",
      name: "Heal",
      description: "Restores ally HP",
      mpCost: 8,
      range: 2,
      areaOfEffect: 0,
      damage: 0,
      healing: 30,
      statusEffects: [],
    },
  ],
  statusEffects: [],
  isPlayer: true,
};

/**
 * Sample enemy characters
 */
export const GOBLIN: Character = {
  id: "goblin_1",
  name: "Goblin",
  class: CharacterClass.Warrior,
  level: 1,
  experience: 0,
  stats: {
    hp: 50,
    maxHp: 50,
    mp: 0,
    maxMp: 0,
    attack: 12,
    defense: 5,
    speed: 8,
    movement: 4,
  },
  position: { x: 0, y: 0 },
  direction: Direction.Down,
  sprite: "characters/goblin",
  abilities: [],
  statusEffects: [],
  isPlayer: false,
};

/**
 * Create a new character instance from a template
 */
export function createCharacter(
  template: Character,
  overrides?: Partial<Character>,
): Character {
  return {
    ...template,
    ...overrides,
    stats: { ...template.stats, ...(overrides?.stats ?? {}) },
    abilities: [...template.abilities],
    statusEffects: [],
  };
}

/**
 * Character registry for easy lookup
 */
export const CHARACTER_TEMPLATES = {
  hero: HERO,
  mage: MAGE,
  healer: HEALER,
  goblin: GOBLIN,
};
