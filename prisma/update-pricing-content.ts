import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.findUnique({
    where: { slug: "pricing" },
    include: { sections: { where: { type: "pricing_content" } } },
  });

  if (!page?.sections[0]) {
    console.log("No pricing_content section found");
    return;
  }

  const existing = page.sections[0].content as Record<string, unknown>;

  await prisma.section.update({
    where: { id: page.sections[0].id },
    data: {
      content: {
        ...existing,
        closingText: "We'd love to find out more about you and how we can help. Please do get in touch to arrange a call so that we can send over a proposal and price.",
      },
    },
  });

  console.log("Pricing closing text updated");
}

main().finally(() => prisma.$disconnect());
