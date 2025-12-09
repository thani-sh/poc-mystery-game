import type { Character } from "../types";
import { CharacterClass, Direction } from "../types";

/**
 * Sample player character
 */
export const DETECTIVE: Character = {
  id: "detective",
  name: "Detective Morgan",
  class: CharacterClass.Detective,
  stats: {
    speed: 12,
    movement: 5,
  },
  position: { x: 0, y: 0 },
  direction: Direction.Down,
  sprite: "characters/detective",
  isPlayer: true,
  clues: [],
};

/**
 * Sample NPCs
 */
export const JOURNALIST: Character = {
  id: "journalist",
  name: "Sarah Chen",
  class: CharacterClass.Journalist,
  stats: {
    speed: 10,
    movement: 4,
  },
  position: { x: 0, y: 0 },
  direction: Direction.Down,
  sprite: "characters/journalist",
  isPlayer: false,
  dialogueId: "journalist_intro",
  clues: ["clue_newspaper"],
};

export const SCIENTIST: Character = {
  id: "scientist",
  name: "Dr. Harris",
  class: CharacterClass.Scientist,
  stats: {
    speed: 8,
    movement: 4,
  },
  position: { x: 0, y: 0 },
  direction: Direction.Down,
  sprite: "characters/scientist",
  isPlayer: false,
  dialogueId: "scientist_intro",
  clues: ["clue_lab_report"],
};

export const OFFICER: Character = {
  id: "officer",
  name: "Officer Blake",
  class: CharacterClass.Officer,
  stats: {
    speed: 11,
    movement: 5,
  },
  position: { x: 0, y: 0 },
  direction: Direction.Down,
  sprite: "characters/officer",
  isPlayer: false,
  dialogueId: "officer_intro",
  clues: ["clue_police_report"],
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
    clues: [...template.clues],
  };
}

/**
 * Character registry for easy lookup
 */
export const CHARACTER_TEMPLATES = {
  detective: DETECTIVE,
  journalist: JOURNALIST,
  scientist: SCIENTIST,
  officer: OFFICER,
};
