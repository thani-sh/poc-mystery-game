import {
  AnimatedSprite,
  Assets,
  Container,
  DestroyOptions,
  Rectangle,
  Texture,
} from "pixi.js";
import { Direction } from "../types";

/**
 * Character sprite that handles animations for different directions and states
 */
export class CharacterSprite extends Container {
  private currentAnimation: AnimatedSprite | null = null;
  private animations: Map<string, AnimatedSprite> = new Map();
  private currentDirection: Direction = Direction.Down;
  private isWalking: boolean = false;
  private tileSize: number;
  private characterScale: number;

  constructor(
    private characterId: string,
    tileSize: number = 128,
    characterScale: number = 1.0,
  ) {
    super();
    this.tileSize = tileSize;
    this.characterScale = characterScale;
  }

  /**
   * Load and setup all animations for this character
   */
  public async setup() {
    console.log(`Setting up character: ${this.characterId}`);
    // Create animations for each direction and state
    const states = ["idle", "walk"];

    for (const state of states) {
      const textureName = `/assets/main/actors/${this.characterId}/frames/${state}.png`;

      try {
        // Load the texture using Assets API
        const baseTexture = await Assets.load(textureName);

        // Extract frames for each direction from the 4x4 grid
        // Row 0: Down, Row 1: Left, Row 2: Right, Row 3: Up
        const directionFrames = this.extractDirectionFrames(baseTexture);

        // Create animations for each direction
        const directions: Direction[] = [
          Direction.Down,
          Direction.Left,
          Direction.Right,
          Direction.Up,
        ];
        directions.forEach((direction, index) => {
          const key = `${state}-${direction}`;
          const frames = directionFrames[index];

          const animation = new AnimatedSprite(frames);
          animation.animationSpeed = 0.1;
          animation.visible = false;
          animation.anchor.set(0.5, 1.0); // Bottom-aligned

          // Scale to match tile size
          const scale =
            ((this.tileSize * 2) /
              Math.max(frames[0].width, frames[0].height)) *
            this.characterScale;
          animation.scale.set(scale);

          this.addChild(animation);
          this.animations.set(key, animation);
        });

        console.log(`Loaded animation: ${textureName}`);
      } catch (error) {
        console.error(`Failed to load animation: ${textureName}`, error);
      }
    }

    // Start with idle-down
    this.playAnimation("idle", Direction.Down);
  }

  /**
   * Extract frames for all 4 directions from a 4x4 spritesheet
   * Returns array of 4 frame arrays, one for each direction (down, left, right, up)
   */
  private extractDirectionFrames(baseTexture: Texture): Texture[][] {
    const frameWidth = baseTexture.width / 4;
    const frameHeight = baseTexture.height / 4;
    const directionFrames: Texture[][] = [];

    // Extract 4 frames for each of the 4 rows (directions)
    // Row 0: Down, Row 1: Left, Row 2: Right, Row 3: Up
    for (let row = 0; row < 4; row++) {
      const frames: Texture[] = [];
      for (let col = 0; col < 4; col++) {
        const frame = new Texture({
          source: baseTexture.source,
          frame: new Rectangle(
            col * frameWidth,
            row * frameHeight,
            frameWidth,
            frameHeight,
          ),
        });
        frames.push(frame);
      }
      directionFrames.push(frames);
    }

    return directionFrames;
  }

  /**
   * Play an animation based on state and direction
   */
  private playAnimation(state: "idle" | "walk", direction: Direction) {
    const key = `${state}-${direction}`;
    const animation = this.animations.get(key);

    if (!animation) {
      console.warn(`Animation not found: ${key}`);
      return;
    }

    // Hide current animation
    if (this.currentAnimation) {
      this.currentAnimation.stop();
      this.currentAnimation.visible = false;
    }

    // Show and play new animation
    this.currentAnimation = animation;
    this.currentAnimation.visible = true;
    this.currentAnimation.play();
  }

  /**
   * Set the character to walk in a direction
   */
  public walk(direction: Direction) {
    this.currentDirection = direction;
    this.isWalking = true;
    this.playAnimation("walk", direction);
  }

  /**
   * Set the character to idle in current direction
   */
  public idle() {
    this.isWalking = false;
    this.playAnimation("idle", this.currentDirection);
  }

  /**
   * Update direction without changing walk state
   */
  public setDirection(direction: Direction) {
    this.currentDirection = direction;
    const state = this.isWalking ? "walk" : "idle";
    this.playAnimation(state, direction);
  }

  /**
   * Get current direction
   */
  public getDirection(): Direction {
    return this.currentDirection;
  }

  /**
   * Cleanup
   */
  public destroy(options?: DestroyOptions) {
    this.animations.forEach((animation) => animation.destroy());
    this.animations.clear();
    super.destroy(options);
  }
}
