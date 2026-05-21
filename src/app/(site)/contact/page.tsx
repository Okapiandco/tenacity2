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
                <a
                  href="https://wa.me/447348948539"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-3 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                >
                  <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp us
                </a>
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
