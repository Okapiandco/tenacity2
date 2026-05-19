import { HeaderClient } from "@/components/layout/HeaderClient";
import type { NavService } from "@/components/layout/Nav";

const SERVICES: NavService[] = [
  { title: "Coaching", slug: "coaching" },
  { title: "Consultancy", slug: "consultancy" },
  { title: "Leadership Development", slug: "leadership-development" },
  { title: "Project Management", slug: "project-management" },
  { title: "Facilitation", slug: "facilitation" },
];

export function Header() {
  return <HeaderClient services={SERVICES} />;
}
