# Character Designer Tool

A SvelteKit-based web application for generating character designs using Google's Gemini AI. This tool uses base prompts from `docs/prompts` and allows customization of character details to generate actual character images via Google's Gemini 3 Pro Image Preview model.

## Features

- 🎨 **Character Customization**: Specify race, class, gender, age, physical features, clothing, and more
- 🖼️ **Dual Output Types**: Generate either portrait sprite sheets (3:4 ratio, 12 frames) or game sprite sheets (square, 16 frames)
- 🤖 **Google Gemini AI Integration**: Uses Gemini 3 Pro Image Preview model to generate actual character images
- 📋 **Prompt Management**: View and copy generated prompts for reference
- 💾 **Download Images**: Download generated images directly from the browser
- ✨ **Animated UI**: Beautiful, responsive SvelteKit interface with smooth animations
- 🔒 **Secure**: API keys are sent securely and never stored on the server

## Setup

1. Install dependencies:
   ```bash
   cd tool/character-designer
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown in the terminal (usually http://localhost:5173)

## Usage

### Getting Started

1. **Enter your Google AI API Key**:
   - Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Enter it in the "Google AI API Key" field
   - The key is sent securely to generate images and is never stored

2. **Select Character Type**:
   - **Portrait Sprite Sheet**: 3:4 aspect ratio with 12 emotional expressions (for dialogue)
   - **Game Sprite Sheet**: Square format with 16 movement and action frames (for gameplay)

3. **Fill in Character Details**:
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

4. **Generate Character**:
   - Click "Generate Character" button
   - The tool will send the prompt to Google's Gemini AI
   - Generated images will appear on the right side
   - Download images using the download buttons

### Tips

- **Be Specific**: The more details you provide, the better the generated images will match your vision
- **Use Colors**: Specify exact colors for hair, eyes, clothing, etc.
- **Character Consistency**: Use the same details across multiple generations for consistent character designs
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
