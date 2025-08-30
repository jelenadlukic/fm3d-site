const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

(async () => {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.error("Setuj SEED_ADMIN_EMAIL i SEED_ADMIN_PASSWORD u .env.local");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash, role: "SUPERADMIN", name: "Admin" },
    create: { email, passwordHash: hash, role: "SUPERADMIN", name: "Admin" },
  });

  console.log("Seedovan admin:", user.email, "role:", user.role);
  process.exit(0);
})();
