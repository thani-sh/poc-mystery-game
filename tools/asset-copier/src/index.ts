#!/usr/bin/env bun
import { resolve, join, dirname, relative } from "path";
import { mkdir, stat } from "fs/promises";
import sharp from "sharp";

// Paths relative to the project root
const ASSETS_DIR = resolve(import.meta.dir, "../../../assets");
const TARGET_DIR = resolve(import.meta.dir, "../../../game/raw-assets/main");

interface ProcessOptions {
  removeBackground: boolean;
  sourcePath: string;
  targetPath: string;
}

/**
 * Remove white background from image buffer
 */
async function removeBackgroundFromBuffer(
  pixelArray: Uint8Array,
  channels: number,
): Promise<Uint8Array> {
  // Process each pixel
  for (let i = 0; i < pixelArray.length; i += channels) {
    const r = pixelArray[i];
    const g = pixelArray[i + 1];
    const b = pixelArray[i + 2];

    // Calculate brightness and color uniformity
    const brightness = (r + g + b) / 3;
    const uniformity = Math.max(r, g, b) - Math.min(r, g, b);

    // If pixel is bright and uniform (near white/gray), make it transparent
    if (brightness > 200 && uniformity < 30) {
      pixelArray[i + 3] = 0; // Set alpha to 0
    }
  }
  return pixelArray;
}

/**
 * Remove background from an image using alpha channel detection
 * This works by making near-white/transparent pixels fully transparent
 */
async function removeBackground(
  inputPath: string,
  outputPath: string,
): Promise<void> {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // If the image already has an alpha channel, enhance transparency
    // Otherwise, create alpha channel based on color similarity to white
    if (metadata.hasAlpha) {
      // Enhance existing transparency
      await image.ensureAlpha().normalise().toFile(outputPath);
    } else {
      // Create transparency for near-white pixels
      // This uses a threshold approach: pixels close to white become transparent
      const buffer = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const { data, info } = buffer;
      const pixelArray = new Uint8Array(data);

      const processedPixels = await removeBackgroundFromBuffer(
        pixelArray,
        info.channels,
      );

      // Save processed image
      await sharp(processedPixels, {
        raw: {
          width: info.width,
          height: info.height,
          channels: info.channels as 3 | 4,
        },
      })
        .png()
        .toFile(outputPath);
    }
  } catch (error) {
    console.error(`Error removing background from ${inputPath}:`, error);
    throw error;
  }
}

/**
 * Check if a file is a tileset
 */
function isTileset(relativePath: string): boolean {
  const lowerPath = relativePath.toLowerCase();
  return (
    (lowerPath.includes("/tilesets/") || lowerPath.startsWith("tilesets/")) &&
    lowerPath.endsWith(".png")
  );
}

/**
 * Process a tileset by splitting into tiles, removing background from each, and reassembling
 */
