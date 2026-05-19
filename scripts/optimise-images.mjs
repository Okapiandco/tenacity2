/**
 * Compresses all images in /public in-place using sharp.
 * - JPEG/JPG → 80% quality, progressive
 * - PNG       → effort 9, lossless
 * - Skips images already under 150 KB
 *
 * Run:  node scripts/optimise-images.mjs
 */

import sharp from "sharp";
import { readdirSync, statSync, renameSync, unlinkSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dir, "../public");
const SKIP_BELOW_BYTES = 150_000; // don't recompress already-small files

const EXTS = new Set([".jpg", ".jpeg", ".png"]);

const files = readdirSync(PUBLIC).filter((f) => {
  const ext = extname(f).toLowerCase();
  return EXTS.has(ext);
});

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const filePath = join(PUBLIC, file);
  const stat = statSync(filePath);
  const sizeBefore = stat.size;
  totalBefore += sizeBefore;

  if (sizeBefore < SKIP_BELOW_BYTES) {
    console.log(`  skip  ${file} (${kb(sizeBefore)} KB — already small)`);
    totalAfter += sizeBefore;
    continue;
  }

  const ext = extname(file).toLowerCase();
  const tmpPath = filePath + ".tmp";

  try {
    const img = sharp(filePath);

    if (ext === ".png") {
      await img.png({ compressionLevel: 9, effort: 10 }).toFile(tmpPath);
    } else {
      // jpeg / jpg
      await img.jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(tmpPath);
    }

    const sizeAfter = statSync(tmpPath).size;

    if (sizeAfter < sizeBefore) {
      renameSync(tmpPath, filePath);
      totalAfter += sizeAfter;
      const saved = Math.round(((sizeBefore - sizeAfter) / sizeBefore) * 100);
      console.log(`  ✓  ${file}  ${kb(sizeBefore)} KB → ${kb(sizeAfter)} KB  (${saved}% smaller)`);
    } else {
      // compressed version is larger — keep original
      renameSync(tmpPath, filePath + ".skip");
      unlinkSync(filePath + ".skip");
      totalAfter += sizeBefore;
      console.log(`  –  ${file} — compression made it larger, kept original`);
    }
  } catch (err) {
    console.error(`  ✗  ${file} — ${err.message}`);
    totalAfter += sizeBefore;
    try { unlinkSync(tmpPath); } catch {}
  }
}

console.log(`\nTotal: ${kb(totalBefore)} KB → ${kb(totalAfter)} KB  (saved ${kb(totalBefore - totalAfter)} KB / ${Math.round(((totalBefore - totalAfter) / totalBefore) * 100)}%)`);

function kb(bytes) {
  return Math.round(bytes / 1024);
}
