import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PROJECT_ID = process.env.SANITY_PROJECT_ID!;
const DATASET = process.env.SANITY_DATASET!;
const TOKEN = process.env.SANITY_READ_TOKEN!;

function imageUrl(field: Record<string,unknown> | null | undefined): string {
  if (!field?.asset) return "";
  const ref = (field.asset as Record<string,string>)._ref ?? "";
  const withoutPrefix = ref.replace(/^image-/, "");
  const lastDash = withoutPrefix.lastIndexOf("-");
  const filename = withoutPrefix.substring(0, lastDash) + "." + withoutPrefix.substring(lastDash + 1);
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${filename}`;
}

function blocksToText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b: Record<string,unknown>) => b._type === "block")
    .map((b: Record<string,unknown>) =>
      ((b.children as Record<string,string>[]) ?? [])
        .filter(c => c._type === "span")
        .map(c => c.text)
        .join("")
    )
    .join("\n\n");
}

async function sanityFetch<T>(query: string): Promise<T> {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status} ${await res.text()}`);
  const json = await res.json() as { result: T };
  return json.result;
}

async function main() {
  console.log("Fetching from Sanity...");
  const [homepage, aboutPage, pricingPage, contactPage, services, testimonials, siteSettings] = await Promise.all([
    sanityFetch<Record<string,unknown>>("*[_id == 'homepage'][0]"),
    sanityFetch<Record<string,unknown>>("*[_id == 'aboutPage'][0]"),
    sanityFetch<Record<string,unknown>>("*[_id == 'pricingPage'][0]"),
    sanityFetch<Record<string,unknown>>("*[_id == 'contactPage'][0]"),
    sanityFetch<Record<string,unknown>[]>("*[_type == 'service'] | order(order asc)"),
    sanityFetch<Record<string,unknown>[]>("*[_type == 'testimonial']"),
    sanityFetch<Record<string,unknown>>("*[_id == 'siteSettings'][0]"),
  ]);
  console.log("Fetched. Updating database...");

  // Site settings
  if (siteSettings) {
    const socials = (siteSettings.socials as Record<string,string>[] | null) ?? [];
    await prisma.siteSettings.upsert({
      where: { id: "settings" },
      create: { id: "settings", title: (siteSettings.title as string) ?? "Tenacity Business Growth Consultancy", contactEmail: (siteSettings.contactEmail as string) ?? "becky@tenacity.co.uk", contactPhone: (siteSettings.contactPhone as string) ?? null, footerText: (siteSettings.footerText as string) ?? null },
      update: { title: (siteSettings.title as string) ?? "Tenacity Business Growth Consultancy", contactEmail: (siteSettings.contactEmail as string) ?? "becky@tenacity.co.uk", contactPhone: (siteSettings.contactPhone as string) ?? null, footerText: (siteSettings.footerText as string) ?? null },
    });
    await prisma.socialLink.deleteMany({ where: { siteSettingsId: "settings" } });
    for (let i = 0; i < socials.length; i++) {
      const s = socials[i];
      await prisma.socialLink.create({ data: { siteSettingsId: "settings", icon: s.platform ?? s.icon ?? "linkedin", url: s.url ?? "", order: i } });
    }
    console.log("Settings updated");
  }

  // Home sections
  const homePageDb = await prisma.page.findUnique({ where: { slug: "home" }, include: { sections: { orderBy: { order: "asc" } } } });
  if (homePageDb && homepage) {
    const section = (type: string) => homePageDb.sections.find(s => s.type === type);
    const hero = section("hero");
    if (hero) await prisma.section.update({ where: { id: hero.id }, data: { content: { definition: (homepage.heroDefinition as string) ?? "", headline: (homepage.heroHeadline as string) ?? "", subhead: (homepage.heroSubhead as string) ?? "", backgroundImage: imageUrl(homepage.heroImage as Record<string,unknown>), backgroundImageAlt: ((homepage.heroImage as Record<string,unknown>)?.alt as string) ?? "", primaryCtaLabel: (homepage.primaryCtaLabel as string) ?? "Work with us", primaryCtaHref: (homepage.primaryCtaHref as string) ?? "/contact", secondaryCtaLabel: (homepage.secondaryCtaLabel as string) ?? "Our services", secondaryCtaHref: (homepage.secondaryCtaHref as string) ?? "/services" } } });
    const intro = section("intro");
    if (intro) await prisma.section.update({ where: { id: intro.id }, data: { content: { paragraph: (homepage.introParagraph as string) ?? "", photoBottom: imageUrl(homepage.introPhotoTwo as Record<string,unknown>), photoBottomAlt: ((homepage.introPhotoTwo as Record<string,unknown>)?.alt as string) ?? "" } } });
    const teaser = section("about_teaser");
    if (teaser) {
      const shortBio = Array.isArray(aboutPage?.shortBio) ? blocksToText(aboutPage.shortBio) : (aboutPage?.shortBio as string) ?? "";
      await prisma.section.update({ where: { id: teaser.id }, data: { content: { shortBio, image: imageUrl(homepage.aboutTeaserImage as Record<string,unknown>), imageAlt: ((homepage.aboutTeaserImage as Record<string,unknown>)?.alt as string) ?? "" } } });
    }
    const cta = section("cta_band");
    if (cta) await prisma.section.update({ where: { id: cta.id }, data: { content: { quote: (homepage.ctaBandQuote as string) ?? "" } } });
    console.log("Home sections updated");
  }

  // About sections (hero + bio)
  const aboutPageDb = await prisma.page.findUnique({ where: { slug: "about" }, include: { sections: { orderBy: { order: "asc" } } } });
  if (aboutPageDb && aboutPage) {
    const hero = aboutPageDb.sections.find(s => s.type === "hero");
    if (hero) await prisma.section.update({ where: { id: hero.id }, data: { content: { headline: "Becky Phillips", backgroundImage: imageUrl(aboutPage.portrait as Record<string,unknown>), backgroundImageAlt: ((aboutPage.portrait as Record<string,unknown>)?.alt as string) ?? "Becky Phillips" } } });

    // Upsert about_bio section
    const existingBio = aboutPageDb.sections.find(s => s.type === "about_bio");
    const bioContent = {
      bioPartOne: Array.isArray(aboutPage.bioPartOne) ? blocksToText(aboutPage.bioPartOne) : (aboutPage.bioPartOne as string) ?? "",
      bioPartTwo: Array.isArray(aboutPage.bioPartTwo) ? blocksToText(aboutPage.bioPartTwo) : (aboutPage.bioPartTwo as string) ?? "",
      portrait: imageUrl(aboutPage.portrait as Record<string,unknown>),
      bioImageTwo: imageUrl(aboutPage.bioImageTwo as Record<string,unknown>),
    };
    if (existingBio) {
      await prisma.section.update({ where: { id: existingBio.id }, data: { content: bioContent } });
    } else {
      await prisma.section.create({ data: { pageId: aboutPageDb.id, type: "about_bio", order: 1, enabled: true, content: bioContent } });
    }
    console.log("About sections updated");
  }

  // Pricing sections
  const pricingPageDb = await prisma.page.findUnique({ where: { slug: "pricing" }, include: { sections: true } });
  if (pricingPageDb && pricingPage) {
    await prisma.section.deleteMany({ where: { pageId: pricingPageDb.id } });
    await prisma.section.create({ data: { pageId: pricingPageDb.id, type: "pricing_content", order: 0, enabled: true, content: { heading: (pricingPage.heading as string) ?? "", body: Array.isArray(pricingPage.body) ? blocksToText(pricingPage.body) : (pricingPage.body as string) ?? "", ctaLabel: (pricingPage.ctaLabel as string) ?? "", ctaHref: (pricingPage.ctaHref as string) ?? "/contact", heroImage: imageUrl(pricingPage.heroImage as Record<string,unknown>) } } });
    console.log("Pricing sections updated");
  }

  // Contact sections
  const contactPageDb = await prisma.page.findUnique({ where: { slug: "contact" }, include: { sections: true } });
  if (contactPageDb && contactPage) {
    await prisma.section.deleteMany({ where: { pageId: contactPageDb.id } });
    await prisma.section.create({ data: { pageId: contactPageDb.id, type: "contact_content", order: 0, enabled: true, content: { introCopy: Array.isArray(contactPage.introCopy) ? blocksToText(contactPage.introCopy) : (contactPage.introCopy as string) ?? "", heroImage: imageUrl(contactPage.heroImage as Record<string,unknown>) } } });
    console.log("Contact sections updated");
  }

  // Services — clear first to avoid duplicates from slug renames
  await prisma.service.deleteMany();
  for (const svc of services ?? []) {
    const slug = ((svc.slug as Record<string,string>)?.current ?? svc.slug) as string;
    const servicesList = ((svc.servicesList as Record<string,unknown>[]) ?? []).map((item: Record<string,unknown>) => ({ label: item.label as string, description: (item.description as string) ?? "" }));
    const body = Array.isArray(svc.body) ? blocksToText(svc.body) : (svc.body as string) ?? "";
    await prisma.service.create({
      data: { slug, title: (svc.title as string) ?? "", order: (svc.order as number) ?? 0, icon: (svc.icon as string) ?? "briefcase", shortDescription: (svc.shortDescription as string) ?? "", heroImageUrl: imageUrl(svc.heroImage as Record<string,unknown>) || null, heroImageAlt: ((svc.heroImage as Record<string,unknown>)?.alt as string) ?? null, body, servicesList, ctaLabel: (svc.ctaLabel as string) ?? null, ctaHref: (svc.ctaHref as string) ?? "/contact" },
    });
  }
  console.log(`${services?.length ?? 0} services updated`);

  // Testimonials
  if (testimonials?.length) {
    await prisma.testimonial.deleteMany();
    for (const t of testimonials) {
      await prisma.testimonial.create({ data: { quote: (t.quote as string) ?? "", name: (t.name as string) ?? "", role: (t.role as string) ?? null, company: (t.company as string) ?? null, photoUrl: imageUrl(t.photo as Record<string,unknown>) || null, featured: (t.featured as boolean) ?? false } });
    }
    console.log(`${testimonials.length} testimonials updated`);
  }

  console.log("\nMigration complete");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
