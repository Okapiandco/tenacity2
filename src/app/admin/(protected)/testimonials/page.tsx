import { prisma } from "@/lib/prisma";
import { TestimonialsManager } from "./TestimonialsManager";

export default async function TestimonialsAdmin() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Testimonials</h1>
      <TestimonialsManager testimonials={testimonials} />
    </>
  );
}
