"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type ServicesListItem = { label: string; description?: string };

export async function saveService(
  id: string,
  data: {
    title: string;
    shortDescription: string;
    heroImageUrl: string;
    heroImageAlt: string;
    body: string;
    servicesList: ServicesListItem[];
    ctaLabel: string;
    ctaHref: string;
  },
) {
  await prisma.service.update({
    where: { id },
    data: {
      title: data.title,
      shortDescription: data.shortDescription,
      heroImageUrl: data.heroImageUrl || null,
      heroImageAlt: data.heroImageAlt || null,
      body: data.body || null,
      servicesList: data.servicesList,
      ctaLabel: data.ctaLabel || null,
      ctaHref: data.ctaHref || null,
    },
  });
  revalidatePath("/services");
  revalidatePath(`/services`);
}
