/**
 * Sets the `order` field on each service document in Sanity.
 * Uses Node.js built-in fetch — no packages required.
 *
 * Run:  node scripts/set-service-order.mjs
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env.local manually
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dir, "../.env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const PROJECT_ID = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const TOKEN = env.SANITY_API_WRITE_TOKEN;
const API = `https://${PROJECT_ID}.api.sanity.io/v2026-02-01/data`;

// Desired order — matched against service title (case-insensitive substring)
const ORDER = [
  "business consultancy",
  "mentoring",
  "employability",
  "leadership",
  "facilitation",
  "project management",
];

async function query(groq) {
  const url = `${API}/query/${DATASET}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) throw new Error(`Query failed: ${res.status} ${await res.text()}`);
  return (await res.json()).result;
}

async function patch(id, order) {
  const mutations = [{ patch: { id, set: { order } } }];
  const url = `${API}/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Patch failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function run() {
  const services = await query(
    `*[_type == "service"]{ _id, title, "slug": slug.current, order }`
  );

  console.log(`Found ${services.length} service(s):\n`);
  services.forEach((s) =>
    console.log(` • [${s.order ?? "—"}] ${s.title} (${s.slug})`)
  );
  console.log("");

  for (const [idx, keyword] of ORDER.entries()) {
    const match = services.find((s) =>
      s.title.toLowerCase().includes(keyword.toLowerCase())
    );
    if (!match) {
      console.warn(`⚠  No service matched "${keyword}"`);
      continue;
    }
    await patch(match._id, idx + 1);
    console.log(` ✓ [${idx + 1}] ${match.title}`);
  }

  console.log("\nDone! Services will appear in the new order.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
