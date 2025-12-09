import type { GridPosition } from "../types";
import { Grid } from "./Grid";

/**
 * Node for A* pathfinding
 */
interface PathNode {
  position: GridPosition;
  g: number; // Cost from start
  h: number; // Heuristic cost to goal
  f: number; // Total cost (g + h)
  parent: PathNode | null;
}

/**
 * Pathfinding utilities using A* algorithm
 */
export class Pathfinder {
  /**
   * Find a path from start to goal using A* algorithm
   * Returns array of positions from start to goal, or empty array if no path found
   */
  public static findPath(
    grid: Grid,
    start: GridPosition,
    goal: GridPosition,
    maxMovement?: number,
  ): GridPosition[] {
    if (!grid.isValidPosition(start) || !grid.isValidPosition(goal)) {
      return [];
    }

    if (!grid.isWalkable(goal)) {
      return [];
    }

    const openList: PathNode[] = [];
    const closedList: Set<string> = new Set();

    const startNode: PathNode = {
      position: start,
      g: 0,
      h: grid.distance(start, goal),
      f: grid.distance(start, goal),
      parent: null,
    };

    openList.push(startNode);

    while (openList.length > 0) {
      // Find node with lowest f cost
      openList.sort((a, b) => a.f - b.f);
      const currentNode = openList.shift()!;

      // Check if we've reached the goal
      if (Grid.positionsEqual(currentNode.position, goal)) {
        return this.reconstructPath(currentNode);
      }

      // Mark as visited
      closedList.add(this.positionKey(currentNode.position));

      // Check all adjacent positions
      const adjacent = grid.getAdjacentPositions(currentNode.position);

      for (const adjPos of adjacent) {
        if (!grid.isWalkable(adjPos)) {
          continue;
        }

        const adjKey = this.positionKey(adjPos);
        if (closedList.has(adjKey)) {
          continue;
        }

        const tile = grid.getTile(adjPos);
        const movementCost = tile?.movementCost ?? 1;
        const g = currentNode.g + movementCost;

        // Check movement limit if specified
        if (maxMovement !== undefined && g > maxMovement) {
          continue;
        }

        const h = grid.distance(adjPos, goal);
        const f = g + h;

        // Check if this position is already in open list with better cost
        const existingNode = openList.find((node) =>
          Grid.positionsEqual(node.position, adjPos),
        );

        if (existingNode && existingNode.g <= g) {
          continue;
        }

        const adjNode: PathNode = {
          position: adjPos,
          g,
          h,
          f,
          parent: currentNode,
        };

        if (existingNode) {
          // Update existing node
          existingNode.g = g;
          existingNode.h = h;
          existingNode.f = f;
          existingNode.parent = currentNode;
        } else {
          openList.push(adjNode);
        }
      }
    }

    // No path found
    return [];
  }

  /**
   * Get all reachable positions from a start position within movement range
   */
  public static getReachablePositions(
    grid: Grid,
    start: GridPosition,
    maxMovement: number,
  ): GridPosition[] {
    const reachable: GridPosition[] = [];
    const visited = new Set<string>();
    const queue: Array<{ position: GridPosition; cost: number }> = [
      { position: start, cost: 0 },
    ];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const key = this.positionKey(current.position);

      if (visited.has(key)) {
        continue;
      }

      visited.add(key);
      reachable.push(current.position);

      // Check adjacent positions
      const adjacent = grid.getAdjacentPositions(current.position);

      for (const adjPos of adjacent) {
        if (!grid.isWalkable(adjPos)) {
          continue;
        }

        const tile = grid.getTile(adjPos);
        const movementCost = tile?.movementCost ?? 1;
        const newCost = current.cost + movementCost;

        if (newCost <= maxMovement && !visited.has(this.positionKey(adjPos))) {
          queue.push({ position: adjPos, cost: newCost });
        }
      }
    }

    return reachable;
  }

  /**
   * Reconstruct path from end node by following parent links
   */
  private static reconstructPath(node: PathNode): GridPosition[] {
    const path: GridPosition[] = [];
    let current: PathNode | null = node;

    while (current !== null) {
      path.unshift(current.position);
      current = current.parent;
    }

    return path;
  }

  /**
   * Generate unique key for a position
   */
  private static positionKey(position: GridPosition): string {
    return `${position.x},${position.y}`;
  }
}
