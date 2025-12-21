# Base Character Sprite Instructions

## Overall Style

- 1990s retro JRPG character design
- 90s fantasy anime style with slightly exaggerated, chibi-influenced proportions (large expressive eyes, slightly oversized heads, simplified but readable anatomy)
- Simple, readable sprites with clear silhouettes optimized for 16-bit era aesthetics
- Slightly exaggerated, chibi-influenced proportions (large expressive eyes, slightly oversized heads)
- Clean, bold character shapes with easily distinguishable features (hair, clothing, accessories)
- Expressive poses and movement that read clearly even at small sprite sizes
- Consistent stylized design so that every sprite looks like it belongs to the same character and game

## Art Medium

- Use pixel art style while resembling major features
- Flat cel-shaded coloring with minimal gradients
- Bold, clean black outlines around major forms and details
- Limited but harmonious color palette with strong contrast between character and white background
- Simplified detail level appropriate for 16-bit era sprite work

## Spritesheet Format

**CRITICAL: Generate a 2x2 grid spritesheet containing 4 animation frames**

- Create a square image divided into a 2x2 grid (4 equal squares)
- Each square contains one animation frame of the character
- Animation order: Top-left (0,0) → Top-right (0,1) → Bottom-left (1,0) → Bottom-right (1,1)
- All 4 frames should show slight variations in the pose to create smooth animation when cycled
- For walk cycles: show the full stepping motion across the 4 frames
- For idle poses: show subtle breathing or stance shifts across the 4 frames
- Frames must be evenly spaced in the 2x2 grid with clear separation

## Sprite Framing and Size

- Full-body character sprites showing from head to feet
- Character should occupy approximately 70-80% of each individual frame's height
- Leave small margins around the sprite within each square to prevent touching the borders
- Character should be centered within each square
- Maintain consistent proportions (head size, body size, limb length) across all 4 animation frames
- **ALL CHARACTERS ARE THE SAME SIZE**: Children, adults, animals - all use the same sprite dimensions and proportions for gameplay consistency

## Design Consistency

All sprites of the same character must share:

- The same character design (hair, face, clothing, proportions)
- The same art style and line weight
- The same color palette
- The same simplified level of detail across all 4 frames
- The same scale and size in every frame of the spritesheet
- Lighting should be consistent - simple, even illumination from above and slightly in front
- Avoid dramatic shadows or perspective changes between frames
- **ANIMATION CONSISTENCY IS CRITICAL**: If a character is holding an object, item, or accessory in one frame, they MUST hold it in ALL 4 frames. Objects cannot appear or disappear between animation frames
- All clothing, accessories, and held items must remain consistent across all 4 animation frames

## Background

- Pure white background (#ffffff) for all sprites
- No environmental elements, props, or scene details - focus entirely on the character sprite
- Clean separation between the 4 squares in the grid (thin dividing lines are acceptable for clarity)

## Technical Requirements

- PNG format
- Square aspect ratio for the overall spritesheet (e.g., 512x512 containing four 256x256 frames)
- High enough resolution that sprites remain crisp when divided into the 2x2 grid
- Each of the 4 frames must be perfectly square and equal in size

## Negative Prompts

--no 3d render, photorealistic, blurry, sketch, messy lines, painterly brush strokes, modern digital painting look, photobashing, inconsistent character design, environmental backgrounds, props in scene, dramatic perspective, foreshortening, motion blur, single frame, multiple characters in one frame, varying character sizes, complex realistic anatomy, grid layout with more or fewer than 4 frames
