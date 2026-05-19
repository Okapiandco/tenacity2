import type { Metadata } from "next";
import { Montserrat, Inter, Playfair_Display, Lato } from "next/font/google";
import { JsonLd } from "@/components/seo/StructuredData";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tenacity.co.uk";

const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], display: "swap", weight: ["300", "400", "500", "600", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap", weight: ["400", "500", "600", "700"] });
const lato = Lato({ variable: "--font-lato", subsets: ["latin"], display: "swap", weight: ["300", "400", "700"] });

export const FONT_OPTIONS = [
  { label: "Montserrat", value: "Montserrat", var: "--font-montserrat" },
  { label: "Inter", value: "Inter", var: "--font-inter" },
  { label: "Playfair Display", value: "Playfair Display", var: "--font-playfair" },
  { label: "Lato", value: "Lato", var: "--font-lato" },
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Tenacity Business Growth Consultancy", template: "%s, Tenacity Business Growth Consultancy" },
  description: "Business growth consultancy supporting small business owners and leaders with coaching, consultancy, leadership development, project management and facilitation.",
  openGraph: { type: "website", siteName: "Tenacity Business Growth Consultancy", locale: "en_GB", url: SITE_URL },
  twitter: { card: "summary_large_image" },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tenacity Business Growth Consultancy",
  url: SITE_URL,
  logo: `${SITE_URL}/tenacity-logo.png`,
  founder: { "@type": "Person", name: "Becky Phillips", jobTitle: "Founder" },
  areaServed: "United Kingdom",
  email: "becky@tenacity.co.uk",
};

function darken(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (n >> 16) - amount);
  const g = Math.max(0, ((n >> 8) & 0xff) - amount);
  const b = Math.max(0, (n & 0xff) - amount);
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let brand: Record<string, string> = {};
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "settings" } });
    brand = (settings?.brandSettings as Record<string, string>) ?? {};
  } catch { /* DB unavailable */ }

  const primaryColor = brand.primaryColor ?? "#7694b6";
  const accentColor = brand.accentColor ?? "#ffc2c2";
  const inkColor = brand.inkColor ?? "#6b6b6b";
  const headingFontVar = FONT_OPTIONS.find(f => f.value === brand.headingFont)?.var ?? "--font-montserrat";
  const bodyFontVar = FONT_OPTIONS.find(f => f.value === brand.bodyFont)?.var ?? "--font-montserrat";

  const cssOverride = `
    :root {
      --color-brand: ${primaryColor};
      --color-brand-dark: ${darken(primaryColor, 20)};
      --color-brand-ink: ${darken(primaryColor, 40)};
      --color-accent: ${accentColor};
      --color-ink: ${inkColor};
      --font-sans: var(${bodyFontVar}), ui-sans-serif, system-ui, sans-serif;
      --font-display: var(${headingFontVar}), ui-sans-serif, system-ui, sans-serif;
    }
  `.trim();

  const fontClasses = [montserrat.variable, inter.variable, playfair.variable, lato.variable].join(" ");

  return (
    <html lang="en-GB" className={fontClasses}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssOverride }} />
      </head>
      <body className="min-h-dvh bg-white text-muted">
        {children}
        <JsonLd data={organizationLd} />
      </body>
    </html>
  );
}
