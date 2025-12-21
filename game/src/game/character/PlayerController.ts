import { Direction, type GridPosition } from "../types";
import { CharacterSprite } from "./CharacterSprite";

export interface KeyMap {
  up: string;
  down: string;
  left: string;
  right: string;
}

/**
 * Controller for player character that handles input and movement
 */
export class PlayerController {
  private characterSprite: CharacterSprite;
  private gridPosition: GridPosition;
  private gridSize: number;
  private tileSize: number;
  private isMoving: boolean = false;
  private moveProgress: number = 0;
  private targetPosition: GridPosition;
  private moveSpeed: number = 0.05; // 0 to 1 per frame
  private keysPressed: Set<string> = new Set();
  private keyMap: KeyMap;

  constructor(
    characterId: string,
    startPosition: GridPosition,
    tileSize: number,
    gridSize: number,
    keyMap: KeyMap,
    characterScale: number = 1.0,
  ) {
    this.characterSprite = new CharacterSprite(
      characterId,
      tileSize,
      characterScale,
    );
    this.gridPosition = { ...startPosition };
    this.targetPosition = { ...startPosition };
    this.tileSize = tileSize;
    this.gridSize = gridSize;
    this.keyMap = keyMap;

    // Set initial pixel position
    this.updatePixelPosition();

    // Setup keyboard input
    this.setupInput();
  }

  /**
   * Setup keyboard input listeners
   */
  private setupInput() {
    window.addEventListener("keydown", (e) => {
      this.keysPressed.add(e.key.toLowerCase());
    });

    window.addEventListener("keyup", (e) => {
      this.keysPressed.delete(e.key.toLowerCase());
    });
  }

  /**
   * Initialize the character sprite
   */
  public async init() {
    await this.characterSprite.setup();
  }

  /**
   * Update pixel position based on grid position
   */
  private updatePixelPosition() {
    this.characterSprite.position.set(
      this.gridPosition.x * this.tileSize + this.tileSize / 2,
      (this.gridPosition.y + 1) * this.tileSize, // Bottom of the tile
    );
  }

  /**
   * Interpolate between current and target position
   */
  private interpolatePosition() {
    const startX = this.gridPosition.x * this.tileSize + this.tileSize / 2;
    const startY = (this.gridPosition.y + 1) * this.tileSize; // Bottom of the tile
    const targetX = this.targetPosition.x * this.tileSize + this.tileSize / 2;
    const targetY = (this.targetPosition.y + 1) * this.tileSize; // Bottom of the tile

    this.characterSprite.position.set(
      startX + (targetX - startX) * this.moveProgress,
      startY + (targetY - startY) * this.moveProgress,
    );
  }

  /**
   * Check if a grid position is valid
   */
  private isValidPosition(pos: GridPosition): boolean {
    return (
      pos.x >= 0 && pos.x < this.gridSize && pos.y >= 0 && pos.y < this.gridSize
    );
  }

  /**
   * Get the direction from key input
   */
  private getDirectionFromInput(): Direction | null {
    // Priority order to avoid diagonal movement
    if (this.keysPressed.has(this.keyMap.up)) {
      return Direction.Up;
    }
    if (this.keysPressed.has(this.keyMap.down)) {
      return Direction.Down;
    }
    if (this.keysPressed.has(this.keyMap.left)) {
      return Direction.Left;
    }
    if (this.keysPressed.has(this.keyMap.right)) {
      return Direction.Right;
    }
    return null;
  }

  /**
   * Get next grid position based on direction
   */
  private getNextPosition(direction: Direction): GridPosition {
    const next = { ...this.gridPosition };
    switch (direction) {
      case Direction.Up:
        next.y -= 1;
        break;
      case Direction.Down:
        next.y += 1;
        break;
      case Direction.Left:
        next.x -= 1;
        break;
      case Direction.Right:
        next.x += 1;
        break;
    }
    return next;
  }

  /**
   * Start moving in a direction
   */
  private startMove(direction: Direction) {
    const nextPos = this.getNextPosition(direction);

    if (!this.isValidPosition(nextPos)) {
      // Can't move there, just face that direction
      this.characterSprite.setDirection(direction);
      this.characterSprite.idle();
      return;
    }

    // Start the move
    this.isMoving = true;
    this.targetPosition = nextPos;
    this.moveProgress = 0;
    this.characterSprite.walk(direction);
  }

  /**
   * Update the controller (call every frame)
   */
  public update() {
    if (this.isMoving) {
      // Continue current move
      this.moveProgress += this.moveSpeed;

      if (this.moveProgress >= 1) {
        // Move complete
        this.moveProgress = 1;
        this.gridPosition = { ...this.targetPosition };
        this.isMoving = false;
        this.characterSprite.idle();
      }

      this.interpolatePosition();
    } else {
      // Check for input to start new move
      const direction = this.getDirectionFromInput();

      if (direction) {
        this.startMove(direction);
      }
    }
  }

  /**
   * Get the character sprite container
   */
  public getSprite(): CharacterSprite {
    return this.characterSprite;
  }

  /**
   * Get current grid position
   */
  public getGridPosition(): GridPosition {
    return { ...this.gridPosition };
  }

  /**
   * Cleanup
   */
  public destroy() {
    this.characterSprite.destroy();
    this.keysPressed.clear();
  }
}
