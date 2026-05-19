import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

export type ServiceSummary = {
  _id: string;
  title: string;
  slug: string;
  icon?: string | null;
  shortDescription?: string | null;
};

type ServiceCardGridProps = {
  services: ServiceSummary[];
  columns?: "five" | "three";
  className?: string;
};

const palette = [
  {
    card: "bg-brand-ink",
    title: "text-white",
    desc: "text-white/70",
    link: "text-accent",
    glow: "group-hover:bg-accent/20",
    border: "",
  },
  {
    card: "bg-white border border-border",
    title: "text-ink",
    desc: "text-muted",
    link: "text-brand-ink",
    glow: "group-hover:bg-accent/25",
    border: "hover:border-brand-ink/40",
  },
  {
    card: "bg-accent/30",
    title: "text-ink",
    desc: "text-ink/70",
    link: "text-brand-ink",
    glow: "group-hover:bg-brand/20",
    border: "hover:border-brand-ink/30",
  },
] as const;

export function ServiceCardGrid({
  services,
  columns = "five",
  className,
}: ServiceCardGridProps) {
  if (services.length === 0) return null;
  const gridClass =
    columns === "five"
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";
  return (
    <ul className={cn(gridClass, className)}>
      {services.map((s, i) => {
        const p = palette[i % palette.length];
        return (
          <Reveal as="li" key={s._id} delay={i * 0.06}>
            <Link
              href={`/services/${s.slug}`}
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-lg p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(90,110,140,0.35)]",
                p.card,
                p.border,
              )}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-white/40 to-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-transparent transition-colors duration-500",
                  p.glow,
                )}
              />

              <h3 className={cn("relative text-lg font-semibold leading-tight", p.title)}>
                {s.title}
              </h3>

              {s.shortDescription ? (
                <p className={cn("relative mt-2 text-sm leading-relaxed", p.desc)}>
                  {s.shortDescription}
                </p>
              ) : null}

              <div className={cn("relative mt-auto flex items-center gap-2 pt-6 text-sm font-medium", p.link)}>
                <span>Learn more</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </div>
            </Link>
          </Reveal>
        );
      })}
    </ul>
  );
}
