import type { Tile } from "../types";
import { TileType } from "../types";

/**
 * Tile definitions for different terrain types
 */
export const TILES: Record<string, Tile> = {
  grass: {
    id: 0,
    type: TileType.Ground,
    movementCost: 1,
    defenseBonus: 0,
    sprite: "tiles/grass.png",
  },
  dirt: {
    id: 1,
    type: TileType.Ground,
    movementCost: 1,
    defenseBonus: 0,
    sprite: "tiles/dirt.png",
  },
  stone: {
    id: 2,
    type: TileType.Ground,
    movementCost: 1,
    defenseBonus: 5,
    sprite: "tiles/stone.png",
  },
  water: {
    id: 3,
    type: TileType.Water,
    movementCost: 2,
    defenseBonus: -5,
    sprite: "tiles/water.png",
  },
  forest: {
    id: 4,
    type: TileType.Forest,
    movementCost: 2,
    defenseBonus: 10,
    sprite: "tiles/forest.png",
  },
  mountain: {
    id: 5,
    type: TileType.Mountain,
    movementCost: 3,
    defenseBonus: 15,
    sprite: "tiles/mountain.png",
  },
  wall: {
    id: 6,
    type: TileType.Obstacle,
    movementCost: Infinity,
    defenseBonus: 0,
    sprite: "tiles/wall.png",
  },
};

/**
 * Get tile by ID
 */
export function getTileById(id: number): Tile | undefined {
  return Object.values(TILES).find((tile) => tile.id === id);
}

/**
 * Create a 2D tile array from tile IDs
 */
export function createTileArray(
  width: number,
  height: number,
  tileIds: number[][],
): Tile[][] {
  const tiles: Tile[][] = [];

  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < width; x++) {
      const tileId = tileIds[y]?.[x] ?? 0;
      const tile = getTileById(tileId) ?? TILES.grass;
      row.push(tile);
    }
    tiles.push(row);
  }

  return tiles;
}
