import { cn } from "@/lib/cn";

type DotProps = {
  className?: string;
};

export function Dot({ className }: DotProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block h-2 w-2 rounded-full bg-accent", className)}
    />
  );
}
