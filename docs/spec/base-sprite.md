# Base Character Sprite Instructions

## Overall Style

- 1990s retro JRPG character design
- 90s fantasy anime style with slightly exaggerated, chibi-influenced proportions (large expressive eyes, slightly oversized heads, simplified but readable anatomy)
- Clean, bold character silhouettes with clear, easily distinguishable shapes for hair, armor, and accessories
- Expressive poses and movement that read clearly even at small sprite sizes
- Consistent stylized design so that every sprite looks like it belongs to the same character and game

## Art Medium

- Ink and watercolor illustration look
- Flat cel-shaded coloring with minimal gradients
- Bold, clean black outlines around major forms and details
- Limited but harmonious color palette with strong contrast between character and background
- Subtle vintage paper texture, as if printed in a 1990s game manual or strategy guide

## Sprite Framing and Size

- Full-body character sprites showing from head to feet
- Character should occupy approximately 70-80% of the frame's height to ensure readability
- Leave small margins around the sprite to prevent touching the frame borders
- Character should be centered within the frame
- Maintain consistent proportions (head size, body size, limb length) across all poses

## Design Consistency

All sprites of the same character must share:

- The same character design (hair, face, clothing, proportions)
- The same art style and line weight
- The same color palette
- The same level of detail
- The same scale and size
- Lighting should be consistent - simple, even illumination from above and slightly in front
- Avoid dramatic shadows or perspective changes between frames
- **ANIMATION CONSISTENCY IS CRITICAL**: If a character is holding an object, item, or accessory in one frame, they MUST hold it in ALL related frames. Objects cannot appear or disappear between animation frames
- All clothing, accessories, and held items must remain consistent across all poses

## Background

- Transparent background (alpha channel) for all sprites - no solid background color
- No environmental elements, props, or scene details - focus entirely on the character sprite

## Technical Requirements

- PNG format with alpha channel transparency support
- High enough resolution that sprites remain crisp (recommended: 256x256 or higher for a single sprite)
- Square aspect ratio for individual sprites

## Negative Prompts

--no 3d render, photorealistic, low resolution, blurry, sketch, messy lines, painterly brush strokes, modern digital painting look, photobashing, inconsistent character design, environmental backgrounds, props in scene, dramatic perspective, foreshortening, motion blur, multiple characters, grid layout
