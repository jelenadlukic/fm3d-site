// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD environment variables must be set.");
  }
  const hash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash, role: "SUPERADMIN" },
    create: { email, passwordHash: hash, role: "SUPERADMIN", name: "Admin" },
  });
  console.log("Seed OK:", email);
}

main().finally(() => prisma.$disconnect());
