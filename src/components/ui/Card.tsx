import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border bg-white p-6 transition-shadow hover:shadow-md",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
