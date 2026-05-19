"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  ServiceCardGrid,
  type ServiceSummary,
} from "@/components/services/ServiceCardGrid";

export type { ServiceSummary };

type ServiceCardsProps = {
  services: ServiceSummary[];
};

const ease = [0.22, 1, 0.36, 1] as const;

export function ServiceCards({ services }: ServiceCardsProps) {
  if (services.length === 0) return null;
  return (
    <Section tone="white" padding="lg" className="relative">
      <Container>
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-12">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-ink"
            >
              <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
              <span>01 &mdash; Services</span>
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
              className="mt-6 text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-ink text-balance"
            >
              Let&rsquo;s Get to Work
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease, delay: 0.2 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg text-pretty"
            >
              Our support &amp; solutions represent our expertise and passion &mdash; a carefully curated offering, designed to create focus, change perceptions, increase efficiency, enable growth and support you in the pursuit of success and happiness.
            </motion.p>
          </div>

        </div>

        <ServiceCardGrid services={services} columns="three" className="mt-14" />
      </Container>
    </Section>
  );
}
