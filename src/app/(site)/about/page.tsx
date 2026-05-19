import type { Metadata } from "next";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/StructuredData";
import { prisma } from "@/lib/prisma";

import { SITE_URL } from "@/lib/siteUrl";

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Becky Phillips",
  jobTitle: "Founder, Tenacity Business Growth Consultancy",
  worksFor: { "@type": "Organization", name: "Tenacity Business Growth Consultancy", url: SITE_URL },
  url: `${SITE_URL}/about`,
  nationality: "British",
};

const FALLBACK_BIO_ONE = [
  "Becky Phillips is a business studies graduate and three-time entrepreneur with over 30 years of local, national and international business management experience. She founded Tenacity Business Growth Consultancy to support small business owners and leaders who want to find clarity, build confidence and achieve real, lasting growth.",
  "Having built and sold businesses of her own — including founding ESP Recruitment in 1998 and expanding internationally — Becky understands the challenges and pressures that come with running a business. She brings a rare combination of lived experience, strategic insight and genuine empathy to every client relationship.",
];

const FALLBACK_BIO_TWO = [
  "Becky has worked with leaders and organisations across a wide range of sectors, helping them to develop their leadership capabilities, manage complex projects and navigate periods of change with confidence.",
  "She is passionate about making expert business support accessible — particularly for micro and small business owners who may feel they cannot afford or access the kind of help that larger organisations take for granted.",
  "Her approach combines relaxed professionalism, pragmatism and empathy. When she is not working with clients, Becky can usually be found walking on the Dorset coast, which is where many of her best ideas begin.",
];

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await prisma.page.findUnique({ where: { slug: "about" }, select: { metaTitle: true, metaDescription: true } });
    if (page?.metaTitle || page?.metaDescription) {
      return { title: page.metaTitle ?? "About Becky Phillips", description: page.metaDescription ?? undefined, alternates: { canonical: "/about" } };
    }
  } catch { /* fallback */ }
  return {
    title: "About Becky Phillips",
    description: "Becky Phillips, founder of Tenacity Business Growth Consultancy. A three-time entrepreneur with over 30 years of local, national and international business experience supporting small business owners and leaders.",
    alternates: { canonical: "/about" },
    openGraph: { title: "About Becky Phillips, Tenacity Business Growth Consultancy", description: "Three-time entrepreneur with 30+ years of business experience, supporting small business owners and leaders in the UK.", url: "/about" },
  };
}

export const revalidate = 60;

export default async function AboutPage() {
  let content: Record<string, unknown> = {};
  try {
    const page = await prisma.page.findUnique({
      where: { slug: "about" },
      include: { sections: { where: { type: "about_bio", enabled: true }, take: 1 } },
    });
    if (page?.sections[0]) content = page.sections[0].content as Record<string, unknown>;
  } catch { /* DB unavailable */ }

  const bioOneText = (content.bioPartOne as string) || FALLBACK_BIO_ONE.join("\n\n");
  const bioTwoText = (content.bioPartTwo as string) || FALLBACK_BIO_TWO.join("\n\n");
  const portrait = (content.portrait as string) || "/becky-coaching.jpg";
  const bioImageTwo = (content.bioImageTwo as string) || "/becky-speaking.jpg";

  const bioOneParagraphs = bioOneText.split(/\n{2,}/).filter(Boolean);
  const bioTwoParagraphs = bioTwoText.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <JsonLd data={personLd} />
      <Section tone="white" padding="sm">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-5">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={portrait}
                  alt="Becky Phillips"
                  width={720}
                  height={960}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="h-auto w-full"
                  priority
                />
              </div>
            </Reveal>
            <Reveal className="md:col-span-7" delay={0.1}>
              <h1 className="mb-6 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Becky Phillips
              </h1>
              <div className="space-y-5 text-base leading-relaxed text-ink/90 sm:text-lg">
                {bioOneParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="brand" padding="lg" className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl" />
        <Container className="relative">
          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-7">
              <div className="space-y-5 text-base leading-relaxed sm:text-lg [&_p]:text-white/80">
                {bioTwoParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <ButtonLink href="/services" variant="outline" size="lg" className="border-white/50 text-white hover:border-white hover:bg-white hover:text-brand-ink">
                  How we help
                </ButtonLink>
                <ButtonLink href="/contact" size="lg" className="bg-white text-brand-ink hover:bg-accent hover:text-ink">
                  Book a call
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal className="md:col-span-5" delay={0.1}>
              <div className="rounded-lg">
                <Image
                  src={bioImageTwo}
                  alt="Becky Phillips"
                  width={940}
                  height={1080}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="h-auto w-full rounded-lg"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
