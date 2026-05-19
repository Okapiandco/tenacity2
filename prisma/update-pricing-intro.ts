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
        introText: "Our pricing has been carefully thought through to be fair and accessible - so we can work with the clients we really want to - individuals, micro‑business owners and SME's. We don't believe in putting up barriers that that stop many people and small business owners access the support they need to move forward.\n\nOur services are delivered at a fair price but with no compromise to the scope, quality and professionalism.\n\nWe offer a tiered policy for:",
      },
    },
  });

  console.log("Pricing intro text updated");
}

main().finally(() => prisma.$disconnect());
