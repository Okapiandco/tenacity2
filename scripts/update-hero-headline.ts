/**
 * One-shot: update the homepage hero headline in Sanity.
 * Run with: pnpm tsx scripts/update-hero-headline.ts
 */

import dotenv from "dotenv";
import { createClient } from "next-sanity";

dotenv.config({ path: ".env.local" });

const {
  NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET,
  SANITY_API_WRITE_TOKEN,
} = process.env;

if (
  !NEXT_PUBLIC_SANITY_PROJECT_ID ||
  !NEXT_PUBLIC_SANITY_DATASET ||
  !SANITY_API_WRITE_TOKEN
) {
  throw new Error("Missing Sanity env in .env.local");
}

const client = createClient({
  projectId: NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-02-01",
  token: SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const HEADLINE =
  "We help business owners and individuals identify and overcome challenges and give them the confidence and direction to move beyond them.";

async function run() {
  const res = await client
    .patch("homepage")
    .set({ heroHeadline: HEADLINE })
    .commit();
  console.log("Updated heroHeadline on", res._id, "rev", res._rev);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
