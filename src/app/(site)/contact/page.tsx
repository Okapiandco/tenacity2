import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";

import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { PT } from "@/components/ui/PT";
import { Reveal } from "@/components/ui/Reveal";
import {
  SanityImage,
  type SanityImageWithAlt,
} from "@/components/ui/SanityImage";
import { Section } from "@/components/ui/Section";
import { sanityFetch } from "@/sanity/lib/live";

type ContactData = {
  introCopy?: PortableTextBlock[] | null;
  heroImage?: SanityImageWithAlt | null;
};

const CONTACT_QUERY = `*[_id == "contactPage"][0]{ introCopy, heroImage }`;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Tenacity Business Growth Consultancy to arrange an introductory call with Becky Phillips.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact, Tenacity Business Growth Consultancy",
    description:
      "Drop us a note to arrange an introductory call with Becky Phillips.",
    url: "/contact",
  },
};

export const revalidate = 60;

export default async function ContactPage() {
  const { data } = (await sanityFetch({ query: CONTACT_QUERY })) as {
    data: ContactData | null;
  };

  return (
    <>
      <Section tone="white" padding="md">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              {data?.introCopy && data.introCopy.length > 0 ? (
                <Reveal>
                  <PT
                    value={data.introCopy}
                    className="text-base leading-relaxed sm:text-lg"
                  />
                </Reveal>
              ) : null}
              {data?.heroImage ? (
                <Reveal delay={0.1}>
                  <div className="mt-8 overflow-hidden rounded-lg">
                    <SanityImage
                      image={data.heroImage}
                      width={720}
                      height={720}
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="h-auto w-full"
                    />
                  </div>
                </Reveal>
              ) : null}
            </div>
            <Reveal className="md:col-span-7" delay={0.1}>
              <div className="h-full rounded-lg border border-border bg-white p-6 sm:p-8">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
