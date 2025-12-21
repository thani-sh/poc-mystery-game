import { Assets, Container, Graphics, Sprite, Ticker } from "pixi.js";
import { PlayerController } from "../../game/character/PlayerController";
import { CharacterSprite } from "../../game/character/CharacterSprite";
import { Direction } from "../../game/types";

/**
 * Game screen with grid and player character
 */
export class GameScreen extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ["main"];

  private gridContainer: Container;
  private characterContainer: Container;
  private player1Controller: PlayerController | null = null;
  private player2Controller: PlayerController | null = null;

  // NPC characters
  private ernSprite: CharacterSprite | null = null;
  private fattySprite: CharacterSprite | null = null;
  private goonSprite: CharacterSprite | null = null;
  private jenksSprite: CharacterSprite | null = null;
  private larrySprite: CharacterSprite | null = null;
  private pipSprite: CharacterSprite | null = null;

  private readonly GRID_SIZE = 16; // 16x16 grid
  private readonly TILE_SIZE = 64; // 64 pixels per tile

  private paused = false;

  constructor() {
    super();

    this.gridContainer = new Container();
    this.addChild(this.gridContainer);

    this.characterContainer = new Container();
    this.addChild(this.characterContainer);

    // Draw the grid
    this.drawGrid();
  }

  /**
   * Draw a simple grid with village background
   */
  private drawGrid() {
    // Grid will be replaced with actual tilemap background in prepare()
    // Just draw a placeholder for now
    const graphics = new Graphics();
    graphics.rect(
      0,
      0,
      this.GRID_SIZE * this.TILE_SIZE,
      this.GRID_SIZE * this.TILE_SIZE,
    );
    graphics.fill(0xcccccc);
    this.gridContainer.addChild(graphics);
  }

  /**
   * Setup the village tilemap background
   * Uses the top-left 32x32 portion of the 64x64 tile map (2048x2048 source image)
   * Renders at 1:1 pixel ratio to make background elements smaller relative to characters
   */
  private async setupBackground() {
    // Load the village tilemap texture
    const texture = await Assets.load("main/scene/village-1.jpeg");

    // The source image is 2048x2048 pixels (64x64 tiles at 32px per tile)
    // We want to use the top-left 32x32 tile portion (1024x1024 source pixels)
    // and render it at 1024 pixels (our 16x16 grid at 64px per tile)
    const sourceTileSize = texture.width / 64; // 32 pixels per tile in source
    const startTile = 0; // Starting position for top-left corner

    // Calculate the region to extract from the source texture
    // Extract 32x32 tiles = 1024x1024 pixels from source
    const sourceX = startTile * sourceTileSize;
    const sourceY = startTile * sourceTileSize;
    const sourceWidth = 32 * sourceTileSize; // 32 tiles
    const sourceHeight = 32 * sourceTileSize; // 32 tiles

    // Create a sprite with the full texture
    const backgroundSprite = new Sprite(texture);

    // Set up the texture region (crop to top-left 32x32 tiles)
    backgroundSprite.texture.frame.x = sourceX;
    backgroundSprite.texture.frame.y = sourceY;
    backgroundSprite.texture.frame.width = sourceWidth;
    backgroundSprite.texture.frame.height = sourceHeight;
    backgroundSprite.texture.updateUvs();

    // Render at 1:1 scale (1024 source pixels -> 1024 render pixels)
    // This makes background elements smaller relative to characters
    const targetSize = this.GRID_SIZE * this.TILE_SIZE; // 1024 pixels
    backgroundSprite.width = targetSize;
    backgroundSprite.height = targetSize;

    // Clear the placeholder and add the background
    this.gridContainer.removeChildren();
    this.gridContainer.addChild(backgroundSprite);

    console.log(
      "GameScreen: Village background loaded (32x32 tiles at 1:1 scale)",
    );
  }

  /**
   * Prepare the screen just before showing
   */
  public async prepare() {
    console.log("GameScreen: Starting prepare");

    // Load and setup the village tilemap background
    await this.setupBackground();

    // Initialize player 1 (Bets) on the left
    const player1Pos = { x: 5, y: 8 };

    this.player1Controller = new PlayerController(
      "bets",
      player1Pos,
      this.TILE_SIZE,
      this.GRID_SIZE,
      { up: "w", down: "s", left: "a", right: "d" },
      0.8,
    );

    // Initialize player 2 (Daisy) on the right
    const player2Pos = { x: 7, y: 8 };

    this.player2Controller = new PlayerController(
      "daisy",
      player2Pos,
      this.TILE_SIZE,
      this.GRID_SIZE,
      {
        up: "arrowup",
        down: "arrowdown",
        left: "arrowleft",
        right: "arrowright",
      },
      0.9,
    );

    console.log("GameScreen: Initializing player controllers");
    await this.player1Controller.init();
    await this.player2Controller.init();
    console.log("GameScreen: Player controllers initialized");

    this.characterContainer.addChild(this.player1Controller.getSprite());
    this.characterContainer.addChild(this.player2Controller.getSprite());
    console.log("GameScreen: Character sprites added to container");

    // Initialize NPCs
    console.log("GameScreen: Initializing NPCs");

    // Ern - Top left area
    this.ernSprite = new CharacterSprite("ern", this.TILE_SIZE, 0.9);
    await this.ernSprite.setup();
    this.ernSprite.position.set(1 * this.TILE_SIZE, 8 * this.TILE_SIZE);
    this.ernSprite.setDirection(Direction.Right);
    this.characterContainer.addChild(this.ernSprite);

    // Fatty - Top right area
    this.fattySprite = new CharacterSprite("fatty", this.TILE_SIZE);
    await this.fattySprite.setup();
    this.fattySprite.position.set(15 * this.TILE_SIZE, 8 * this.TILE_SIZE);
    this.fattySprite.setDirection(Direction.Left);
    this.characterContainer.addChild(this.fattySprite);

    // Goon - Middle left area
    this.goonSprite = new CharacterSprite("goon", this.TILE_SIZE, 1.1);
    await this.goonSprite.setup();
    this.goonSprite.position.set(2 * this.TILE_SIZE, 8 * this.TILE_SIZE);
    this.goonSprite.setDirection(Direction.Down);
    this.characterContainer.addChild(this.goonSprite);

    // Jenks - Center area
    this.jenksSprite = new CharacterSprite("jenks", this.TILE_SIZE, 1.1);
    await this.jenksSprite.setup();
    this.jenksSprite.position.set(6 * this.TILE_SIZE, 7 * this.TILE_SIZE);
    this.jenksSprite.setDirection(Direction.Down);
    this.characterContainer.addChild(this.jenksSprite);

    // Larry - Bottom left area
    this.larrySprite = new CharacterSprite("larry", this.TILE_SIZE);
    await this.larrySprite.setup();
    this.larrySprite.position.set(15 * this.TILE_SIZE, 9 * this.TILE_SIZE);
    this.larrySprite.setDirection(Direction.Left);
    this.characterContainer.addChild(this.larrySprite);

    // Pip - Bottom right area
    this.pipSprite = new CharacterSprite("pip", this.TILE_SIZE);
    await this.pipSprite.setup();
    this.pipSprite.position.set(9 * this.TILE_SIZE, 8 * this.TILE_SIZE);
    this.pipSprite.setDirection(Direction.Left);
    this.characterContainer.addChild(this.pipSprite);

    console.log("GameScreen: NPCs initialized and added");
  }

  /**
   * Update the screen
   */
  public update(_time: Ticker) {
    if (this.paused) return;
    if (this.player1Controller) {
      this.player1Controller.update();
    }
    if (this.player2Controller) {
      this.player2Controller.update();
    }
    // Sort children by y position for proper z-ordering (isometric view)
    // Characters closer to bottom (higher y) should render on top
    this.characterContainer.children.sort((a, b) => a.y - b.y);
  }

  /**
   * Resize the screen
   */
  public resize(width: number, height: number) {
    // Center the grid on screen
    const gridWidth = this.GRID_SIZE * this.TILE_SIZE;
    const gridHeight = this.GRID_SIZE * this.TILE_SIZE;

    this.gridContainer.position.set(
      (width - gridWidth) / 2,
      (height - gridHeight - 60) / 2,
    );

    this.characterContainer.position.set(
      (width - gridWidth) / 2,
      (height - gridHeight - 60) / 2,
    );
  }

  /**
   * Pause gameplay
   */
  public async pause() {
    this.paused = true;
  }

  /**
   * Resume gameplay
   */
  public async resume() {
    this.paused = false;
  }

  /**
   * Cleanup
   */
  public destroy(options?: any) {
    if (this.player1Controller) {
      this.player1Controller.destroy();
    }
    if (this.player2Controller) {
      this.player2Controller.destroy();
    }
    // Cleanup NPCs
    if (this.ernSprite) {
      this.ernSprite.destroy();
    }
    if (this.fattySprite) {
      this.fattySprite.destroy();
    }
    if (this.goonSprite) {
      this.goonSprite.destroy();
    }
    if (this.jenksSprite) {
      this.jenksSprite.destroy();
    }
    if (this.larrySprite) {
      this.larrySprite.destroy();
    }
    if (this.pipSprite) {
      this.pipSprite.destroy();
    }
    super.destroy(options);
  }
}
