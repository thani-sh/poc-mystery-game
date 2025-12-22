# Copilot Instructions

## Repository Overview

A proof-of-concept web-based 2D mystery investigation game built with PixiJS v8 and TypeScript. The game features grid-based exploration, interactive NPCs, clue collection, and evidence-based deduction.

## Technology Stack

- **PixiJS v8**: 2D WebGL rendering
- **TypeScript**: Type-safe development
- **Vite**: Build tool and dev server
- **ESLint**: Code linting

## Build Commands

```bash
# Game application (main project)
cd game
npm install
npm run start      # Development server at localhost:5173
npm run build      # Production build (runs lint + tsc + vite build)
npm run lint       # Run ESLint

# Asset Designer tool
cd tools/asset-designer
npm install
npm run dev        # Development server

# Asset Copier tool (uses bun)
cd tools/asset-copier
bun install
bun run dev
```

## Project Structure

```
├── game/              # Main PixiJS game application
│   ├── src/
│   │   ├── engine/   # Core PixiJS integration (audio, navigation, resize)
│   │   ├── app/      # Screens, popups, UI components
│   │   └── game/     # Pure game logic (systems, grid, data, AI)
│   ├── raw-assets/   # Source assets (processed by AssetPack)
│   └── public/       # Static assets (auto-generated)
├── tools/            # Development tools (asset-designer, asset-copier)
└── docs/             # Documentation and ADRs
```

## Architecture

Three-layer architecture:
1. **Engine Layer** (`src/engine/`): PixiJS integration and services
2. **App Layer** (`src/app/`): Screens, UI, and presentation logic
3. **Game Layer** (`src/game/`): Pure game logic, data, and systems

## Development Guidelines

- Follow existing code style and patterns
- Use TypeScript with strict typing
- Keep game logic separate from rendering
- Screens extend `Container` with lifecycle methods
- Run linter before committing
- See [ADRs](docs/adrs/README.md) for architectural decisions

## Key Conventions

- Use AssetPack for asset processing (raw-assets → public/assets)
- Grid-based movement with A* pathfinding
- Data-driven design for game entities
- No global state framework (use service classes)
- Asset loading by bundles (preload, main, etc.)
