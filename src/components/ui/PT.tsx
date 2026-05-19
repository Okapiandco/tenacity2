import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";

import { cn } from "@/lib/cn";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-semibold tracking-tight text-ink">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-ink">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-base leading-relaxed text-ink/90">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="brand-bullets space-y-2 text-base leading-relaxed text-ink/90">
        {children}
      </ul>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

type Props = {
  value: PortableTextBlock[] | null | undefined;
  className?: string;
};

export function PT({ value, className }: Props) {
  if (!value || value.length === 0) return null;
  return (
    <div className={cn("space-y-4", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
