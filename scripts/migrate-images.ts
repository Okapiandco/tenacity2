/**
 * One-shot: upload current /public images to Sanity and patch them onto the
 * homepage/about/pricing/service documents so all imagery is editable in Studio.
 *
 * Run with: pnpm tsx scripts/migrate-images.ts
 *
 * Idempotent-ish: re-running re-uploads the assets and re-patches the docs.
 * Existing text/structure on the documents is preserved (we patch.set specific
 * fields rather than createOrReplace).
 */

import dotenv from "dotenv";
import { createClient } from "next-sanity";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-02-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

type ImageRef = {
  _type: "imageWithAlt";
  _key?: string;
  asset: { _type: "reference"; _ref: string };
  alt: string;
};

async function uploadImage(filename: string, alt: string): Promise<ImageRef> {
  const filePath = path.join(process.cwd(), "public", filename);
  const buf = await readFile(filePath);
  const asset = await client.assets.upload("image", buf, { filename });
  console.log(`  uploaded ${filename} -> ${asset._id}`);
  return {
    _type: "imageWithAlt",
    asset: { _type: "reference", _ref: asset._id },
    alt,
  };
}

function galleryItem(img: ImageRef): ImageRef {
  return { ...img, _key: key() };
}

async function run() {
  console.log("Uploading images to Sanity assets...");

  const jetty = await uploadImage("Jetty.jpeg", "Sunlit jetty stretching out into calm water");
  const picture2 = await uploadImage("Picture2.jpg", "Becky working in a notebook, soft natural light");
  const picture4 = await uploadImage("Picture4.jpg", "Open countryside view used as a quiet moment in the intro");
  const img4338 = await uploadImage("IMG_4338.JPG", "Becky leaning on a wooden fence beside a green field");
  const img4354 = await uploadImage("IMG_4354.JPG", "Becky standing confidently against a corrugated wall, hands on hips");
  const img4362 = await uploadImage("IMG_4362.JPG", "Becky presenting at a lectern in front of a brick wall");
  const img4300 = await uploadImage("IMG_4300.JPG", "Becky smiling while taking a phone call outside");
  const img4324 = await uploadImage("IMG_4324 (1).JPG", "Becky walking along a tree-lined avenue with a colleague");
  const sunset = await uploadImage("Sunset.jpeg", "Warm coastal sunset");
  const picture6 = await uploadImage("Picture6.jpg", "Coaching conversation in a relaxed setting");
  const picture5 = await uploadImage("Picture5.jpg", "Consultancy notes spread across a working table");
  const picture3 = await uploadImage("Picture3.jpg", "Leadership and team development working session");
  const clarity = await uploadImage("Clarity image.jpeg", "Calm seascape representing clarity");
  const beachDebris = await uploadImage("beach debris.jpeg", "Driftwood arranged on a beach representing facilitation");
  const picture7 = await uploadImage("Picture7.jpg", "Generic Tenacity working image");

  console.log("\nPatching homepage...");
  await client
    .patch("homepage")
    .set({
      heroImage: jetty,
      introPhoto: picture2,
      introPhotoTwo: picture4,
      aboutTeaserImage: img4338,
    })
    .commit();

  console.log("Patching aboutPage...");
  const aboutCurrent = await client.fetch<{
    bioPartOne?: unknown;
    bioPartTwo?: unknown;
    fullBio?: Array<Record<string, unknown>> | null;
  } | null>(
    `*[_id == "aboutPage"][0]{ bioPartOne, bioPartTwo, fullBio }`,
  );

  const bioPatch: Record<string, unknown> = {
    portrait: img4354,
    bioImageTwo: img4362,
    gallery: [
      galleryItem(img4300),
      galleryItem(img4324),
      galleryItem(img4338),
      galleryItem(img4362),
    ],
  };

  if (
    (!aboutCurrent?.bioPartOne || !aboutCurrent?.bioPartTwo) &&
    aboutCurrent?.fullBio &&
    aboutCurrent.fullBio.length >= 2
  ) {
    bioPatch.bioPartOne = [aboutCurrent.fullBio[0]];
    bioPatch.bioPartTwo = aboutCurrent.fullBio.slice(1);
    console.log(
      "  split legacy fullBio into bioPartOne (1 block) + bioPartTwo (rest)",
    );
  }

  await client.patch("aboutPage").set(bioPatch).commit();

  console.log("Patching pricingPage...");
  await client.patch("pricingPage").set({ heroImage: sunset }).commit();

  console.log("\nPatching service hero images...");
  const serviceHeroes: Record<string, ImageRef> = {
    "service.coaching": picture6,
    "service.consultancy": picture5,
    "service.leadership": picture3,
    "service.projects": clarity,
    "service.facilitation": beachDebris,
    "service.career": picture7,
  };
  for (const [id, img] of Object.entries(serviceHeroes)) {
    const exists = await client.fetch<{ _id: string } | null>(
      `*[_id == $id][0]{_id}`,
      { id },
    );
    if (!exists) {
      console.log(`  skip ${id} — document not found`);
      continue;
    }
    await client.patch(id).set({ heroImage: img }).commit();
    console.log(`  patched ${id}`);
  }

  console.log("\nMigration complete.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
