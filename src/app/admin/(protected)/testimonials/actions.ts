"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function saveTestimonial(data: {
  id?: string;
  quote: string;
  name: string;
  role?: string;
  company?: string;
  featured: boolean;
}) {
  if (data.id) {
    await prisma.testimonial.update({
      where: { id: data.id },
      data: { quote: data.quote, name: data.name, role: data.role || null, company: data.company || null, featured: data.featured },
    });
  } else {
    const count = await prisma.testimonial.count();
    await prisma.testimonial.create({
      data: { quote: data.quote, name: data.name, role: data.role || null, company: data.company || null, featured: data.featured, order: count },
    });
  }
  revalidatePath("/");
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/");
}
