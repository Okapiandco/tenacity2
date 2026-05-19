import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.page.upsert({
    where: { slug: "services" },
    create: { slug: "services", title: "Services" },
    update: {},
  });
  console.log("Services page upserted");
}

main().finally(() => prisma.$disconnect());
