"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type SocialLink = { icon: string; url: string; order: number };

export async function saveSettings(data: {
  title: string;
  contactEmail: string;
  contactPhone: string;
  footerText: string;
  socials: SocialLink[];
}) {
  await prisma.siteSettings.upsert({
    where: { id: "settings" },
    create: {
      id: "settings",
      title: data.title,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone || null,
      footerText: data.footerText || null,
      socials: {
        create: data.socials.map((s) => ({ icon: s.icon, url: s.url, order: s.order })),
      },
    },
    update: {
      title: data.title,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone || null,
      footerText: data.footerText || null,
    },
  });

  await prisma.socialLink.deleteMany({ where: { siteSettingsId: "settings" } });
  if (data.socials.length > 0) {
    await prisma.socialLink.createMany({
      data: data.socials.map((s) => ({
        icon: s.icon,
        url: s.url,
        order: s.order,
        siteSettingsId: "settings",
      })),
    });
  }

  revalidatePath("/");
}
