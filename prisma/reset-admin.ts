import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.admin.deleteMany({});
  console.log("Deleted all admin users.");

  const hashedPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.admin.create({
    data: {
      email: "mainmoiz899@gmail.com",
      username: "moizxox",
      password: hashedPassword,
      name: "Moiz",
      role: "admin",
    },
  });

  console.log(`Created admin: ${admin.email} (@${admin.username})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
