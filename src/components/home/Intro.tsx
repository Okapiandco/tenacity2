"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

type IntroProps = {
  paragraph?: string;
  photoBottom?: string | null;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Intro({ paragraph, photoBottom }: IntroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y2 = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  if (!paragraph) return null;
  const paragraphs = paragraph.split(/\n{2,}/).filter(Boolean);

  return (
    <Section tone="surface" padding="lg" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] rounded-full bg-accent/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 h-[420px] w-[420px] rounded-full bg-brand/40 blur-3xl"
      />

      <Container className="relative">
        <div
          ref={ref}
          className="grid gap-12 md:grid-cols-12 md:gap-16 md:items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
            className="order-2 space-y-5 text-base leading-relaxed text-ink/85 sm:text-lg text-pretty md:order-1 md:col-span-7"
          >
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="relative order-1 md:order-2 md:col-span-5"
          >
            <motion.div
              style={{ y: y2 }}
              className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-[0_30px_80px_-40px_rgba(17,24,39,0.4)]"
            >
              <Image
                src={photoBottom ?? "/Picture4.jpg"}
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
