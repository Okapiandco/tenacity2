/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/**
 * Generates favicon + Apple touch icon from the Tenacity wordmark and an OG
 * social-share image from the Jetty hero photo. Outputs go into src/app/* so
 * Next.js auto-detects them.
 *
 * Run with: pnpm tsx scripts/generate-icons.ts
 */

import sharp from "sharp";
import path from "node:path";
import { rm } from "node:fs/promises";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const APP = path.join(ROOT, "src", "app");

const LOGO = path.join(PUBLIC, "tenacity-logo.png");
const JETTY = path.join(PUBLIC, "Jetty.jpeg");

const BRAND_INK = { r: 0x4a, g: 0x6c, b: 0x92, alpha: 1 };

async function makeIcon(size: number, outPath: string) {
  const padding = Math.round(size * 0.14);
  const innerW = size - padding * 2;
  const innerH = Math.round(innerW * (392 / 1197));

  const whiteRect = await sharp({
    create: {
      width: innerW,
      height: innerH,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const logoAlpha = await sharp(LOGO)
    .resize({
      width: innerW,
      height: innerH,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  const whiteLogo = await sharp(whiteRect)
    .composite([{ input: logoAlpha, blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BRAND_INK,
    },
  })
    .composite([{ input: whiteLogo, gravity: "center" }])
    .png()
    .toFile(outPath);
  console.log(`  wrote ${path.relative(ROOT, outPath)} (${size}x${size})`);
}

async function makeOg(outPath: string) {
  const W = 1200;
  const H = 630;
  await sharp(JETTY)
    .resize({ width: W, height: H, fit: "cover", position: "centre" })
    .jpeg({ quality: 85, progressive: true, mozjpeg: true })
    .toFile(outPath);
  console.log(`  wrote ${path.relative(ROOT, outPath)} (${W}x${H})`);
}

async function run() {
  console.log("Generating icons...");
  await makeIcon(512, path.join(APP, "icon.png"));
  await makeIcon(180, path.join(APP, "apple-icon.png"));

  console.log("Generating OG image...");
  await makeOg(path.join(APP, "opengraph-image.jpg"));
  await makeOg(path.join(APP, "twitter-image.jpg"));

  console.log("Removing superseded files...");
  for (const f of ["favicon.ico", "opengraph-image.tsx"]) {
    const p = path.join(APP, f);
    await rm(p, { force: true });
    console.log(`  removed ${path.relative(ROOT, p)}`);
  }
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
