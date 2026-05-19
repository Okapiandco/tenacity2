import type { MetadataRoute } from "next";

import { client } from "@/sanity/lib/client";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tenacity.co.uk";

async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const serviceSlugs = await client
    .fetch<string[]>(`*[_type == "service"].slug.current`)
    .catch(() => [] as string[]);

  const staticPaths = ["", "/about", "/services", "/pricing", "/contact"];
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  for (const slug of serviceSlugs) {
    entries.push({
      url: `${SITE_URL}/services/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}

export default sitemap;
