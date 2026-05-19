/**
 * One-shot: reorder services and add Career & Employability Coaching.
 * Run with: pnpm tsx scripts/update-service-order.ts
 *
 * Final order:
 *   1. Coaching & Mentoring
 *   2. Business Consultancy
 *   3. Project Management
 *   4. Facilitation & Mediation
 *   5. Career & Employability Coaching (new, placeholder body)
 *   6. Leadership & Team Development (moved to bottom)
 */

import dotenv from "dotenv";
import { createClient } from "next-sanity";
import { randomUUID } from "node:crypto";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-02-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

async function run() {
  await client.patch("service.projects").set({ order: 3 }).commit();
  await client.patch("service.facilitation").set({ order: 4 }).commit();
  await client.patch("service.leadership").set({ order: 6 }).commit();

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_id == "service.career"][0]{_id}`,
  );

  if (existing) {
    await client.patch("service.career").set({ order: 5 }).commit();
    console.log("service.career already existed — order set to 5");
  } else {
    await client.create({
      _id: "service.career",
      _type: "service",
      title: "Career & Employability Coaching",
      slug: { _type: "slug", current: "career" },
      order: 5,
      icon: "compass",
      shortDescription:
        "Coaching for individuals navigating career transitions, employability skills, and finding direction in their working life.",
      body: [
        {
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: key(),
              text: "Content coming soon. Get in touch to find out how Becky can help.",
              marks: [],
            },
          ],
        },
      ],
      servicesList: [],
      ctaLabel: "Book a call",
      ctaHref: "/contact",
    });
    console.log("Created service.career");
  }

  const rows = await client.fetch<
    { title: string; order: number; slug: string }[]
  >(
    `*[_type == "service"] | order(order asc){ title, order, "slug": slug.current }`,
  );
  console.table(rows);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
