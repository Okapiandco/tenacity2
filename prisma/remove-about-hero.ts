import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.findUnique({
    where: { slug: "about" },
    include: { sections: true },
  });
  if (!page) { console.log("About page not found"); return; }

  const heroSections = page.sections.filter(s => s.type === "hero");
  if (heroSections.length === 0) { console.log("No hero section on about page"); return; }

  await prisma.section.deleteMany({ where: { id: { in: heroSections.map(s => s.id) } } });
  console.log(`Removed ${heroSections.length} hero section(s) from about page`);
}

main().finally(() => prisma.$disconnect());
