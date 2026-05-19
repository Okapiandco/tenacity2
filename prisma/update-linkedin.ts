import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.socialLink.updateMany({
    where: { siteSettingsId: "settings", icon: "linkedin" },
    data: { url: "https://www.linkedin.com/in/rebecca-phillips-742361a/" },
  });
  console.log("LinkedIn URL updated");
}

main().finally(() => prisma.$disconnect());
