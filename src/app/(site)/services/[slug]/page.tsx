import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Dot } from "@/components/ui/Dot";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const SERVICE_HERO_FALLBACK = "/Picture7.jpg";

type ServicesListItem = { label: string; description?: string | null };

type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const services = await prisma.service.findMany({ where: { hidden: false }, select: { slug: true } });
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [
      { slug: "coaching" },
      { slug: "consultancy" },
      { slug: "project-management" },
      { slug: "facilitation" },
    ];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const svc = await prisma.service.findUnique({ where: { slug }, select: { title: true, shortDescription: true, metaTitle: true, metaDescription: true } });
    if (!svc) return { title: "Service" };
    const title = svc.metaTitle ?? svc.title;
    const description = svc.metaDescription ?? svc.shortDescription ?? `${svc.title} from Tenacity Business Growth Consultancy.`;
    return {
      title,
      description,
      alternates: { canonical: `/services/${slug}` },
      openGraph: { title: `${title}, Tenacity Business Growth Consultancy`, description, url: `/services/${slug}` },
    };
  } catch {
    return { title: "Service" };
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let service: {
    id: string; title: string; slug: string; icon: string;
    shortDescription: string; heroImageUrl: string | null;
    body: string | null; servicesList: unknown; ctaLabel: string | null; ctaHref: string | null;
    hidden: boolean;
  } | null = null;

  let others: { id: string; title: string; slug: string }[] = [];

  try {
    [service, others] = await Promise.all([
      prisma.service.findUnique({ where: { slug } }),
      prisma.service.findMany({ where: { slug: { not: slug }, hidden: false }, orderBy: { order: "asc" }, select: { id: true, title: true, slug: true } }),
    ]);
  } catch { /* DB not yet migrated — will 404 */ }

  if (!service || service.hidden) notFound();

  const bodyParagraphs = service.body?.split(/\n{2,}/).filter(Boolean) ?? [];
  const servicesList = (service.servicesList as ServicesListItem[] | null) ?? [];

  return (
    <>
      <Section tone="white" padding="lg" className="pb-10 sm:pb-14 lg:pb-16">
        <Container>
          <Link href="/services" className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted hover:text-brand-ink">
            <span aria-hidden="true">←</span>
            All support &amp; solutions
          </Link>
          <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-center md:gap-16">
            <div className="md:col-span-6">
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                {service.title}
                <Dot className="ml-1 h-[0.3em] w-[0.3em] align-baseline" />
              </h1>
              {service.shortDescription ? (
                <p className="mt-5 text-lg text-muted sm:text-xl">{service.shortDescription}</p>
              ) : null}
              {service.ctaLabel && service.ctaHref ? (
                <div className="mt-8">
                  <ButtonLink href={service.ctaHref} size="lg">{service.ctaLabel}</ButtonLink>
                </div>
              ) : null}
            </div>
            <Reveal className="md:col-span-6">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src={service.heroImageUrl ?? SERVICE_HERO_FALLBACK}
                  alt={`${service.title} — Tenacity Business Growth Consultancy`}
                  width={960}
                  height={720}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="h-auto w-full"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {bodyParagraphs.length > 0 ? (
        <Section tone="brand" padding="md" className="relative overflow-hidden pt-10 sm:pt-12 lg:pt-14">
          <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl" />
          <Container className="relative">
            <div className="grid gap-12 md:grid-cols-12 md:items-start md:gap-16">
              <div className="md:col-span-7 space-y-5 text-base leading-relaxed sm:text-lg [&_p]:text-white/80">
                {bodyParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              {servicesList.length > 0 ? (
                <aside className="md:col-span-5">
                  <div className="rounded-lg border border-border bg-white p-8 md:sticky md:top-28">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-ink">
                      Let&rsquo;s get to Work…
                    </p>
                    <ul className="mt-6 space-y-5">
                      {servicesList.map((item, i) => (
                        <li key={i}>
                          <p className="text-sm font-semibold text-ink">{item.label}</p>
                          {item.description ? <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              ) : null}
            </div>
          </Container>
        </Section>
      ) : null}

      {others.length > 0 ? (
        <Section tone="white" padding="md">
          <Container>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-ink">
              <Dot />
              Other support &amp; solutions
            </p>
            <ul className="mt-6 flex flex-wrap justify-center gap-4">
              {others.map((o) => (
                <li key={o.id} className="flex w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]">
                  <Link href={`/services/${o.slug}`} className="group flex w-full items-center rounded-md border border-brand-ink/20 bg-brand-ink/10 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:shadow-md">
                    <span className="text-sm font-medium text-brand-ink transition-colors duration-300 group-hover:text-ink">{o.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
