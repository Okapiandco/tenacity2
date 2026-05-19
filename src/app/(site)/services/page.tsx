import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { Dot } from "@/components/ui/Dot";
import { Section } from "@/components/ui/Section";
import {
  ServiceCardGrid,
  type ServiceSummary,
} from "@/components/services/ServiceCardGrid";
import { sanityFetch } from "@/sanity/lib/live";

const SERVICES_QUERY = `*[_type == "service"] | order(order asc){
  _id, title, "slug": slug.current, icon, shortDescription
}`;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Coaching, consultancy, leadership and team development, project management, facilitation and mediation for UK small business owners and leaders.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services, Tenacity Business Growth Consultancy",
    description:
      "Coaching, consultancy, leadership development, project management and facilitation for UK small business owners and leaders.",
    url: "/services",
  },
};

export const revalidate = 60;

export default async function ServicesPage() {
  const { data: services } = (await sanityFetch({
    query: SERVICES_QUERY,
  })) as { data: ServiceSummary[] };
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
