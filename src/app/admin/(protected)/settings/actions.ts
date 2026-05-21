"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type SocialLink = { icon: string; url: string; order: number };
type BrandSettings = { primaryColor: string; accentColor: string; inkColor: string; headingFont: string; bodyFont: string };

export async function saveSettings(data: {
  title: string;
  contactEmail: string;
  contactPhone: string;
  footerText: string;
  socials: SocialLink[];
}) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.siteSettings.upsert({
    where: { id: "settings" },
    create: { id: "settings", title: data.title, contactEmail: data.contactEmail, contactPhone: data.contactPhone || null, footerText: data.footerText || null, socials: { create: data.socials.map((s) => ({ icon: s.icon, url: s.url, order: s.order })) } },
    update: { title: data.title, contactEmail: data.contactEmail, contactPhone: data.contactPhone || null, footerText: data.footerText || null },
  });
  await prisma.socialLink.deleteMany({ where: { siteSettingsId: "settings" } });
  if (data.socials.length > 0) {
    await prisma.socialLink.createMany({ data: data.socials.map((s) => ({ icon: s.icon, url: s.url, order: s.order, siteSettingsId: "settings" })) });
  }
  revalidatePath("/");
}

export async function saveBrandSettings(brand: BrandSettings) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.siteSettings.upsert({
    where: { id: "settings" },
    create: { id: "settings", title: "Tenacity Business Growth Consultancy", contactEmail: "becky@tenacity.co.uk", brandSettings: brand },
    update: { brandSettings: brand },
  });
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/pricing");
  revalidatePath("/contact");
}
