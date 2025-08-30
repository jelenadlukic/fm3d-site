// prisma/backfill-passwords.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const targetEmail = process.env.SEED_ADMIN_EMAIL || "admin@fm3d.local";
  const pass = process.env.SEED_ADMIN_PASSWORD || "super-tajna-lozinka";
  const hash = await bcrypt.hash(pass, 12);

  // Primer 1: samo admin
  await prisma.user.updateMany({
    where: { email: targetEmail },
    data: { passwordHash: hash },
  });

  // (Opcija) Primer 2: svi koji imaju NULL dobiju “blokirajući” hash
  // const randomHash = await bcrypt.hash(crypto.randomUUID(), 12);
  // await prisma.user.updateMany({
  //   where: { passwordHash: null },
  //   data: { passwordHash: randomHash },
  // });
}
main().finally(() => prisma.$disconnect());
