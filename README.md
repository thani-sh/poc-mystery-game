# poc-mystery-game

A proof-of-concept repository for a web-based 2D mystery investigation game.

## Repository Structure

```
poc-mystery-game/
├── docs/           # Documentation and Architectural Decision Records
└── game/           # The PixiJS-based mystery game application
```

## Documentation

See the [docs](./docs) directory for architectural decisions and design documentation:
- [Architectural Decision Records (ADRs)](./docs/adrs/README.md)

## Game Application

The main game application is in the [game](./game) directory. See the [game README](./game/README.md) for setup instructions and development details.

## Quick Start

```bash
# Install dependencies
cd game
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Technology Stack

- **PixiJS v8**: High-performance 2D WebGL rendering
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server

For detailed information about the game, see [game/README.md](./game/README.md).
