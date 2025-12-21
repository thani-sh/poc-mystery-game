import { AnimatedSprite, Assets, Container, Texture } from "pixi.js";
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
    const directions = ["up", "down", "left", "right"];

    for (const state of states) {
      for (const direction of directions) {
        const key = `${state}-${direction}`;
        // Use left animation for right direction (we'll flip it)
        const loadDirection = direction === "right" ? "left" : direction;
        const textureName = `/assets/main/characters/${this.characterId}/${this.characterId}-${state}-${loadDirection}.png`;

        try {
          // Load the texture using Assets API
          const baseTexture = await Assets.load(textureName);
          const frames = this.createFramesFromSpritesheet(baseTexture);

          const animation = new AnimatedSprite(frames);
          animation.animationSpeed = 0.1;
          animation.visible = false;
          animation.anchor.set(0.5, 1.0); // Bottom-aligned

          // Scale to match tile size
          const scale =
            (this.tileSize / Math.max(frames[0].width, frames[0].height)) *
            this.characterScale;
          animation.scale.set(scale);

          // Mirror horizontally for right direction
          if (direction === "right") {
            animation.scale.x = -scale;
          }

          this.addChild(animation);

          this.animations.set(key, animation);
          console.log(`Loaded animation: ${textureName}`);
        } catch (error) {
          console.error(`Failed to load animation: ${textureName}`, error);
        }
      }
    }

    // Start with idle-down
    this.playAnimation("idle", Direction.Down);
  }

  /**
   * Create 4 frames from a 2x2 spritesheet
   */
  private createFramesFromSpritesheet(baseTexture: Texture): Texture[] {
    const frames: Texture[] = [];
    const frameWidth = baseTexture.width / 2;
    const frameHeight = baseTexture.height / 2;

    // Create 4 frames in order: top-left, top-right, bottom-left, bottom-right
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const frame = new Texture({
          source: baseTexture.source,
          frame: {
            x: col * frameWidth,
            y: row * frameHeight,
            width: frameWidth,
            height: frameHeight,
          },
        });
        frames.push(frame);
      }
    }

    return frames;
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
  public destroy(options?: any) {
    this.animations.forEach((animation) => animation.destroy());
    this.animations.clear();
    super.destroy(options);
  }
}
