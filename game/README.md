# Mystery Game - Top-Down 2D Investigation Game

A web-based mystery investigation game built with PixiJS v8.

## Overview

This project is a proof-of-concept for a 2D mystery investigation game featuring:
- Grid-based exploration and movement
- Interactive NPCs with dialogue
- Clue collection and investigation
- Evidence connections and deduction
- Story-driven mystery solving

## Technology Stack

- **PixiJS v8**: High-performance 2D WebGL rendering engine
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **AssetPack**: Automated asset optimization
- **@pixi/sound**: Audio management
- **@pixi/ui**: UI components

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

### Development

The development server will start at `http://localhost:5173` with hot module replacement enabled.

## Project Structure

```
game/
├── public/                   # Static assets (served as-is)
│   └── assets/              # Processed game assets (auto-generated)
├── raw-assets/              # Source assets (processed by AssetPack)
├── src/
│   ├── engine/              # Core PixiJS engine wrapper
│   │   ├── audio/          # Audio management
│   │   ├── navigation/     # Screen/popup navigation
│   │   ├── resize/         # Responsive handling
│   │   └── utils/          # Engine utilities
│   ├── app/                # Application layer
│   │   ├── screens/        # Full-screen game screens
│   │   ├── popups/         # Modal overlays
│   │   ├── ui/            # Reusable UI components
│   │   └── utils/         # App utilities
│   ├── game/               # Game logic layer
│   │   ├── types.ts       # Core type definitions
│   │   ├── systems/       # Game systems (state, investigation)
│   │   ├── grid/          # Grid system and pathfinding
│   │   ├── data/          # Game data definitions
│   │   └── ai/            # AI for NPCs
│   └── main.ts            # Application entry point
├── scripts/                # Build scripts
└── index.html             # HTML entry point
```

## Architecture

The project follows a layered architecture:

1. **Engine Layer** (`src/engine/`): Core PixiJS integration and services
2. **App Layer** (`src/app/`): Screens, UI components, and presentation logic
3. **Game Layer** (`src/game/`): Pure game logic, data structures, and systems

See [Architectural Decision Records](../docs/adrs/README.md) for detailed design decisions.

## Game Systems

### Grid System
- Rectangular tile-based grid
- Pathfinding with A* algorithm
- Movement range calculation
- Terrain effects on movement

### Investigation System
- Clue collection and tracking
- Evidence connections and relationships
- NPC dialogue and testimony
- Interactive environment examination

### State Management
- Centralized game state
- Character and NPC management
- Map transitions
- Clue and investigation progress tracking

## Assets

Assets are managed through AssetPack:
1. Place source assets in `raw-assets/`
2. Run the build process
3. Optimized assets are generated in `public/assets/`
4. A manifest is automatically created for loading

## Documentation

- [ADR-001: Choice of PixiJS v8 and Project Setup](../docs/adrs/001-pixijs-v8-setup.md)
- [ADR-002: Project Architecture and Structure](../docs/adrs/002-project-architecture.md)
- [ADR-003: Mystery Game Design](../docs/adrs/003-mystery-game-design.md)

## Development Status

This is currently a boilerplate setup with core systems implemented but no game content. The following are ready:

- ✅ PixiJS v8 project setup
- ✅ Type definitions for mystery game entities
- ✅ Grid system with pathfinding
- ✅ Game state management
- ✅ Clue and investigation types
- ✅ Sample data structures (clues, NPCs, maps)
- ⏳ Investigation screen implementation
- ⏳ Exploration screen implementation
- ⏳ Character sprites and animations
- ⏳ Tile graphics
- ⏳ UI design
- ⏳ Dialogue system implementation
- ⏳ Save/load system

## License

[Add license information]
