import {
  Briefcase,
  ClipboardCheck,
  Compass,
  Handshake,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  briefcase: Briefcase,
  compass: Compass,
  "clipboard-check": ClipboardCheck,
  handshake: Handshake,
};

type ServiceIconProps = {
  name?: string | null;
  className?: string;
};

export function ServiceIcon({ name, className }: ServiceIconProps) {
  if (!name) return null;
  const Icon = iconMap[name];
  if (!Icon) return null;
  return (
    <Icon
      className={cn("h-6 w-6 text-brand-ink", className)}
      aria-hidden="true"
      strokeWidth={1.75}
    />
  );
}
