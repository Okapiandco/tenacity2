"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function reorderSections(orderedIds: string[]) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.section.update({ where: { id }, data: { order: index } }),
    ),
  );
  revalidatePath("/admin/pages");
  revalidatePath("/");
}

export async function toggleSection(id: string, enabled: boolean) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.section.update({ where: { id }, data: { enabled } });
  revalidatePath("/admin/pages");
  revalidatePath("/");
}

export async function savePageSeo(pageId: string, metaTitle: string, metaDescription: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const page = await prisma.page.update({
    where: { id: pageId },
    data: { metaTitle: metaTitle || null, metaDescription: metaDescription || null },
  });
  revalidatePath(`/${page.slug === "home" ? "" : page.slug}`);
}
