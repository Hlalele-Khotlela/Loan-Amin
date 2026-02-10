import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.admin.upsert({
    where: { email: "tokelo@gmail.com" },
    update: {},
    create: {
      email: "tokelo@gmail.com",
      password: "$2b$10$cgctwYHifWNDG7nzS9OR9eI5.IwvT0AGXKxyI7xKNsM46rByw.iNK",
      role: "Admin",
      username: "Admin",
    },
  });

  console.log("✅ Admin seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
