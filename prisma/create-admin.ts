import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN = {
  email: "mainmoiz899@gmail.com",
  username: "moizxox",
  name: "Moiz",
  role: "admin",
  password: "Admin@123",
};

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN.password, 12);

  const admin = await prisma.admin.upsert({
    where: { email: ADMIN.email },
    update: {
      username: ADMIN.username,
      password: hashedPassword,
      name: ADMIN.name,
      role: ADMIN.role,
    },
    create: {
      email: ADMIN.email,
      username: ADMIN.username,
      password: hashedPassword,
      name: ADMIN.name,
      role: ADMIN.role,
    },
  });

  console.log(`Admin ready: ${admin.email} (@${admin.username})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