async function processTileset(
  inputPath: string,
  outputPath: string,
): Promise<void> {
  try {
    console.log(`    🎨 Processing tileset: ${inputPath}`);

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error("Could not get image dimensions");
    }

    // Tileset is 16x16 grid
    const gridSize = 16;
    const tileWidth = Math.floor(metadata.width / gridSize);
    const tileHeight = Math.floor(metadata.height / gridSize);

    console.log(
      `    Grid: ${gridSize}x${gridSize}, Tile size: ${tileWidth}x${tileHeight}`,
    );

    // Extract and process each tile
    const processedTiles: Buffer[] = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // Extract tile
        const left = col * tileWidth;
        const top = row * tileHeight;

        const tileBuffer = await sharp(inputPath)
          .extract({ left, top, width: tileWidth, height: tileHeight })
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });

        const { data, info } = tileBuffer;
        const pixelArray = new Uint8Array(data);

        // Remove background from this tile
        const processedPixels = await removeBackgroundFromBuffer(
          pixelArray,
          info.channels,
        );

        // Convert back to PNG buffer
        const processedTile = await sharp(processedPixels, {
          raw: {
            width: info.width,
            height: info.height,
            channels: info.channels as 3 | 4,
          },
        })
          .png()
          .toBuffer();

        processedTiles.push(processedTile);
      }
    }

    console.log(`    Processed ${processedTiles.length} tiles`);

    // Reassemble tiles into grid
    const compositeOps = processedTiles.map((tile, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      return {
        input: tile,
        left: col * tileWidth,
        top: row * tileHeight,
      };
    });

    // Create blank canvas and composite all tiles
    await sharp({
      create: {
        width: metadata.width,
        height: metadata.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(compositeOps)
      .png()
      .toFile(outputPath);

    console.log(`    ✓ Tileset saved with alpha channel`);
  } catch (error) {
    console.error(`Error processing tileset ${inputPath}:`, error);
    throw error;
  }
}

/**
 * Process a single asset file
 */
async function processAsset(options: ProcessOptions): Promise<void> {
  const { sourcePath, targetPath, removeBackground: shouldRemoveBg } = options;

  // Ensure target directory exists
  await mkdir(dirname(targetPath), { recursive: true });

  if (shouldRemoveBg) {
    console.log(
      `  📸 Processing with background removal: ${relative(ASSETS_DIR, sourcePath)}`,
    );
    await removeBackground(sourcePath, targetPath);
  } else {
    console.log(`  📋 Copying as-is: ${relative(ASSETS_DIR, sourcePath)}`);
    await Bun.write(targetPath, Bun.file(sourcePath));
  }
}

/**
 * Determine if a file should have its background removed
 */
function shouldRemoveBackgroundForFile(relativePath: string): boolean {
  // Remove background for:
  // - Character frames (idle.png, walk.png, etc. in actors/*/frames/)
  // - Character portraits (talking.png in actors/*/speech/)
  // Keep as-is for:
  // - Concept art (concept.png, main-cast-concept-image.jpeg, etc.)
  // - Tilesets (handled separately with per-tile processing)

  const lowerPath = relativePath.toLowerCase();

  // Tilesets are handled separately
  if (isTileset(relativePath)) {
    return false;
  }

  // Check if it's in frames or speech directory (sprites and portraits)
  if (lowerPath.includes("/frames/") || lowerPath.includes("/speech/")) {
    return true;
  }

  // Keep concept art as-is
  if (lowerPath.includes("concept")) {
    return false;
  }

  return false;
}

/**
 * Recursively scan and process all assets
 */
async function processDirectory(
  sourceDir: string,
  targetDir: string,
): Promise<void> {
  const entries = await Array.fromAsync(
    new Bun.Glob("**/*").scan({ cwd: sourceDir, onlyFiles: false }),
  );

  for (const entry of entries) {
    const sourcePath = join(sourceDir, entry);
    const targetPath = join(targetDir, entry);

    // Check if it's a file
    const file = Bun.file(sourcePath);
    const exists = await file.exists();

    if (!exists) {
      // It's a directory, ensure it exists in target
      await mkdir(targetPath, { recursive: true });
      continue;
    }

    // Check if it's an image file
    const imageExtensions = [".png", ".jpg", ".jpeg", ".webp"];
    const isImage = imageExtensions.some((ext) =>
      entry.toLowerCase().endsWith(ext),
    );

    if (!isImage) {
      console.log(`  ⏭️  Skipping non-image: ${entry}`);
      continue;
    }

    // Special handling for tilesets
    if (isTileset(entry)) {
      await processTileset(sourcePath, targetPath);
    } else {
      // Process the image
      await processAsset({
        sourcePath,
        targetPath,
        removeBackground: shouldRemoveBackgroundForFile(entry),
      });
    }
  }
}

/**
 * Main CLI function
 */
async function main() {
  console.log("🎨 Asset Copier Tool\n");
  console.log(`📁 Source: ${ASSETS_DIR}`);
  console.log(`📁 Target: ${TARGET_DIR}\n`);

  try {
    // Check if source directory exists
    try {
      const sourceStat = await stat(ASSETS_DIR);
      if (!sourceStat.isDirectory()) {
        console.error(`❌ Source path is not a directory: ${ASSETS_DIR}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Source directory not found: ${ASSETS_DIR}`);
      process.exit(1);
    }

    // Create target directory if it doesn't exist
    await mkdir(TARGET_DIR, { recursive: true });

    // Process all assets
    console.log("🔄 Processing assets...\n");
    await processDirectory(ASSETS_DIR, TARGET_DIR);

    console.log("\n✅ Asset preparation complete!");
  } catch (error) {
    console.error("\n❌ Error preparing assets:", error);
    process.exit(1);
  }
}

// Run the CLI
main();
