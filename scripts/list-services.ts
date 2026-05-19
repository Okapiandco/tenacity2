import dotenv from "dotenv";
import { createClient } from "next-sanity";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-02-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function run() {
  const rows = await client.fetch<
    { _id: string; title: string; slug: string; order: number }[]
  >(
    `*[_type == "service"] | order(order asc){ _id, title, "slug": slug.current, order }`,
  );
  console.table(rows);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
