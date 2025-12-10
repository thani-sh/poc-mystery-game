Game sprite sheet of a [INSERT CHARACTER DESCRIPTION], a human character set in the 1980s UK. [INSERT KEY PHYSICAL FEATURES: e.g. freckles, short hair, young face], wearing [INSERT CLOTHING DETAILS: e.g. school uniform, casual everyday clothes, adventure-ready outfit].

Sprite Sheet Layout:
- Square image format with a 4x4 grid (16 cells total, equally divided).
- Each cell contains a single character sprite frame.
- All sprites in the sheet should be the same character, maintaining consistent design across all frames.
- Transparent background (alpha channel) for the entire sprite sheet to allow easy extraction and compositing.
- Grid lines should be clear and visible to delineate each cell boundary.
- **CRITICAL: STRICTLY follow the exact cell positioning described below. Each frame MUST be in the correct cell. Empty cells or incorrect variants will make the sprite sheet unusable with the game engine.**

Frame Layout (in order, left to right, top to bottom):
Row 1 (Moving Left - 4 Frame Animation):
  - Cell 1: Move left frame 1 (left foot forward, right foot back, body facing left, arms swinging naturally)
  - Cell 2: Move left frame 2 (both feet together mid-stride, transitional pose, body facing left)
  - Cell 3: Move left frame 3 (right foot forward, left foot back, body facing left, arms swinging opposite to frame 1)
  - Cell 4: Move left frame 4 (both feet together mid-stride, transitional pose returning to frame 1, body facing left)

Row 2 (Moving Up - 4 Frame Animation, Back View):
  - Cell 5: Move up frame 1 (walking away from viewer, we see the character's back, left foot forward, right foot back)
  - Cell 6: Move up frame 2 (walking away from viewer, both feet together mid-stride, transitional pose)
  - Cell 7: Move up frame 3 (walking away from viewer, we see the character's back, right foot forward, left foot back)
  - Cell 8: Move up frame 4 (walking away from viewer, both feet together mid-stride, transitional pose returning to frame 1)

Row 3 (Moving Down - 4 Frame Animation, Front View):
  - Cell 9: Move down frame 1 (walking toward viewer, we see their front fully - NOT sides, left foot forward, right foot back)
  - Cell 10: Move down frame 2 (walking toward viewer, front view, both feet together mid-stride, transitional pose)
  - Cell 11: Move down frame 3 (walking toward viewer, we see their front fully - NOT sides, right foot forward, left foot back)
  - Cell 12: Move down frame 4 (walking toward viewer, front view, both feet together mid-stride, transitional pose returning to frame 1)

Row 4 (Special Actions):
  - Cell 13: Search action (character leaning forward, examining ground or object, hand extended or near face, curious focused pose)
  - Cell 14: Jump action (character mid-jump, both feet clearly off ground, arms up or out for balance, body slightly arched)
  - Cell 15: Special action 1 (character-specific action: could be waving, pointing, gesturing, or using an item)
  - Cell 16: Special action 2 (character-specific action: could be celebrating, defending, or another unique pose)

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
- **CRITICAL: The character MUST be exactly the same size across all 16 cells.** No variation in scale is acceptable - this is essential for game animation.
- Leave small margins around each sprite within its cell to prevent sprites from touching cell borders.
- Character should be centered within each cell.
- Maintain identical proportions (head size, body size, limb length) across all frames.

Movement Animation Details:
- Walking frames should show clear, exaggerated leg movement typical of 90s JRPGs.
- Arms should swing naturally opposite to the legs (left arm forward when right leg is forward).
- Body should have slight bounce or bob during walk cycles.
- **ANIMATION CONSISTENCY IS CRITICAL**: If a character is holding an object, item, or accessory in one frame of an animation sequence, they MUST hold it in ALL frames of that sequence. Objects cannot appear or disappear between frames.
- All clothing, accessories, and held items must remain consistent across all frames in each row.
- For Row 1 (move left): Show the character in profile or three-quarter view, body and head facing left.
- For Row 2 (move up): Show the character's back view walking away from the viewer. We should see their back, not their face.
- For Row 3 (move down): Show the character facing directly toward the viewer, walking forward. We should see their front fully, NOT a side profile.
- Each animation row (Rows 1, 2, and 3) contains 4 frames that should loop smoothly when played in sequence.



Action Frame Details (Row 4):
- Search action (Cell 13): Character bent forward slightly, one hand raised near face (curious expression) or reaching down (examining ground), clear pose showing investigation or curiosity.
- Jump action (Cell 14): Character airborne with both feet clearly off the ground, arms positioned for balance, body slightly arched, clothing and hair showing motion.
- Special action 1 (Cell 15): Can be used for character-specific actions such as: waving, pointing, gesturing, using an item, or any action relevant to the character's personality.
- Special action 2 (Cell 16): Can be used for character-specific actions such as: celebrating, defending, emoting (surprise, laugh), or another unique pose relevant to the character.

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
