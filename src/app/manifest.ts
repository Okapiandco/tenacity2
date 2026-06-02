import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tenacity Business Growth Consultancy",
    short_name: "Tenacity",
    description: "Business growth consultancy — coaching, consultancy, project management and facilitation for UK small business owners.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7694b6",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
