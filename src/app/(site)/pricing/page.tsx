import type { Metadata } from "next";
import Image from "next/image";
import type { PortableTextBlock } from "next-sanity";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Dot } from "@/components/ui/Dot";
import { PT } from "@/components/ui/PT";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { sanityFetch } from "@/sanity/lib/live";

type PricingData = {
  heading?: string;
  body?: PortableTextBlock[] | null;
  ctaLabel?: string;
  ctaHref?: string;
};

const PRICING_QUERY = `*[_id == "pricingPage"][0]{
  heading, body, ctaLabel, ctaHref
}`;

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Fair, accessible pricing for micro and small business owners. Enquire for a tailored proposal and quote.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing, Tenacity Business Growth Consultancy",
    description:
      "Fair, accessible pricing for micro and small business owners. Enquire for a tailored proposal and quote.",
    url: "/pricing",
  },
};

export const revalidate = 60;

export default async function PricingPage() {
  const { data } = (await sanityFetch({ query: PRICING_QUERY })) as {
    data: PricingData | null;
  };
  if (!data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-base text-muted">
          Pricing content has not been published yet. Edit it in Sanity Studio at /studio.
        </p>
      </div>
    );
  }

  return (
    <Section tone="white" padding="lg">
      <Container>
        <div className="grid gap-10 md:grid-cols-12 md:items-start md:gap-16">

          {/* Left column: label + heading */}
          <div className="md:col-span-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-ink">
              <Dot />
              Pricing
            </p>
            {data.heading ? (
              <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                {data.heading}<span className="text-accent">.</span>
              </h1>
            ) : null}
          </div>

          {/* Right column: image, then body text + CTA below it */}
          <Reveal className="md:col-span-7" delay={0.1}>
            <div className="overflow-hidden rounded-lg">
              <Image
                src="/Picture2.jpg"
                alt="Becky Phillips out in nature"
                width={720}
                height={960}
                sizes="(min-width: 768px) 55vw, 100vw"
                className="h-auto w-full"
                priority
              />
            </div>
            {data.body ? (
              <div className="mt-8">
                <PT
                  value={data.body}
                  className="text-base leading-relaxed text-ink/80 sm:text-lg"
                />
                {data.ctaLabel && data.ctaHref ? (
                  <div className="mt-8">
                    <ButtonLink href={data.ctaHref} size="lg">
                      {data.ctaLabel}
                    </ButtonLink>
                  </div>
                ) : null}
              </div>
            ) : null}
          </Reveal>

        </div>
      </Container>
    </Section>
  );
}
