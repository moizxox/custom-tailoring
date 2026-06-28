import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.admin.upsert({
    where: { email: "mainmoiz899@gmail.com" },
    update: {},
    create: {
      email: "mainmoiz899@gmail.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });

  console.log(`Created admin: ${admin.email}`);

  // Seed initial products from static data
  const products = [
    {
      name: "Einzelkostüm Einfach",
      slug: "einzelkostum-einfach",
      description: "Einfaches Einzelkostüm nach Mass — solide Verarbeitung für Fasnacht und Events.",
      price: "CHF 180",
      category: "Einzelperson",
      tier: "Einfach",
      inStock: true,
      sortOrder: 1,
    },
    {
      name: "Einzelkostüm Standard",
      slug: "einzelkostum-standard",
      description: "Massgeschneidertes Kostüm mit hochwertigen Materialien und detaillierter Verarbeitung.",
      price: "CHF 320",
      category: "Einzelperson",
      tier: "Standard",
      inStock: true,
      sortOrder: 2,
    },
    {
      name: "Einzelkostüm Premium",
      slug: "einzelkostum-premium",
      description: "Exklusives Premiumkostüm mit besonderem Stoff und aufwendiger Handarbeit.",
      price: "CHF 550",
      category: "Einzelperson",
      tier: "Premium",
      inStock: true,
      sortOrder: 3,
    },
    {
      name: "Gruppenkostüm Einfach",
      slug: "gruppenkostum-einfach",
      description: "Einheitliche Kostüme für Gruppen und Guggenmusiken — ab 5 Stück.",
      price: "ab CHF 140 / Stück",
      category: "Gruppe",
      tier: "Einfach",
      inStock: true,
      sortOrder: 4,
    },
    {
      name: "Gruppenkostüm Standard",
      slug: "gruppenkostum-standard",
      description: "Hochwertige Gruppenkostüme mit individuellem Design — ab 5 Stück.",
      price: "ab CHF 260 / Stück",
      category: "Gruppe",
      tier: "Standard",
      inStock: true,
      sortOrder: 5,
    },
    {
      name: "Kostümveredelung",
      slug: "kostumveredelung",
      description: "Veredelung bestehender Kostüme — Stickerei, Druck, Applikationen.",
      price: "auf Anfrage",
      category: "Veredelung",
      tier: "Standard",
      inStock: true,
      sortOrder: 6,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`Seeded ${products.length} products`);
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
