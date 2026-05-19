import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";

import { sanityFetch } from "@/sanity/lib/live";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import {
  ServiceCards,
  type ServiceSummary,
} from "@/components/home/ServiceCards";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { CtaBand } from "@/components/home/CtaBand";
import type { SanityImageWithAlt } from "@/components/ui/SanityImage";

type HomeData = {
  homepage: {
    heroDefinition?: string;
    heroHeadline: string;
    heroSubhead?: string;
    heroImage?: SanityImageWithAlt | null;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    introParagraph?: string;
    introPhotoTwo?: SanityImageWithAlt | null;
    aboutTeaserImage?: SanityImageWithAlt | null;
    ctaBandQuote?: string;
  } | null;
  services: ServiceSummary[];
  about: {
    shortBio?: PortableTextBlock[] | null;
  } | null;
};

export const metadata: Metadata = {
  title: {
    absolute: "Tenacity Business Growth Consultancy | Coaching & Business Consultancy",
  },
  description:
    "Tenacity helps UK small business owners and leaders find clarity, confidence and direction through coaching, consultancy, leadership development, project management and facilitation.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Tenacity Business Growth Consultancy",
    description:
      "Coaching, consultancy and leadership support for UK small business owners and individuals — led by Becky Phillips.",
    url: "/",
  },
};

const HOME_QUERY = `{
  "homepage": *[_id == "homepage"][0]{
    heroDefinition, heroHeadline, heroSubhead, heroImage,
    primaryCtaLabel, primaryCtaHref,
    secondaryCtaLabel, secondaryCtaHref,
    introParagraph, introPhotoTwo,
    aboutTeaserImage,
    ctaBandQuote
  },
  "services": *[_type == "service"] | order(order asc){
    _id, title, "slug": slug.current, icon, shortDescription
  },
  "about": *[_id == "aboutPage"][0]{
    shortBio
  }
}`;

export const revalidate = 60;

export default async function HomePage() {
  const { data } = (await sanityFetch({ query: HOME_QUERY })) as {
    data: HomeData;
  };
  const hp = data.homepage;

  if (!hp) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-base text-muted">
          Homepage content has not been published yet. Edit it in Sanity Studio at /studio.
        </p>
      </div>
    );
  }

  return (
    <>
      <Hero
        definition={hp.heroDefinition}
        subhead={hp.heroSubhead}
        headline={hp.heroHeadline}
        backgroundImage={hp.heroImage}
        primaryCtaLabel={hp.primaryCtaLabel}
        primaryCtaHref={hp.primaryCtaHref}
        secondaryCtaLabel={hp.secondaryCtaLabel}
        secondaryCtaHref={hp.secondaryCtaHref}
      />
      <Intro
        paragraph={hp.introParagraph}
        photoBottom={hp.introPhotoTwo}
      />
      <ServiceCards services={data.services} />
      <AboutTeaser shortBio={data.about?.shortBio} image={hp.aboutTeaserImage} />
      <CtaBand quote={hp.ctaBandQuote} />
    </>
  );
}
