import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7694b6" },
    { media: "(prefers-color-scheme: dark)", color: "#2D3A30" },
  ],
};
