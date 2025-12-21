# Walk Down

## Description

4-frame walking animation cycle - walking toward viewer.

## Animation Sequence Details

Create a smooth 4-frame walk cycle in the 2x2 grid:

1. **Frame 1 (Top-Left):** Right foot stepping forward, left arm forward.
2. **Frame 2 (Top-Right):** Neutral passing position (legs together/crossing), body slightly raised.
3. **Frame 3 (Bottom-Left):** Left foot stepping forward, right arm forward.
4. **Frame 4 (Bottom-Right):** Neutral passing position (legs together/crossing), body slightly raised.

**STABILITY NOTE:** In each of the 4 frames, the character's body (head/torso) must be centered in the exact same position within the square. Do not shift the character horizontally or vertically between frames (except for the specific bounce). This prevents "shaking" when animated.

## Pose Details

- Character walking toward the viewer (front view)
- Arms swinging naturally opposite to legs
- Body has slight bounce (up on passing frames, down on contact frames)
- We see their front fully

## Viewing Angle

- Front view - character faces toward camera

## Usage

Down-walking animation for game movement toward viewer.
