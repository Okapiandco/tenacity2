import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-brand-ink text-white hover:bg-accent hover:text-ink",
  outline:
    "bg-brand-ink text-white border border-brand-ink hover:bg-accent hover:text-ink hover:border-accent",
} as const;

const sizes = {
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors";

export function buttonClass(opts: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return cn(
    base,
    sizes[opts.size ?? "md"],
    variants[opts.variant ?? "primary"],
    opts.className,
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClass({ variant, size, className })}>
      {children}
    </Link>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ variant, size, className, type, ...rest }: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={buttonClass({ variant, size, className })}
      {...rest}
    />
  );
}
