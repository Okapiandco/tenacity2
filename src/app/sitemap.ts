import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

const SERVICE_SLUGS = [
  "coaching",
  "consultancy",
  "leadership-development",
  "project-management",
  "facilitation",
];

function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["", "/about", "/services", "/pricing", "/contact"];
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  for (const slug of SERVICE_SLUGS) {
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
