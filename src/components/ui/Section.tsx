import type { ElementType, HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type SectionProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  tone?: "white" | "surface" | "brand";
  padding?: "sm" | "md" | "lg";
};

const toneClass = {
  white: "bg-white",
  surface: "bg-surface",
  brand: "bg-brand-ink text-white",
} as const;

const paddingClass = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-20 lg:py-24",
  lg: "py-20 sm:py-28 lg:py-32",
} as const;

export function Section({
  as: Tag = "section",
  tone = "white",
  padding = "md",
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <Tag
      className={cn(toneClass[tone], paddingClass[padding], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
