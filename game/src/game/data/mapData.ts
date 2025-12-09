import type { GameMap } from "../types";
import { Direction, TriggerType } from "../types";

/**
 * Sample battle map for testing
 */
export const sampleBattleMap: GameMap = {
  id: "battle_plains_01",
  name: "Plains Battle",
  width: 12,
  height: 10,
  // 0 = grass, 4 = forest, 5 = mountain, 6 = wall
  tiles: [
    [0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0],
    [0, 0, 4, 0, 0, 0, 0, 0, 5, 5, 0, 0],
    [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 5, 0, 0, 0, 4, 0, 0, 0],
    [0, 0, 0, 0, 5, 0, 0, 0, 4, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  units: [
    // Player units
    {
      characterId: "hero",
      position: { x: 2, y: 8 },
      direction: Direction.Up,
    },
    {
      characterId: "mage",
      position: { x: 3, y: 9 },
      direction: Direction.Up,
    },
    {
      characterId: "healer",
      position: { x: 1, y: 9 },
      direction: Direction.Up,
    },
    // Enemy units
    {
      characterId: "goblin_1",
      position: { x: 8, y: 1 },
      direction: Direction.Down,
    },
    {
      characterId: "goblin_2",
      position: { x: 9, y: 2 },
      direction: Direction.Down,
    },
  ],
  triggers: [],
};

/**
 * Sample exploration map
 */
export const sampleTownMap: GameMap = {
  id: "town_center",
  name: "Town Center",
  width: 20,
  height: 15,
  tiles: [
    // Simplified town layout (would typically be more detailed)
    ...Array(15)
      .fill(null)
      .map(() => Array(20).fill(0)),
  ],
  units: [
    {
      characterId: "hero",
      position: { x: 10, y: 12 },
      direction: Direction.Up,
    },
  ],
  triggers: [
    {
      id: "town_entrance",
      type: TriggerType.OnEnter,
      position: { x: 10, y: 14 },
      action: "startDialogue",
      data: { dialogueId: "welcome_to_town" },
    },
  ],
};

/**
 * Map registry - add new maps here
 */
export const MAP_REGISTRY: Record<string, GameMap> = {
  battle_plains_01: sampleBattleMap,
  town_center: sampleTownMap,
};

/**
 * Get a map by ID
 */
export function getMapById(id: string): GameMap | undefined {
  return MAP_REGISTRY[id];
}
