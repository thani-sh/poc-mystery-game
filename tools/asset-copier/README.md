# Asset Copier CLI Tool

A Bun.js-based CLI tool that copies game assets from the `/assets/` directory to `/game/raw-assets/main`, with automatic background removal for character sprites and portraits.

## Features

- 🎨 **Automatic Background Removal**: Intelligently removes backgrounds from character sprites and portraits
- 📋 **Smart Copying**: Preserves concept art as-is without processing
- 🚀 **Fast Processing**: Uses Sharp for efficient image processing
- 📁 **Directory Structure**: Maintains the original directory structure in the target location

## Installation

```bash
cd tools/asset-copier
bun install
```

## Usage

### Development Mode

Run directly from source:

```bash
bun run dev
```

### Build and Use Globally

```bash
bun run build
```

Then you can run the built version:

```bash
./dist/index.js
```

## How It Works

The tool scans the `/assets/` directory and processes files based on their location:

### Background Removal Applied To:

- **Character Frames**: Files in `actors/*/frames/` (e.g., `idle.png`, `walk.png`)
- **Character Portraits**: Files in `actors/*/speech/` (e.g., `talking.png`)

### Copied As-Is:

- **Concept Art**: Files with "concept" in the name
- **Other Assets**: Any assets not matching the sprite/portrait patterns

## Background Removal Algorithm

The tool uses a smart background removal approach:

1. **For images with alpha channel**: Enhances existing transparency
2. **For images without alpha**: Creates transparency by detecting near-white/uniform pixels
   - Pixels with brightness > 200 (on 0-255 scale)
   - Color uniformity < 30 (max channel difference)
   - These pixels are made fully transparent

This approach works well for:

- Character sprites on white backgrounds
- Generated AI art with uniform backgrounds
- Scanned artwork with consistent background colors

## Directory Structure

```
/assets/
  ├── actors/
  │   ├── bets/
  │   │   ├── concept.png           (copied as-is)
  │   │   ├── frames/
  │   │   │   ├── idle.png          (background removed)
  │   │   │   └── walk.png          (background removed)
  │   │   └── speech/
  │   │       └── talking.png       (background removed)
  │   └── ...
  └── main-cast-concept-image.jpeg  (copied as-is)

          ⬇️  Processed and copied to  ⬇️

/game/raw-assets/main/
  └── (same structure as above)
```

## Dependencies

- **Bun.js**: Runtime and package manager
- **Sharp**: High-performance image processing library

## Technical Notes

- Image processing is done using Sharp, which is well-supported on Linux systems
- The tool preserves PNG format for processed images to maintain alpha channel
- Original images are never modified; only copies are processed
- Progress is logged to the console for visibility

## Example Output

```
🎨 Asset Copier Tool

📁 Source: /home/user/project/assets
📁 Target: /home/user/project/game/raw-assets/main

🔄 Processing assets...

  📋 Copying as-is: main-cast-concept-image.jpeg
  📋 Copying as-is: actors/bets/concept.png
  📸 Processing with background removal: actors/bets/frames/idle.png
  📸 Processing with background removal: actors/bets/frames/walk.png
  📸 Processing with background removal: actors/bets/speech/talking.png
  ...

✅ Asset preparation complete!
```

## Troubleshooting

### Sharp Installation Issues

If Sharp fails to install, ensure you have the required system dependencies:

```bash
# Ubuntu/Debian
sudo apt-get install libvips-dev

# Fedora/RHEL
sudo dnf install vips-devel

# Arch Linux
sudo pacman -S libvips
```

### Background Not Removed Properly

The current algorithm works best with:

- White or light gray backgrounds
- Uniform background colors
- High contrast between subject and background

For different background colors, you may need to adjust the threshold values in the `removeBackground()` function.
