"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function saveSection(sectionId: string, content: Record<string, unknown>) {
  await prisma.section.update({
    where: { id: sectionId },
    data: { content: content as Prisma.InputJsonValue },
  });
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/pricing");
  revalidatePath("/contact");
}
