import { HeaderClient } from "@/components/layout/HeaderClient";
import { prisma } from "@/lib/prisma";

const FALLBACK_SERVICES = [
  { title: "Business Consultancy", slug: "business-consultancy" },
  { title: "Coaching & Mentoring", slug: "coaching-mentoring" },
  { title: "Careers & Employability Coaching", slug: "careers-employability-coaching" },
  { title: "Facilitation & Mediation", slug: "facilitation-mediation" },
  { title: "Project Management", slug: "project-management" },
];

export async function Header() {
  let services = FALLBACK_SERVICES;
  let linkedInUrl = "https://www.linkedin.com/in/rebecca-phillips-742361a/";
  try {
    const [rows, settings] = await Promise.all([
      prisma.service.findMany({ where: { hidden: false }, select: { title: true, slug: true }, orderBy: { order: "asc" } }),
      prisma.siteSettings.findUnique({ where: { id: "settings" }, include: { socials: { orderBy: { order: "asc" } } } }),
    ]);
    if (rows.length > 0) services = rows;
    const li = settings?.socials.find(s => s.icon === "linkedin");
    if (li?.url) linkedInUrl = li.url;
  } catch { /* DB unavailable */ }
  return <HeaderClient services={services} linkedInUrl={linkedInUrl} />;
}
