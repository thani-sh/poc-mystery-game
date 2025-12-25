import { MapDefinition } from "./types";

export class MapLoader {
  public static async load(mapId: string): Promise<MapDefinition> {
    try {
      const response = await fetch(`data/maps/${mapId}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load map: ${mapId}`);
      }
      const mapData = await response.json();
      return mapData as MapDefinition;
    } catch (error) {
      console.error("Error loading map:", error);
      throw error;
    }
  }
}
