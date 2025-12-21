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

      // Process each pixel
      for (let i = 0; i < pixelArray.length; i += info.channels) {
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

      // Save processed image
      await sharp(pixelArray, {
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
function shouldRemoveBackground(relativePath: string): boolean {
  // Remove background for:
  // - Character frames (idle.png, walk.png, etc. in actors/*/frames/)
  // - Character portraits (talking.png in actors/*/speech/)
  // Keep as-is for:
  // - Concept art (concept.png, main-cast-concept-image.jpeg, etc.)

  const lowerPath = relativePath.toLowerCase();

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

    // Process the image
    await processAsset({
      sourcePath,
      targetPath,
      removeBackground: shouldRemoveBackground(entry),
    });
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
