"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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
    hidden: boolean;
  },
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

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
      hidden: data.hidden,
    },
  });
  revalidatePath("/services");
  revalidatePath(`/services/${id}`);
}

export async function saveServiceSeo(id: string, metaTitle: string, metaDescription: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const svc = await prisma.service.update({
    where: { id },
    data: { metaTitle: metaTitle || null, metaDescription: metaDescription || null },
  });
  revalidatePath(`/services/${svc.slug}`);
}
