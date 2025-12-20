# Development Tools

This directory contains development tools for creating and managing assets for the POC Mystery Game.

## Available Tools

...

## Adding New Tools

When adding new tools to this directory:

1. Create a subdirectory under `tools/`
2. Add a README.md explaining the tool's purpose and usage
3. Include a package.json if the tool has dependencies
4. Update this README to list the new tool
5. Ensure build artifacts are excluded in `.gitignore`

## Tool Guidelines

- **Self-contained**: Each tool should be independent and self-contained
- **Documentation**: Include clear README with setup and usage instructions
- **Dependencies**: Manage dependencies separately from the main game
- **Purpose**: Tools should help with game development, asset creation, or testing
- **No Game Code**: Tools should not depend on or modify game code directly
