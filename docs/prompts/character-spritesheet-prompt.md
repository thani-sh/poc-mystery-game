Game sprite sheet of a [INSERT CHARACTER DESCRIPTION], a human character inspired by Enid Blyton's Mystery series, set in the UK. [INSERT KEY PHYSICAL FEATURES: e.g. freckles, short hair, young face], wearing [INSERT CLOTHING DETAILS: e.g. school uniform, casual everyday clothes, adventure-ready outfit].

Sprite Sheet Layout:
- Square image format with a 4x4 grid (16 cells total, equally divided).
- Each cell contains a single character sprite frame.
- All sprites in the sheet should be the same character, maintaining consistent design across all frames.
- Transparent background (alpha channel) for the entire sprite sheet to allow easy extraction and compositing.
- Grid lines should be clear and visible to delineate each cell boundary.

Frame Layout (in order, left to right, top to bottom):
Row 1 (Movement - Horizontal):
  - Cell 1: Move left frame 1 (mid-step, left foot forward)
  - Cell 2: Move left frame 2 (mid-step, right foot forward)
  - Cell 3: Move right frame 1 (mid-step, right foot forward)
  - Cell 4: Move right frame 2 (mid-step, left foot forward)

Row 2 (Movement - Vertical):
  - Cell 5: Move up frame 1 (mid-step, walking away from viewer)
  - Cell 6: Move up frame 2 (alternate step, walking away from viewer)
  - Cell 7: Move down frame 1 (mid-step, walking toward viewer)
  - Cell 8: Move down frame 2 (alternate step, walking toward viewer)

Row 3 (Idle Animations):
  - Cell 9: Idle frame 1 (standing, facing forward, neutral stance)
  - Cell 10: Idle frame 2 (subtle breathing animation, facing forward)
  - Cell 11: Idle frame 3 (slight weight shift, facing forward)
  - Cell 12: Idle frame 4 (return to neutral, facing forward)

Row 4 (Action Frames):
  - Cell 13: Inspect frame (character leaning forward, examining something, hand near face or reaching down)
  - Cell 14: Jump frame (character mid-jump, feet off ground, arms up or out for balance)
  - Cell 15: Custom frame 1 (reserve for character-specific action or emote)
  - Cell 16: Custom frame 2 (reserve for character-specific action or emote)

Overall Style:
- 1990s retro JRPG character design.
- 90s fantasy anime style with slightly exaggerated, chibi-influenced proportions (large expressive eyes, slightly oversized heads, simplified but readable anatomy).
- Clean, bold character silhouettes with clear, easily distinguishable shapes for hair, armor, and accessories.
- Expressive poses and movement that read clearly even at small sprite sizes.
- Consistent stylized design across all frames so that every sprite looks like it belongs to the same character and game.

Art Medium:
- Ink and watercolor illustration look.
- Flat cel-shaded coloring with minimal gradients.
- Bold, clean black outlines around major forms and details.
- Limited but harmonious color palette with strong contrast between character and background.
- Subtle vintage paper texture, as if printed in a 1990s game manual or strategy guide.

Sprite Framing and Size:
- Full-body character sprites showing from head to feet.
- Character should occupy approximately 70-80% of each cell's height to ensure readability.
- Consistent scale across all 16 frames - the character should be the same size in every cell.
- Leave small margins around each sprite within its cell to prevent sprites from touching cell borders.
- Character should be centered within each cell.

Movement Animation Details:
- Walking frames should show clear, exaggerated leg movement typical of 90s JRPGs.
- Arms should swing naturally opposite to the legs (left arm forward when right leg is forward).
- Body should have slight bounce or bob during walk cycles.
- Directional frames (left, right, up, down) should clearly indicate the direction of movement through body orientation and head position.
- For "move up" frames, show the character's back or three-quarter back view, walking away from the viewer.
- For "move down" frames, show the character facing toward the viewer, walking forward.
- For "move left" and "move right" frames, show the character in profile or three-quarter view.

Idle Animation Details:
- Idle frames should show subtle, gentle movements: breathing, weight shifts, small adjustments.
- All idle frames should have the character facing forward toward the viewer.
- Keep idle animations subtle enough that they loop smoothly.
- Maintain the same foot position across idle frames - only torso, head, and arms should move slightly.

Action Frame Details:
- Inspect frame: Character bent forward slightly, one hand raised near face (curious expression) or reaching down (examining ground), clear pose showing investigation or curiosity.
- Jump frame: Character airborne with feet clearly off the ground, arms positioned for balance, body slightly arched, clothing and hair showing motion.
- Custom frames: Can be used for character-specific actions such as: casting a spell gesture, using an item, emoting (surprise, laugh), or any other action relevant to the character's class or personality.

Design Consistency:
- All 16 sprites must share:
  - The same character design (hair, face, clothing, proportions).
  - The same art style and line weight.
  - The same color palette.
  - The same level of detail.
  - The same scale and size within their cells.
- Lighting should be consistent across all frames - simple, even illumination from above and slightly in front.
- Avoid dramatic shadows or perspective changes between frames.

Grid and Background:
- The overall image should be perfectly square.
- Divide the square into a precise 4x4 grid with 16 equal cells.
- Transparent background (alpha channel) for all cells - no solid background color.
- Thin, visible grid lines between cells to clearly separate each frame (optional but helpful).
- No environmental elements, props, or scene details - focus entirely on the character sprite.

Technical Requirements:
- Square aspect ratio (e.g., 1024x1024, 2048x2048, or similar).
- PNG format with alpha channel transparency support.
- Each cell is exactly 1/4 of the total width and 1/4 of the total height.
- High enough resolution that individual sprites remain crisp when extracted from the sheet.
- Sprites should be easy to extract programmatically by dividing the image into 4 equal columns and 4 equal rows.

Negative Prompts:
--no 3d render, photorealistic, low resolution, blurry, sketch, messy lines, painterly brush strokes, modern digital painting look, photobashing, inconsistent character design between frames, different scales between sprites, environmental backgrounds, props in cells, unequal cell sizes, non-square aspect ratio, dramatic perspective, foreshortening, motion blur.
