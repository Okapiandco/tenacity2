"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function reorderSections(orderedIds: string[]) {
  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.section.update({ where: { id }, data: { order: index } }),
    ),
  );
  revalidatePath("/admin/pages");
  revalidatePath("/");
}

export async function toggleSection(id: string, enabled: boolean) {
  await prisma.section.update({ where: { id }, data: { enabled } });
  revalidatePath("/admin/pages");
  revalidatePath("/");
}

export async function savePageSeo(pageId: string, metaTitle: string, metaDescription: string) {
  const page = await prisma.page.update({
    where: { id: pageId },
    data: { metaTitle: metaTitle || null, metaDescription: metaDescription || null },
  });
  revalidatePath(`/${page.slug === "home" ? "" : page.slug}`);
}
