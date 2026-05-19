import type { Metadata } from "next";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Dot } from "@/components/ui/Dot";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await prisma.page.findUnique({ where: { slug: "pricing" }, select: { metaTitle: true, metaDescription: true } });
    if (page?.metaTitle || page?.metaDescription) {
      return { title: page.metaTitle ?? "Pricing", description: page.metaDescription ?? undefined, alternates: { canonical: "/pricing" } };
    }
  } catch { /* fallback */ }
  return {
    title: "Pricing",
    description: "Fair, accessible pricing for micro and small business owners. Enquire for a tailored proposal and quote.",
    alternates: { canonical: "/pricing" },
    openGraph: { title: "Pricing, Tenacity Business Growth Consultancy", description: "Fair, accessible pricing for micro and small business owners. Enquire for a tailored proposal and quote.", url: "/pricing" },
  };
}

export const revalidate = 60;

export default async function PricingPage() {
  let content: Record<string, unknown> = {};
  try {
    const page = await prisma.page.findUnique({
      where: { slug: "pricing" },
      include: { sections: { where: { type: "pricing_content", enabled: true }, take: 1 } },
    });
    if (page?.sections[0]) content = page.sections[0].content as Record<string, unknown>;
  } catch { /* DB unavailable */ }

  const heading = (content.heading as string) || "Pricing to Match Your Budget and Ambition";
  const introText = (content.introText as string) || "Our pricing has been carefully thought through to be fair and accessible - so we can work with the clients we really want to - individuals, micro-business owners and SME's. We don't believe in putting up barriers that stop many people and small business owners accessing the support they need to move forward.\n\nOur services are delivered at a fair price but with no compromise to the scope, quality and professionalism.\n\nWe offer a tiered policy for:";
  const body = (content.body as string) || "Individuals & Freelancers\n\nMicro-business Owners\n\nSME Leaders\n\nCharities";
  const closingText = (content.closingText as string) || "We'd love to find out more about you and how we can help. Please do get in touch to arrange a call so that we can send over a proposal and price.";
  const ctaLabel = (content.ctaLabel as string) || "Enquire about pricing";
  const ctaHref = (content.ctaHref as string) || "/contact";
  const heroImage = (content.heroImage as string) || "/Picture2.jpg";

  const introParagraphs = introText.split(/\n{2,}/).filter(Boolean);
  const bulletPoints = body.split(/\n{2,}/).filter(Boolean);

  return (
    <Section tone="white" padding="lg">
      <Container>
        <div className="grid gap-10 md:grid-cols-12 md:items-start md:gap-16">
          <Reveal className="md:col-span-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-ink">
              <Dot />
              Pricing
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {heading}
            </h1>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/80 sm:text-lg">
              {introParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <ul className="mt-6 space-y-4">
              {bulletPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-base leading-relaxed text-ink/80 sm:text-lg">
                  <span className="mt-[0.35em] flex h-3 w-3 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="md:col-span-7" delay={0.1}>
            {heroImage && (
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={heroImage}
                  alt="Becky Phillips"
                  width={720}
                  height={960}
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="h-auto w-full"
                  priority
                />
              </div>
            )}
            {closingText && (
              <p className="mt-8 text-base leading-relaxed text-ink/80 sm:text-lg">{closingText}</p>
            )}
            <div className="mt-6">
              <ButtonLink href={ctaHref} size="lg">
                {ctaLabel}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
