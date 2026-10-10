import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL!;
  const password = process.env.SEED_ADMIN_PASSWORD!;
  if (!email || !password)
    throw new Error("SEED_ADMIN_EMAIL dan SEED_ADMIN_PASSWORD wajib diisi");

  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: {
      name: process.env.SEED_ADMIN_NAME ?? "Administrator",
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });

  await prisma.companySettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, companyName: "Nama Perusahaan Anda" },
  });

  console.log("Seed selesai: admin dan pengaturan awal dibuat.");
}

main().finally(() => prisma.$disconnect());
