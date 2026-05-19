import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.findUnique({
    where: { slug: "pricing" },
    include: { sections: { where: { type: "pricing_content" } } },
  });

  if (!page?.sections[0]) { console.log("No pricing_content section found"); return; }

  const existing = page.sections[0].content as Record<string, unknown>;

  await prisma.section.update({
    where: { id: page.sections[0].id },
    data: {
      content: {
        ...existing,
        body: "Individuals & Freelancers\n\nMicro-business Owners\n\nSME Leaders\n\nCharities",
      },
    },
  });

  console.log("Pricing bullets updated");
}

main().finally(() => prisma.$disconnect());
