"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

type CtaBandProps = {
  quote?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function CtaBand({ quote }: CtaBandProps) {
  if (!quote) return null;
  return (
    <section className="relative isolate overflow-hidden bg-brand-ink py-24 text-white sm:py-28 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
      >
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand/40 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[480px] w-[480px] rounded-full bg-accent/30 blur-3xl" />
      </div>
      <div className="grain" aria-hidden="true" />

      <Container className="relative text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-white/80"
        >
          <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
          <span>Ready when you are</span>
          <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
          className="mx-auto mt-8 max-w-4xl text-[clamp(1.75rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.01em] text-white text-balance"
        >
          <span className="display-serif text-accent">&ldquo;</span>
          {quote}
          <span className="display-serif text-accent">&rdquo;</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.25 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <ButtonLink
            href="/contact"
            size="lg"
            className="group bg-white text-brand-ink hover:bg-accent hover:text-ink"
          >
            <span>Book a call</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            />
          </ButtonLink>
          <ButtonLink
            href="/services"
            size="lg"
            variant="outline"
            className="border-white/60 text-white hover:border-white hover:bg-white/10 hover:text-white"
          >
            Explore support &amp; solutions
          </ButtonLink>
        </motion.div>
      </Container>
    </section>
  );
}
