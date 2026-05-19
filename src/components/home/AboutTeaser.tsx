"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

type AboutTeaserProps = {
  shortBio?: string | null;
  image?: string | null;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function AboutTeaser({ shortBio, image }: AboutTeaserProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  if (!shortBio) return null;

  const paragraphs = shortBio.split(/\n{2,}/).filter(Boolean);

  return (
    <Section tone="brand" padding="lg" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl" />
      <Container className="relative">
        <div
          ref={ref}
          className="grid gap-12 md:grid-cols-12 md:gap-16 md:items-center"
        >
          <div className="order-2 md:order-1 md:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/60"
            >
              <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
              <span>02 &mdash; The Founder</span>
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
              className="mt-6 text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-white text-balance"
            >
              Meet Becky
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
              className="mt-8 space-y-5 text-base leading-relaxed text-white/80 sm:text-lg text-pretty"
            >
              {paragraphs.slice(0, 2).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease, delay: 0.3 }}
              className="mt-10"
            >
              <ButtonLink
                href="/about"
                variant="outline"
                className="group gap-2 border-white/50 text-white hover:border-white hover:bg-white hover:text-brand-ink"
              >
                More about Becky
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </ButtonLink>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="relative order-1 md:order-2 md:col-span-5"
          >
            <motion.div
              style={{ y }}
              className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-[0_30px_80px_-40px_rgba(17,24,39,0.4)]"
            >
              <Image
                src={image ?? "/IMG_4338.JPG"}
                alt="Becky Phillips, founder of Tenacity Business Growth Consultancy"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
