"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  SanityImage,
  type SanityImageWithAlt,
} from "@/components/ui/SanityImage";

type HeroProps = {
  definition?: string;
  subhead?: string;
  headline: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  backgroundImage?: SanityImageWithAlt | null;
};

const ease = [0.22, 1, 0.36, 1] as const;

function DictionaryEntry({ text }: { text?: string }) {
  if (!text) return null;
  const [word] = text.split(/:\s*/);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease, delay: 0.15 }}
      className="flex items-center gap-4 text-white/90"
    >
      <span className="inline-block h-px w-10 bg-accent" aria-hidden="true" />
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.32em]">
        {word}
      </span>
    </motion.div>
  );
}

export function Hero({
  definition,
  subhead,
  headline,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  backgroundImage,
}: HeroProps) {
  const words = headline.trim().split(/\s+/);

  return (
    <section
      className="relative isolate -mt-24 flex h-[800px] w-full items-end overflow-hidden bg-black pb-12 pt-28 sm:pb-16 sm:pt-32"
      aria-label="Introducing Tenacity"
    >
      <div className="absolute inset-0 [transform:scaleX(-1)]" aria-hidden="true">
        <div className="ken-burns absolute inset-0">
          {backgroundImage ? (
            <SanityImage
              image={backgroundImage}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          ) : (
            <Image
              src="/Jetty.jpeg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand-ink/40 via-transparent to-transparent"
        aria-hidden="true"
      />
      <div className="grain" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-10">
            <DictionaryEntry text={definition} />

            <h1 className="mt-4 max-w-3xl font-semibold leading-[1.15] tracking-[-0.01em] text-white text-balance">
              <span className="block text-[clamp(1.25rem,2.6vw,2rem)]">
                {words.map((w, i) => (
                  <span
                    key={i}
                    className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom last:mr-0"
                  >
                    <motion.span
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        duration: 0.7,
                        ease,
                        delay: 0.25 + i * 0.025,
                      }}
                      className="inline-block"
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </span>
            </h1>

            {subhead ? (
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease,
                  delay: 0.45 + words.length * 0.08,
                }}
                className="mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base text-pretty"
              >
                {subhead}
              </motion.p>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease,
                delay: 0.55 + words.length * 0.08,
              }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              {primaryCtaLabel && primaryCtaHref ? (
                <ButtonLink
                  href={primaryCtaHref}
                  size="lg"
                  className="group bg-white text-ink hover:bg-accent hover:text-ink"
                >
                  <span>{primaryCtaLabel}</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </ButtonLink>
              ) : null}
              {secondaryCtaLabel && secondaryCtaHref ? (
                <ButtonLink
                  href={secondaryCtaHref}
                  size="lg"
                  variant="outline"
                  className="border-white/60 text-white hover:border-white hover:bg-white/10 hover:text-white"
                >
                  {secondaryCtaLabel}
                </ButtonLink>
              ) : null}
            </motion.div>
          </div>
        </div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease, delay: 1.6 }}
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/70">
          <span>Scroll</span>
          <span className="scroll-hint relative block h-10 w-px overflow-hidden bg-white/20" />
        </div>
      </motion.div>

      <div
        className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 lg:block"
        aria-hidden="true"
      >
        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white/50 [writing-mode:vertical-rl]">
          Est. Tenacity — Business Growth
        </span>
      </div>
    </section>
  );
}
