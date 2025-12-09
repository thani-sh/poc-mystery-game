import type { GameMap } from "../types";
import { Direction, TriggerType } from "../types";

/**
 * Sample investigation scene map
 */
export const crimeSceneMap: GameMap = {
  id: "crime_scene",
  name: "Crime Scene - Warehouse",
  width: 12,
  height: 10,
  // 0 = floor, 4 = crates, 6 = walls
  tiles: [
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
    [6, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 6],
    [6, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 6],
    [6, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 6],
    [6, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 6],
    [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
    [6, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 6],
    [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
    [6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6],
  ],
  characters: [
    {
      characterId: "detective",
      position: { x: 2, y: 8 },
      direction: Direction.Up,
    },
    {
      characterId: "officer",
      position: { x: 9, y: 2 },
      direction: Direction.Down,
    },
  ],
  triggers: [
    {
      id: "examine_crates",
      type: TriggerType.OnInteract,
      position: { x: 4, y: 2 },
      action: "examineObject",
      data: { clueId: "clue_shipping_label" },
    },
  ],
  clues: [
    {
      clueId: "clue_footprints",
      position: { x: 3, y: 5 },
      revealed: false,
    },
    {
      clueId: "clue_broken_glass",
      position: { x: 8, y: 4 },
      revealed: false,
    },
  ],
};

/**
 * Sample town/office map
 */
export const detectiveOfficeMap: GameMap = {
  id: "detective_office",
  name: "Detective Office",
  width: 15,
  height: 12,
  tiles: [
    // Simplified office layout
    ...Array(12)
      .fill(null)
      .map(() => Array(15).fill(0)),
  ],
  characters: [
    {
      characterId: "detective",
      position: { x: 7, y: 10 },
      direction: Direction.Up,
    },
    {
      characterId: "journalist",
      position: { x: 3, y: 3 },
      direction: Direction.Down,
    },
  ],
  triggers: [
    {
      id: "examine_desk",
      type: TriggerType.OnInteract,
      position: { x: 7, y: 4 },
      action: "examineObject",
      data: { description: "Your cluttered desk with case files." },
    },
    {
      id: "talk_to_journalist",
      type: TriggerType.OnInteract,
      position: { x: 3, y: 3 },
      action: "startDialogue",
      data: { dialogueId: "journalist_intro" },
    },
  ],
  clues: [],
};

/**
 * Map registry - add new maps here
 */
export const MAP_REGISTRY: Record<string, GameMap> = {
  crime_scene: crimeSceneMap,
  detective_office: detectiveOfficeMap,
};

/**
 * Get a map by ID
 */
export function getMapById(id: string): GameMap | undefined {
  return MAP_REGISTRY[id];
}
