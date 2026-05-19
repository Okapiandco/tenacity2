import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "utfs.io" },
    ],
    // Serve AVIF first (smallest), fall back to WebP, then original
    formats: ["image/avif", "image/webp"],
    // Cache optimised images for 30 days
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Common breakpoints — avoids generating redundant sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
