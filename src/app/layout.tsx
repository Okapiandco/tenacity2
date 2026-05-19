import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/lib/live";
import { JsonLd } from "@/components/seo/StructuredData";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tenacity.co.uk";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tenacity Business Growth Consultancy",
    template: "%s, Tenacity Business Growth Consultancy",
  },
  description:
    "Business growth consultancy supporting small business owners and leaders with coaching, consultancy, leadership development, project management and facilitation.",
  openGraph: {
    type: "website",
    siteName: "Tenacity Business Growth Consultancy",
    locale: "en_GB",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tenacity Business Growth Consultancy",
  url: SITE_URL,
  logo: `${SITE_URL}/tenacity-logo.png`,
  founder: {
    "@type": "Person",
    name: "Becky Phillips",
    jobTitle: "Founder",
  },
  areaServed: "United Kingdom",
  email: "becky@tenacity.co.uk",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();
  return (
    <html lang="en-GB" className={montserrat.variable}>
      <body className="min-h-dvh bg-white text-muted">
        {children}
        <JsonLd data={organizationLd} />
        <SanityLive />
        {isDraftMode ? <VisualEditing /> : null}
      </body>
    </html>
  );
}
