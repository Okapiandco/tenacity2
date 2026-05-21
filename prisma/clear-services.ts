import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const deleted = await prisma.service.deleteMany();
  console.log("Deleted", deleted.count, "services");
}
main().finally(() => prisma.$disconnect());
