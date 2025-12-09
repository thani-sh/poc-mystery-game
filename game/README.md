# Mystery Game - Top-Down 2D JRPG

A web-based tactical JRPG inspired by Shining Force 2, built with PixiJS v8.

## Overview

This project is a proof-of-concept for a 2D tactical role-playing game featuring:
- Turn-based grid-based combat
- Character progression and party management
- Overworld exploration
- Strategic positioning and terrain effects

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
poc-mystery-game/
├── docs/                      # Documentation
│   └── adrs/                 # Architectural Decision Records
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
│   │   ├── entities/      # Game entities
│   │   ├── systems/       # Game systems (combat, state)
│   │   ├── grid/          # Grid system and pathfinding
│   │   ├── data/          # Game data definitions
│   │   └── ai/            # AI for enemies
│   └── main.ts            # Application entry point
├── scripts/                # Build scripts
└── index.html             # HTML entry point
```

## Architecture

The project follows a layered architecture:

1. **Engine Layer** (`src/engine/`): Core PixiJS integration and services
2. **App Layer** (`src/app/`): Screens, UI components, and presentation logic
3. **Game Layer** (`src/game/`): Pure game logic, data structures, and systems

See [Architectural Decision Records](./docs/adrs/README.md) for detailed design decisions.

## Game Systems

### Grid System
- Rectangular tile-based grid
- Pathfinding with A* algorithm
- Movement range calculation
- Terrain effects on movement and defense

### Combat System
- Turn-based with initiative order
- Position-based tactics
- Abilities with MP costs
- Status effects
- Victory/defeat conditions

### State Management
- Centralized game state
- Character management
- Map transitions
- Combat/exploration mode switching

## Assets

Assets are managed through AssetPack:
1. Place source assets in `raw-assets/`
2. Run the build process
3. Optimized assets are generated in `public/assets/`
4. A manifest is automatically created for loading

## Documentation

- [ADR-001: Choice of PixiJS v8 and Project Setup](./docs/adrs/001-pixijs-v8-setup.md)
- [ADR-002: Project Architecture and Structure](./docs/adrs/002-project-architecture.md)
- [ADR-003: Top-Down 2D JRPG Game Design](./docs/adrs/003-jrpg-game-design.md)

## Development Status

This is currently a boilerplate setup with core systems implemented but no game content. The following are ready:

- ✅ PixiJS v8 project setup
- ✅ Type definitions for game entities
- ✅ Grid system with pathfinding
- ✅ Combat system foundation
- ✅ Game state management
- ✅ Sample data structures
- ⏳ Battle screen implementation
- ⏳ Exploration screen implementation
- ⏳ Character sprites and animations
- ⏳ Tile graphics
- ⏳ UI design
- ⏳ AI implementation
- ⏳ Dialogue system
- ⏳ Save/load system

## License

[Add license information]