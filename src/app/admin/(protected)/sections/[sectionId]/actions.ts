"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";

export async function saveSection(sectionId: string, content: Record<string, unknown>) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

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
