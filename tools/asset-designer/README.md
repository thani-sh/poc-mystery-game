# Asset Designer

A full-stack SvelteKit web application for creating and managing character sprites, portraits, and other game assets for the Mystery Game.

## Features

- **Configuration Editor**: Edit base configuration documents (markdown files in `docs/spec/`) that define art styles, character templates, and animation frames
- **Actor Management**: View and manage character descriptions stored in `docs/spec/actors/`
- **AI Portrait Generation**: Generate character portraits using Google Gemini SDK based on character descriptions and style guidelines
- **File System Integration**: Reads and writes directly to the local filesystem for seamless integration with the game project
- **Modern UI**: Built with DaisyUI components and Tailwind CSS 4 for a responsive, accessible interface

## Prerequisites

- Node.js version 20 or later
- Google Gemini API key (for image generation features)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in this directory with:

   ```
   GEMINI_API_KEY=your_api_key_here
   ```

   Get your API key from [Google AI Studio](https://aistudio.google.com/apikey)

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## Project Structure

```
src/
├── lib/
│   └── server/
│       ├── filesystem.ts    # File system utilities for reading/writing specs and assets
│       └── gemini.ts        # Google Gemini SDK integration for image generation
├── routes/
│   ├── +layout.svelte       # Main layout with navigation
│   ├── +page.svelte         # Home page
│   ├── config/              # Configuration editor route
│   │   ├── +page.server.ts  # Load spec files
│   │   ├── +page.svelte     # Config UI
│   │   └── +server.ts       # Save endpoint
│   ├── actors/              # Actor management routes
│   │   ├── +page.server.ts  # Load actors list
│   │   ├── +page.svelte     # Actors list UI
│   │   └── [actorId]/       # Individual actor page
│   │       ├── +page.server.ts
│   │       ├── +page.svelte
│   │       └── +server.ts   # Generate/save endpoints
│   └── api/
│       └── actors/
│           └── [actorId]/
│               └── portrait/
│                   └── +server.ts  # Serve portrait images
└── styles.css               # Global styles with Tailwind & DaisyUI
```

## Routes

### `/` - Home

Landing page with quick links to main features.

### `/config` - Configuration Editor

- View and edit base configuration documents from `docs/spec/`
- Files include: `base-portrait.md`, `base-sprite.md`, etc.
- Excludes actor files and subdirectories

### `/actors` - Actor List

- View all available actors from `docs/spec/actors/`
- Shows actor names and portrait thumbnails
- Indicates which actors have portraits generated

### `/actors/[actorId]` - Actor Detail

- View and edit character description
- Generate AI portraits using Gemini
- Preview generated portraits
- Portraits are saved to `/assets/actors/[actorId]/portrait.png`

## Technology Stack

- **SvelteKit**: Full-stack framework with filesystem routing
- **DaisyUI**: UI component library built on Tailwind CSS
- **Tailwind CSS 4**: Utility-first CSS framework
- **Google Gemini SDK**: AI image generation
- **gray-matter**: Parse markdown frontmatter
- **TypeScript**: Type-safe development

## Development

```bash
# Start dev server
npm run dev

# Type check
npm run check

# Format code
npm run format

# Lint
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Notes

- The app reads from and writes to the project's `docs/spec/` directory
- Generated images are saved to the project's `/assets/actors/` directory
- All operations are server-side using SvelteKit's remote functions (no API routes or form actions)
- Image generation requires a valid `GEMINI_API_KEY` environment variable
