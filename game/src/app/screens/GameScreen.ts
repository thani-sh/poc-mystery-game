import { Container, Graphics, Text, TextStyle, Ticker } from "pixi.js";
import { PlayerController } from "../../game/character/PlayerController";

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

  private readonly GRID_SIZE = 6; // 6x6 grid
  private readonly TILE_SIZE = 200; // 200 pixels per tile

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
   * Draw a simple grid
   */
  private drawGrid() {
    const graphics = new Graphics();

    // Draw grid background
    graphics.rect(
      0,
      0,
      this.GRID_SIZE * this.TILE_SIZE,
      this.GRID_SIZE * this.TILE_SIZE,
    );
    graphics.fill(0xffffff);

    // Draw grid lines with very low opacity
    graphics.stroke({ width: 1, color: 0x000000, alpha: 0.02 });

    for (let i = 0; i <= this.GRID_SIZE; i++) {
      // Vertical lines
      graphics.moveTo(i * this.TILE_SIZE, 0);
      graphics.lineTo(i * this.TILE_SIZE, this.GRID_SIZE * this.TILE_SIZE);

      // Horizontal lines
      graphics.moveTo(0, i * this.TILE_SIZE);
      graphics.lineTo(this.GRID_SIZE * this.TILE_SIZE, i * this.TILE_SIZE);
    }

    graphics.stroke();

    this.gridContainer.addChild(graphics);
  }

  /**
   * Prepare the screen just before showing
   */
  public async prepare() {
    console.log("GameScreen: Starting prepare");

    // Initialize player 1 (Bets) on the left
    const player1Pos = {
      x: 2,
      y: Math.floor(this.GRID_SIZE / 2),
    };

    this.player1Controller = new PlayerController(
      "bets",
      player1Pos,
      this.TILE_SIZE,
      this.GRID_SIZE,
      { up: "w", down: "s", left: "a", right: "d" },
      0.8,
    );

    // Initialize player 2 (Daisy) on the right
    const player2Pos = {
      x: this.GRID_SIZE - 3,
      y: Math.floor(this.GRID_SIZE / 2),
    };

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
    );

    console.log("GameScreen: Initializing player controllers");
    await this.player1Controller.init();
    await this.player2Controller.init();
    console.log("GameScreen: Player controllers initialized");

    this.characterContainer.addChild(this.player1Controller.getSprite());
    this.characterContainer.addChild(this.player2Controller.getSprite());
    console.log("GameScreen: Character sprites added to container");
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
    super.destroy(options);
  }
}
