import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Dot } from "@/components/ui/Dot";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: "display" | "xl" | "lg" | "md";
  eyebrow?: string;
  className?: string;
  children: ReactNode;
  withDot?: boolean;
  tone?: "ink" | "white";
};

const sizeClass = {
  display: "text-4xl sm:text-5xl lg:text-6xl",
  xl: "text-3xl sm:text-4xl",
  lg: "text-2xl sm:text-3xl",
  md: "text-xl sm:text-2xl",
} as const;

const toneClass = {
  ink: "text-ink",
  white: "text-white",
} as const;

export function Heading({
  as: Tag = "h2",
  size = "xl",
  eyebrow,
  className,
  children,
  withDot,
  tone = "ink",
}: HeadingProps) {
  return (
    <div>
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]",
            tone === "white" ? "text-white/80" : "text-brand-ink",
          )}
        >
          <Dot
            className={cn(
              "h-2 w-2",
              tone === "white" ? "bg-white" : "bg-accent",
            )}
          />
          <span>{eyebrow}</span>
        </p>
      ) : null}
      <Tag
        className={cn(
          "font-semibold leading-tight tracking-tight",
          sizeClass[size],
          toneClass[tone],
          className,
        )}
      >
        {children}
        {withDot ? (
          <Dot className="ml-1 h-[0.35em] w-[0.35em] align-baseline" />
        ) : null}
      </Tag>
    </div>
  );
}
