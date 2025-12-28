export interface Tilemap {
  tileset: string;
  tileSize: number;
  gridSize: {
    width: number;
    height: number;
  };
}

export interface Layer {
  tilemap: string;
  data: number[][];
  properties?: {
    collision?: boolean;
  };
}

export interface MapObject {
  id: string;
  type: "npc" | "item" | "trigger";
  position: {
    x: number;
    y: number;
  };
  properties?: any;
}

export interface Trigger {
  id: string;
  type: "map-transition" | "cutscene";
  position: {
    x: number;
    y: number;
  };
  target: string;
}

export interface MapDefinition {
  id: string;
  name: string;
  gridSize: {
    width: number;
    height: number;
  };
  tileSize: number;
  layers: Layer[];
  objects: MapObject[];
  triggers: Trigger[];
  extends?: string;
}

export interface MapInstance {
  mapId: string;
  state: {
    [objectId: string]: any;
  };
}

export interface CutsceneScene {
  type: "dialogue" | "movement" | "animation";
  actor: string;
  dialogue?: string;
  target?: {
    x: number;
    y: number;
  };
  animation?: string;
}

export interface Cutscene {
  id: string;
  name: string;
  scenes: CutsceneScene[];
}
