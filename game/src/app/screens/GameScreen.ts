import { Container, DestroyOptions, Graphics } from "pixi.js";
import { MapLoader } from "../../engine/core/MapLoader";
import { MapDefinition } from "../../engine/core/types";

/**
 * Game screen
 */
export class GameScreen extends Container {
  private paused = false;
  private map: MapDefinition | null = null;
  private mapContainer: Container;

  constructor() {
    super();
    this.mapContainer = new Container();
    this.addChild(this.mapContainer);
  }

  /**
   * Prepare the screen just before showing
   */
  public async prepare() {
    console.log("GameScreen: Starting prepare");
    this.map = await MapLoader.load("example_map");
    console.log("GameScreen: Map loaded", this.map);
    this.renderMap();
  }

  private renderMap() {
    if (!this.map) return;

    // Clear previous map
    this.mapContainer.removeChildren();

    const { layers, tileSize, gridSize } = this.map;

    for (const layer of layers) {
      if (layer.properties?.collision) continue; // Don't render collision layer

      const layerContainer = new Container();
      this.mapContainer.addChild(layerContainer);

      for (let y = 0; y < gridSize.height; y++) {
        for (let x = 0; x < gridSize.width; x++) {
          const tileIndex = layer.data[y][x];
          if (tileIndex === 0) continue; // Skip empty tiles

          // For now, just draw a colored square for each tile
          const graphics = new Graphics();
          graphics.rect(x * tileSize, y * tileSize, tileSize, tileSize);
          // Alternate colors for visibility
          const color = (x + y) % 2 === 0 ? 0xcccccc : 0xaaaaaa;
          graphics.fill(color);
          layerContainer.addChild(graphics);
        }
      }
    }
  }

  /**
   * Update the screen
   */
  public update() {
    if (this.paused) return;
  }

  /**
   * Resize the screen
   */
  public resize(width: number, height: number) {
    if (!this.map) return;
    const mapWidth = this.map.gridSize.width * this.map.tileSize;
    const mapHeight = this.map.gridSize.height * this.map.tileSize;

    this.mapContainer.position.set(
      (width - mapWidth) / 2,
      (height - mapHeight) / 2,
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
  public destroy(options?: DestroyOptions) {
    super.destroy(options);
  }
}
