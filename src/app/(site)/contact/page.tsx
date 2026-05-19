import type { Metadata } from "next";
import Image from "next/image";

import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await prisma.page.findUnique({ where: { slug: "contact" }, select: { metaTitle: true, metaDescription: true } });
    if (page?.metaTitle || page?.metaDescription) {
      return { title: page.metaTitle ?? "Contact", description: page.metaDescription ?? undefined, alternates: { canonical: "/contact" } };
    }
  } catch { /* fallback */ }
  return {
    title: "Contact",
    description: "Get in touch with Tenacity Business Growth Consultancy to arrange an introductory call with Becky Phillips.",
    alternates: { canonical: "/contact" },
    openGraph: { title: "Contact, Tenacity Business Growth Consultancy", description: "Drop us a note to arrange an introductory call with Becky Phillips.", url: "/contact" },
  };
}

export const revalidate = 60;

export default async function ContactPage() {
  let content: Record<string, unknown> = {};
  try {
    const page = await prisma.page.findUnique({
      where: { slug: "contact" },
      include: { sections: { where: { type: "contact_content", enabled: true }, take: 1 } },
    });
    if (page?.sections[0]) content = page.sections[0].content as Record<string, unknown>;
  } catch { /* DB unavailable */ }

  const introCopy = (content.introCopy as string) || "We would love to hear from you. Whether you are ready to get started or just want to find out more, drop us a message and we will be in touch within one working day.\n\nThe first conversation is always free and there is absolutely no obligation.";
  const heroImage = (content.heroImage as string) || "/IMG_4354.JPG";

  const paragraphs = introCopy.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <Section tone="white" padding="md">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <Reveal>
                <div className="space-y-5 text-base leading-relaxed sm:text-lg">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </Reveal>
              {heroImage && (
                <Reveal delay={0.1}>
                  <div className="mt-8 overflow-hidden rounded-lg">
                    <Image
                      src={heroImage}
                      alt="Becky Phillips"
                      width={720}
                      height={720}
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="h-auto w-full"
                    />
                  </div>
                </Reveal>
              )}
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
