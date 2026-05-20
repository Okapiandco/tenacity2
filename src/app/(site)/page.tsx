import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { ServiceCards } from "@/components/home/ServiceCards";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { CtaBand } from "@/components/home/CtaBand";
import type { ServiceSummary } from "@/components/services/ServiceCardGrid";

import { SITE_URL } from "@/lib/siteUrl";

function resolveOgImage(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("http")) return src;
  return `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: "home" },
      select: { metaTitle: true, metaDescription: true, sections: { where: { type: "hero", enabled: true }, take: 1, select: { content: true } } },
    });
    const heroContent = (page?.sections[0]?.content ?? {}) as Record<string, string>;
    const ogImage = resolveOgImage(heroContent.backgroundImage);
    const title = page?.metaTitle ?? "Tenacity Business Growth Consultancy | Coaching & Business Consultancy";
    const description = page?.metaDescription ?? "Tenacity helps UK small business owners and leaders find clarity, confidence and direction through coaching, consultancy, leadership development, project management and facilitation.";
    return {
      title: { absolute: title },
      description,
      alternates: { canonical: "/" },
      openGraph: {
        title: page?.metaTitle ?? "Tenacity Business Growth Consultancy",
        description,
        url: "/",
        ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 800, alt: "Tenacity Business Growth Consultancy" }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        ...(ogImage ? { images: [ogImage] } : {}),
      },
    };
  } catch { /* fallback */ }
  return {
    title: { absolute: "Tenacity Business Growth Consultancy | Coaching & Business Consultancy" },
    description: "Tenacity helps UK small business owners and leaders find clarity, confidence and direction through coaching, consultancy, leadership development, project management and facilitation.",
    alternates: { canonical: "/" },
    openGraph: { title: "Tenacity Business Growth Consultancy", description: "Coaching, consultancy and leadership support for UK small business owners and individuals — led by Becky Phillips.", url: "/" },
  };
}

export const revalidate = 60;

async function getHomeData() {
  const [page, services] = await Promise.all([
    prisma.page.findUnique({
      where: { slug: "home" },
      include: { sections: { where: { enabled: true }, orderBy: { order: "asc" } } },
    }),
    prisma.service.findMany({ where: { hidden: false }, orderBy: { order: "asc" } }),
  ]);
  return { page, services };
}

function sectionContent(sections: { type: string; content: unknown }[], type: string) {
  return (sections.find((s) => s.type === type)?.content ?? {}) as Record<string, string>;
}

export default async function HomePage() {
  let page: Awaited<ReturnType<typeof getHomeData>>["page"] = null;
  let services: Awaited<ReturnType<typeof getHomeData>>["services"] = [];

  try {
    ({ page, services } = await getHomeData());
  } catch {
    // DB not yet configured — fall through to static fallback below
  }

  const sections = page?.sections ?? [];
  const hero = sectionContent(sections, "hero");
  const intro = sectionContent(sections, "intro");
  const aboutTeaser = sectionContent(sections, "about_teaser");
  const ctaBand = sectionContent(sections, "cta_band");

  const serviceSummaries: ServiceSummary[] = services.map((s) => ({
    _id: s.id,
    title: s.title,
    slug: s.slug,
    icon: s.icon,
    shortDescription: s.shortDescription,
  }));

  // Fallback values when DB is empty or not yet migrated
  const heroHeadline = hero.headline || "Supporting UK small business owners and leaders";
  const introText = intro.paragraph || "At Tenacity, we believe every small business owner deserves expert support.\n\nWe are here to help you move forward with clarity and confidence.";
  const shortBio = aboutTeaser.shortBio || "Becky Phillips is a three-time entrepreneur with over 30 years of business experience.\n\nShe founded Tenacity to help people find clarity, confidence and direction.";
  const quote = ctaBand.quote || "The best investment you can make is in yourself and your business.";

  const fallbackServices: ServiceSummary[] = [
    { _id: "1", title: "Coaching", slug: "coaching", icon: "users", shortDescription: "One-to-one coaching to help you gain clarity, build confidence and move forward." },
    { _id: "2", title: "Consultancy", slug: "consultancy", icon: "briefcase", shortDescription: "Expert guidance to help your business grow with purpose and direction." },
    { _id: "4", title: "Project Management", slug: "project-management", icon: "clipboard-check", shortDescription: "Practical support to plan, manage and deliver your projects on time." },
    { _id: "5", title: "Facilitation", slug: "facilitation", icon: "handshake", shortDescription: "Skilled facilitation for workshops, team days and strategic planning sessions." },
  ];

  return (
    <>
      <Hero
        definition={hero.definition}
        headline={heroHeadline}
        subhead={hero.subhead}
        backgroundImage={hero.backgroundImage || undefined}
        primaryCtaLabel={hero.primaryCtaLabel || "Work with us"}
        primaryCtaHref={hero.primaryCtaHref || "/contact"}
        secondaryCtaLabel={hero.secondaryCtaLabel || "Our services"}
        secondaryCtaHref={hero.secondaryCtaHref || "/services"}
      />
      <Intro
        paragraph={introText}
        photoBottom={intro.photoBottom || undefined}
      />
      <ServiceCards services={serviceSummaries.length > 0 ? serviceSummaries : fallbackServices} />
      <AboutTeaser shortBio={shortBio} image={aboutTeaser.image || undefined} />
      <CtaBand quote={quote} />
    </>
  );
}
