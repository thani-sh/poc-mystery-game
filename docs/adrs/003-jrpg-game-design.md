# ADR-003: Top-Down 2D JRPG Game Design

Date: 2025-12-09

## Status

Accepted

## Context

We are building a web-based game inspired by Shining Force 2, a classic tactical JRPG. We need to define core game design principles and technical approaches to achieve similar gameplay:

**Shining Force 2 Characteristics:**
- Turn-based tactical combat on isometric grid
- Overworld exploration
- Character progression and classes
- Strategic positioning and terrain effects
- Multiple character party
- Story-driven with dialogue
- Town exploration and shops

**Technical Considerations:**
- Web-based, so need to consider file sizes and loading
- Top-down view (simpler than isometric to start)
- Grid-based movement and combat
- Sprite-based graphics
- Need efficient rendering for many units

## Decision

We will implement a **top-down 2D tactical JRPG** with the following design choices:

### Visual Style
- **Top-down perspective** (not isometric initially, for simplicity)
- Tile-based maps (32x32 or 48x48 tiles)
- Sprite-based characters with 4-directional animations (down, up, left, right)
- UI inspired by classic JRPGs (borders, portraits, text boxes)

### Core Systems (To Be Implemented)

1. **Grid System**
   - Rectangular grid (easier than isometric)
   - Coordinate system: `{x, y}` grid positions
   - Tile types: walkable, obstacle, terrain effects
   - Pathfinding: A* algorithm for movement
   - Range calculation for attacks/abilities

2. **Combat System**
   - Turn-based with initiative order
   - Grid-based positioning
   - Movement range based on character stats
   - Attack range (melee, ranged, magic)
   - Damage calculation with defense/evasion
   - Status effects system
   - Critical hits and special abilities

3. **Character System**
   - Party of playable characters
   - Stats: HP, MP, Attack, Defense, Speed, etc.
   - Classes with unique abilities
   - Experience and leveling
   - Equipment system

4. **Map System**
   - Multiple map screens (towns, dungeons, battle maps)
   - Tile layers: ground, objects, collision
   - Spawn points for characters and enemies
   - Trigger zones for events

5. **UI System**
   - Battle UI: turn order, character stats, action menu
   - Character portraits
   - Dialogue boxes with typewriter effect
   - Menu screens: inventory, status, save/load
   - Cursor/selection system

### Data Structures

**Tile Definition:**
```typescript
{
  id: number,
  type: 'ground' | 'obstacle' | 'water' | 'forest',
  movementCost: number,
  defenseBonus: number,
  sprite: string
}
```

**Character Definition:**
```typescript
{
  id: string,
  name: string,
  class: string,
  level: number,
  stats: { hp, maxHp, mp, maxMp, attack, defense, speed },
  position: { x, y },
  sprite: string,
  abilities: Ability[]
}
```

**Map Definition:**
```typescript
{
  id: string,
  width: number,
  height: number,
  tiles: number[][],  // 2D array of tile IDs
  units: UnitPlacement[],
  triggers: Trigger[]
}
```

### Rendering Approach
- Use PixiJS Container for each grid cell layer
- Sprite caching for tiles
- Object pooling for frequently created/destroyed objects
- Cull off-screen entities
- Sprite sheets for character animations
- Particle effects for abilities/attacks

### Phase 1 Implementation (Boilerplate)
For this initial setup, we will create:
- Grid system structure (types and basic classes)
- Map data format
- Character data format
- Placeholder assets structure
- Basic game state management
- Screen shells (BattleScreen, ExplorationScreen)

## Consequences

### Positive
- Top-down view is simpler to implement than isometric
- Grid-based system is well-suited for tactical gameplay
- Tile-based maps are memory efficient
- Turn-based combat is easier to implement and debug
- Clear data structures enable JSON-based map/character editing
- Architecture supports both combat and exploration modes

### Negative
- Top-down may feel less "classic JRPG" than isometric
- Grid movement can feel restrictive vs free movement
- Turn-based combat requires careful UX to avoid feeling slow
- Many systems to implement (combat, AI, pathfinding)
- Need tools or editors for map creation

### Neutral
- May want to add isometric view later (requires rendering changes)
- AI complexity depends on desired difficulty
- Balance between simplicity and depth is ongoing
- Asset requirements are significant (tiles, sprites, UI elements)

### Future Considerations
- Isometric view transformation
- Pixel art vs HD sprite style
- Multiplayer/co-op potential
- Mobile touch controls
- Save system (localStorage vs cloud)
