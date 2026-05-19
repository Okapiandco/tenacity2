import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Dot } from "@/components/ui/Dot";
import { Section } from "@/components/ui/Section";
import { ServiceCardGrid, type ServiceSummary } from "@/components/services/ServiceCardGrid";

const FALLBACK: ServiceSummary[] = [
  { _id: "1", title: "Coaching", slug: "coaching", icon: "users", shortDescription: "One-to-one coaching to help you gain clarity, build confidence and move forward." },
  { _id: "2", title: "Consultancy", slug: "consultancy", icon: "briefcase", shortDescription: "Expert guidance to help your business grow with purpose and direction." },
  { _id: "3", title: "Leadership Development", slug: "leadership-development", icon: "compass", shortDescription: "Develop the leadership skills and mindset to inspire and lead effectively." },
  { _id: "4", title: "Project Management", slug: "project-management", icon: "clipboard-check", shortDescription: "Practical support to plan, manage and deliver your projects on time." },
  { _id: "5", title: "Facilitation", slug: "facilitation", icon: "handshake", shortDescription: "Skilled facilitation for workshops, team days and strategic planning sessions." },
];

export const metadata: Metadata = {
  title: "Services",
  description: "Coaching, consultancy, leadership and team development, project management, facilitation and mediation for UK small business owners and leaders.",
  alternates: { canonical: "/services" },
};

export const revalidate = 60;

export default async function ServicesPage() {
  let services: ServiceSummary[] = FALLBACK;
  try {
    const rows = await prisma.service.findMany({ orderBy: { order: "asc" } });
    if (rows.length > 0) {
      services = rows.map((s) => ({ _id: s.id, title: s.title, slug: s.slug, icon: s.icon, shortDescription: s.shortDescription }));
    }
  } catch { /* DB not yet migrated */ }

  return (
    <>
      <Section tone="white" padding="lg">
        <Container>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-ink">
            <Dot />
            Support &amp; Solutions
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Let&rsquo;s Get to Work
          </h1>
        </Container>
      </Section>
      <Section tone="surface" padding="md">
        <Container>
          <ServiceCardGrid services={services} columns="three" />
        </Container>
      </Section>
    </>
  );
}
