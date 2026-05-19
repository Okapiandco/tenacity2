import type { Metadata } from "next";
import Image from "next/image";
import type { PortableTextBlock } from "next-sanity";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PT } from "@/components/ui/PT";
import { Reveal } from "@/components/ui/Reveal";
import {
  SanityImage,
  type SanityImageWithAlt,
} from "@/components/ui/SanityImage";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/StructuredData";
import { sanityFetch } from "@/sanity/lib/live";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tenacity.co.uk";

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Becky Phillips",
  jobTitle: "Founder, Tenacity Business Growth Consultancy",
  worksFor: {
    "@type": "Organization",
    name: "Tenacity Business Growth Consultancy",
    url: SITE_URL,
  },
  url: `${SITE_URL}/about`,
  nationality: "British",
};

type AboutData = {
  bioPartOne?: PortableTextBlock[] | null;
  bioPartTwo?: PortableTextBlock[] | null;
  portrait?: SanityImageWithAlt | null;
  bioImageTwo?: SanityImageWithAlt | null;
};

const ABOUT_QUERY = `*[_id == "aboutPage"][0]{
  bioPartOne, bioPartTwo,
  portrait, bioImageTwo
}`;

export const metadata: Metadata = {
  title: "About Becky Phillips",
  description:
    "Becky Phillips, founder of Tenacity Business Growth Consultancy. A three-time entrepreneur with over 30 years of local, national and international business experience supporting small business owners and leaders.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Becky Phillips, Tenacity Business Growth Consultancy",
    description:
      "Three-time entrepreneur with 30+ years of business experience, supporting small business owners and leaders in the UK.",
    url: "/about",
  },
};

export const revalidate = 60;

export default async function AboutPage() {
  const { data } = (await sanityFetch({ query: ABOUT_QUERY })) as {
    data: AboutData | null;
  };

  const bioPartTwoFirst = data?.bioPartTwo?.slice(0, 1) ?? [];
  const bioPartTwoRest = data?.bioPartTwo?.slice(1) ?? [];

  return (
    <>
      <JsonLd data={personLd} />
      <Section tone="white" padding="sm">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-5">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/becky-coaching.jpg"
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
              {data?.bioPartOne && data.bioPartOne.length > 0 ? (
                <PT
                  value={[...data.bioPartOne, ...bioPartTwoFirst]}
                  className="space-y-5 text-base leading-relaxed text-ink/90 sm:text-lg"
                />
              ) : null}
            </Reveal>
          </div>
        </Container>
      </Section>

      {bioPartTwoRest.length > 0 ? (
        <Section tone="brand" padding="lg" className="relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl" />
          <Container className="relative">
            <div className="grid gap-10 md:grid-cols-12 md:gap-16">
              <Reveal className="md:col-span-7">
                <PT
                  value={bioPartTwoRest}
                  className="space-y-5 text-base leading-relaxed sm:text-lg [&_p]:text-white/80 [&_strong]:text-white"
                />
                <div className="mt-10 flex flex-wrap gap-4">
                  <ButtonLink
                    href="/services"
                    variant="outline"
                    size="lg"
                    className="border-white/50 text-white hover:border-white hover:bg-white hover:text-brand-ink"
                  >
                    How we help
                  </ButtonLink>
                  <ButtonLink
                    href="/contact"
                    size="lg"
                    className="bg-white text-brand-ink hover:bg-accent hover:text-ink"
                  >
                    Book a call
                  </ButtonLink>
                </div>
              </Reveal>
              <Reveal className="md:col-span-5" delay={0.1}>
                <div className="rounded-lg">
                  <Image
                    src="/becky-speaking.jpg"
                    alt="Becky Phillips speaking"
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
      ) : null}
    </>
  );
}
