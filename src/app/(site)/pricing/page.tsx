import type { Metadata } from "next";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Dot } from "@/components/ui/Dot";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const PRICING_BODY = [
  "At Tenacity, we believe expert business support should be accessible — not just for large organisations with big budgets, but for the micro and small businesses that make up the backbone of the UK economy.",
  "That is why we offer fair, flexible pricing tailored to your specific needs and circumstances. We do not believe in one-size-fits-all packages — instead, we take the time to understand what you need and provide a clear, transparent proposal.",
  "To find out more and get a tailored quote, simply get in touch for an initial conversation. There is no obligation, and the first call is always free.",
];

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

export default function PricingPage() {
  return (
    <Section tone="white" padding="lg">
      <Container>
        <div className="grid gap-10 md:grid-cols-12 md:items-start md:gap-16">
          <div className="md:col-span-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-ink">
              <Dot />
              Pricing
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Fair, accessible support<span className="text-accent">.</span>
            </h1>
          </div>

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
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/80 sm:text-lg">
              {PRICING_BODY.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8">
              <ButtonLink href="/contact" size="lg">
                Get in touch
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
