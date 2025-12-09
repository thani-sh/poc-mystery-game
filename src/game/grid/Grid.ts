import type { GridPosition, Tile } from "../types";

/**
 * Grid system for managing the game's tile-based map
 * Handles coordinate conversions, tile access, and pathfinding helpers
 */
export class Grid {
  private tiles: Tile[][];
  public readonly width: number;
  public readonly height: number;
  public readonly tileSize: number;

  constructor(width: number, height: number, tileSize = 48) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.tiles = [];
  }

  /**
   * Initialize the grid with tile data
   */
  public setTiles(tiles: Tile[][]): void {
    if (tiles.length !== this.height) {
      throw new Error(
        `Invalid tile data: expected ${this.height} rows, got ${tiles.length}`,
      );
    }
    for (const row of tiles) {
      if (row.length !== this.width) {
        throw new Error(
          `Invalid tile data: expected ${this.width} columns, got ${row.length}`,
        );
      }
    }
    this.tiles = tiles;
  }

  /**
   * Get tile at grid position
   */
  public getTile(position: GridPosition): Tile | null {
    if (!this.isValidPosition(position)) {
      return null;
    }
    return this.tiles[position.y][position.x];
  }

  /**
   * Check if a position is within grid bounds
   */
  public isValidPosition(position: GridPosition): boolean {
    return (
      position.x >= 0 &&
      position.x < this.width &&
      position.y >= 0 &&
      position.y < this.height
    );
  }

  /**
   * Check if a position is walkable (not an obstacle)
   */
  public isWalkable(position: GridPosition): boolean {
    const tile = this.getTile(position);
    return tile !== null && tile.type !== "obstacle";
  }

  /**
   * Convert grid position to world pixel coordinates (center of tile)
   */
  public gridToWorld(position: GridPosition): { x: number; y: number } {
    return {
      x: position.x * this.tileSize + this.tileSize / 2,
      y: position.y * this.tileSize + this.tileSize / 2,
    };
  }

  /**
   * Convert world pixel coordinates to grid position
   */
  public worldToGrid(x: number, y: number): GridPosition {
    return {
      x: Math.floor(x / this.tileSize),
      y: Math.floor(y / this.tileSize),
    };
  }

  /**
   * Calculate Manhattan distance between two grid positions
   */
  public distance(a: GridPosition, b: GridPosition): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  /**
   * Get adjacent positions (up, down, left, right)
   */
  public getAdjacentPositions(position: GridPosition): GridPosition[] {
    const adjacent: GridPosition[] = [];
    const directions = [
      { x: 0, y: -1 }, // Up
      { x: 0, y: 1 }, // Down
      { x: -1, y: 0 }, // Left
      { x: 1, y: 0 }, // Right
    ];

    for (const dir of directions) {
      const newPos = { x: position.x + dir.x, y: position.y + dir.y };
      if (this.isValidPosition(newPos)) {
        adjacent.push(newPos);
      }
    }

    return adjacent;
  }

  /**
   * Get all positions within a given range (Manhattan distance)
   */
  public getPositionsInRange(
    center: GridPosition,
    range: number,
  ): GridPosition[] {
    const positions: GridPosition[] = [];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const pos = { x, y };
        if (this.distance(center, pos) <= range) {
          positions.push(pos);
        }
      }
    }

    return positions;
  }

  /**
   * Check if two positions are equal
   */
  public static positionsEqual(a: GridPosition, b: GridPosition): boolean {
    return a.x === b.x && a.y === b.y;
  }
}
