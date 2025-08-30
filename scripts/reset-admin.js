// scripts/reset-admin.js
require("dotenv").config(); // čita .env i .env.local
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

(async () => {
  // OVDE stavi kredencijale koje želiš
  const email = process.env.SEED_ADMIN_EMAIL || "admin@fm3d.local";
  const password = process.env.SEED_ADMIN_PASSWORD || "super-tajna-lozinka";

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash, role: "SUPERADMIN", name: "Superadmin" },
    create: { email, passwordHash: hash, role: "SUPERADMIN", name: "Superadmin" },
  });

  console.log("✅ Admin OK:", user.email);
  process.exit(0);
})().catch((e) => {
  console.error("❌ Greška:", e);
  process.exit(1);
});
