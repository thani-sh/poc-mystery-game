# Character Designer Tool

A SvelteKit-based web application for generating character designs using Google's Gemini AI. This tool uses base prompts from `docs/prompts` and allows customization of character details to generate actual character images via Google's Gemini 3 Pro Image Preview model.

## Features

- 🎨 **Character Customization**: Specify race, class, gender, age, physical features, clothing, and more
- 🖼️ **Automatic Dual Generation**: Automatically generates both portrait and game sprite sheets
- 🔗 **Reference-Based Generation**: Portrait sprite sheet generated first, then used as reference for game sprite sheet to ensure consistency
- 🤖 **Google Gemini AI Integration**: Uses Gemini 3 Pro Image Preview model to generate actual character images
- 📋 **Prompt Management**: View and copy generated prompts for reference
- 💾 **Download Images**: Download generated images directly from the browser
- ✨ **Animated UI**: Beautiful, responsive SvelteKit interface with Lucide icons
- 🔒 **Secure**: API keys stored in .env file, never exposed to the client

## Setup

1. Install dependencies:
   ```bash
   cd tool/character-designer
   npm install
   ```

2. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Add your Google AI API Key to the `.env` file:
   ```
   GEMINI_API_KEY=your_google_ai_api_key_here
   ```
   Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to the URL shown in the terminal (usually http://localhost:5173)

## Running All Tools

From the repository root, you can start all tools (game + character designer) at once:

```bash
pnpm run dev
```

Or with npm:

```bash
npm run dev
```

## Usage

### Getting Started

1. **Fill in Character Details**:
   - **Race/Species**: Human, Elf, Dwarf, Dragon, etc.
   - **Class/Role**: Warrior, Mage, Rogue, Merchant, etc.
   - **Gender**: Male, Female, Non-binary, or leave unspecified
   - **Age/Appearance**: Young, Middle-aged, Elderly, Child, etc.
   - **Physical Features**: Key characteristics like scars, facial features, build
   - **Clothing/Armor**: What the character wears
   - **Hair Color**: Specific hair color
   - **Eye Color**: Specific eye color
   - **Skin Tone**: Skin color or texture
   - **Additional Details**: Any other specific details

2. **Generate Characters**:
   - Click "Generate Character" button
   - The tool will automatically generate **both** sprite sheets:
     1. **Portrait Sprite Sheet** (3:4 ratio, 12 emotional expressions for dialogue)
     2. **Game Sprite Sheet** (Square format, 16 frames for movement and actions)
   - The portrait is generated first and used as reference for the game sprite sheet to ensure matching style
   - Generated images will appear on the right side, one below the other
   - Download images using the download buttons

### Tips

- **Be Specific**: The more details you provide, the better the generated images will match your vision
- **Use Colors**: Specify exact colors for hair, eyes, clothing, etc.
- **Character Consistency**: The two-step generation process ensures both sprite sheets match
- **Experiment**: Try different prompts and details to get varied results

## Understanding the Output

### Portrait Sprite Sheet (3:4 ratio)
- **Layout**: 4 columns × 3 rows (12 cells)
- **Contains**: Various emotional expressions and talking animations
- **Use Case**: Dialogue boxes, character conversations, emotional reactions
- **Frames**: Talking, Neutral, Thinking, Happy, Laughing, Surprised, Determined, Angry, Sad, Exhausted, Dizzy

### Game Sprite Sheet (Square)
- **Layout**: 4 columns × 4 rows (16 cells)
- **Contains**: Movement in 4 directions, idle animation, and action frames
- **Use Case**: Game character sprites for movement and actions
- **Frames**: Move (left, right, up, down), Idle animation, Inspect, Jump, Custom actions

## Technical Details

### Base Prompts
The tool uses two base prompt templates located in `docs/prompts`:
- `character-portrait-prompt.md`: Template for portrait sprite sheets
- `character-spritesheet-prompt.md`: Template for game sprite sheets

These templates define:
- Art style (1990s retro JRPG, anime-influenced)
- Layout specifications (grid structure, frame arrangement)
- Technical requirements (aspect ratio, transparency, resolution)
- Artistic guidelines (ink and watercolor look, cel-shaded coloring)

### Google Gemini AI Integration
The tool uses:
- **Model**: `gemini-3-pro-image-preview`
- **Config**: Image generation with 1K size, Google Search tools enabled
- **Response**: Streams images and text responses
- **Format**: Returns Base64-encoded images with MIME types

### Architecture
- **Frontend**: SvelteKit 5 with TypeScript
- **Backend**: SvelteKit server actions
- **API**: Google GenAI SDK (@google/genai)
- **Styling**: Scoped CSS with animations

## API Key Requirements

You need a Google AI API key with access to:
- Gemini 3 Pro Image Preview model
- Image generation capabilities

Get your API key at [Google AI Studio](https://aistudio.google.com/app/apikey)

## Troubleshooting

**"No images were generated" error:**
- Ensure your API key has access to image generation models
- Check that you're using the correct model name
- Verify your prompt isn't too complex or violating content policies

**"API key is required" error:**
- Make sure you've entered your API key in the form field

**Images not loading:**
- Check browser console for errors
- Ensure the generated Base64 data is valid
- Try refreshing the page

**Prompt seems incomplete:**
- Fill in more character details
- Check that the base prompt files exist in `docs/prompts/`
- Review the generated prompt in the display area

## Building for Production

```bash
npm run build
npm run preview
```

The build will create optimized static files in the `.svelte-kit` directory.

## License

Part of the POC Mystery Game project.
