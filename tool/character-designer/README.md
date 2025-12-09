# Character Designer Tool

A web-based tool for generating character design prompts for the POC Mystery Game. This tool uses the base prompts from `docs/prompts` and allows customization of character details to generate AI-ready image generation prompts.

## Features

- 🎨 **Character Customization**: Specify race, class, gender, age, physical features, clothing, and more
- 🖼️ **Dual Output Types**: Generate either portrait sprite sheets (3:4 ratio, 12 frames) or game sprite sheets (square, 16 frames)
- 🤖 **Google AI Integration**: Uses Google Generative AI API (Note: Currently generates prompts for use with image generation services)
- 📋 **Prompt Management**: View and copy generated prompts for use with various AI image generation services
- 💾 **Local Storage**: API key is stored securely in browser's local storage
- ✨ **Animated UI**: Beautiful, responsive interface with smooth animations

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
   - The key is stored locally in your browser

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
   - The tool will generate a detailed prompt based on the template
   - View the generated prompt in the display area
   - Copy the prompt to use with image generation services

5. **Use the Prompt**:
   - Copy the generated prompt using the "Copy Prompt" button
   - Use it with image generation services like:
     - Google Imagen API
     - Midjourney
     - DALL-E
     - Stable Diffusion
     - Leonardo.ai
     - Any other AI image generation tool

### Tips

- **Be Specific**: The more details you provide, the better the generated prompt will match your vision
- **Use Colors**: Specify exact colors for hair, eyes, clothing, etc.
- **Character Consistency**: Use the same details across multiple generations for consistent character designs
- **Save Your Work**: Copy prompts to a document for reuse and iteration

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

### Integration
The tool:
1. Loads base prompt templates from markdown files
2. Replaces placeholder tags with user-provided character details
3. Generates a complete, AI-ready image generation prompt
4. Displays the prompt for copying to image generation services

### API Key Storage
- API keys are stored in browser's `localStorage`
- Keys never leave your browser or get sent to any server except Google's AI services
- Keys persist across sessions for convenience

## Limitations

- **No Direct Image Generation**: Currently, the tool generates prompts only. You need to use the prompt with an actual image generation service.
- **Google AI API**: The current Google Generative AI JavaScript SDK doesn't support image generation. Use the generated prompt with:
  - Google Imagen API (via API request)
  - Other image generation services like Midjourney, DALL-E, Stable Diffusion

## Future Enhancements

Potential improvements:
- [ ] Direct integration with Imagen API for image generation
- [ ] Gallery view to save and manage generated characters
- [ ] Character preset library
- [ ] Batch generation for multiple characters
- [ ] Export character data as JSON
- [ ] Integration with the main game for importing characters

## Troubleshooting

**"Could not load base prompt templates" error:**
- Ensure you're running the tool from the correct directory
- Check that `docs/prompts/character-portrait-prompt.md` and `character-spritesheet-prompt.md` exist
- Make sure the dev server is serving the entire repository

**API key not working:**
- Verify your API key is correct at [Google AI Studio](https://aistudio.google.com/app/apikey)
- Check that the API key has the necessary permissions
- Ensure you're not hitting rate limits

**Prompt seems incomplete:**
- Fill in more character details
- Check that the base prompt files are loaded correctly
- Review the generated prompt in the display area

## License

Part of the POC Mystery Game project.
