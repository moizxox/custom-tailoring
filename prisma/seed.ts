import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("Admin@123", 12);

  // Reset admin users — single owner account
  await prisma.admin.deleteMany({});

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

  // Dedicated test admin (easy credentials for QA)
  const testAdmin = await prisma.admin.upsert({
    where: { email: "test.admin@lani.ch" },
    update: { password: hashedPassword },
    create: {
      email: "test.admin@lani.ch",
      username: "testadmin",
      password: hashedPassword,
      name: "Test Admin",
      role: "admin",
    },
  });
  console.log(`Created test admin: ${testAdmin.email} / Test@123`);

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

  // ─── CRM Demo Data ─────────────────────────────────────────────────────────
  console.log("Seeding CRM demo data...");

  // Demo customers
  const cust1 = await prisma.customer.upsert({
    where: { email: "max.muster@example.com" },
    update: {},
    create: {
      name: "Max Muster",
      email: "max.muster@example.com",
      phone: "+41 79 123 45 67",
      accessCode: "DEMO2026",
      role: "customer",
      location: "Basel",
      notes: "Demo-Kunde für Testzwecke",
    },
  });

  const cust2 = await prisma.customer.upsert({
    where: { email: "anna.beispiel@example.com" },
    update: {},
    create: {
      name: "Anna Beispiel",
      email: "anna.beispiel@example.com",
      phone: "+41 79 987 65 43",
      accessCode: "ANNA2026",
      role: "group_leader",
      location: "Pratteln",
    },
  });

  const cust3 = await prisma.customer.upsert({
    where: { email: "hans.mueller@example.com" },
    update: {},
    create: {
      name: "Hans Müller",
      email: "hans.mueller@example.com",
      accessCode: "HANS8765",
      role: "customer",
      location: "Therwil",
    },
  });

  // ── Test user: brand-new order (Step 1 — just submitted, waiting for admin)
  const custSarah = await prisma.customer.upsert({
    where: { email: "sarah.neu@example.com" },
    update: { accessCode: "NEUKUNDE1" },
    create: {
      name: "Sarah Neu",
      email: "sarah.neu@example.com",
      phone: "+41 79 111 22 33",
      accessCode: "NEUKUNDE1",
      role: "customer",
      location: "Basel",
      notes: "TEST: Frischer Auftrag — Status: Anfrage eingegangen",
    },
  });

  // ── Test user: ready to upload measurements (Step 4)
  const custPeter = await prisma.customer.upsert({
    where: { email: "peter.waggis@example.com" },
    update: { accessCode: "PETER001" },
    create: {
      name: "Peter Waggis",
      email: "peter.waggis@example.com",
      phone: "+41 79 444 55 66",
      accessCode: "PETER001",
      role: "customer",
      location: "Pratteln",
      notes: "TEST: Muss noch Massblatt ausfüllen",
    },
  });

  console.log("Created demo customers");

  // Demo group
  const group = await prisma.group.upsert({
    where: { id: "demo-group-001" },
    update: {},
    create: {
      id: "demo-group-001",
      name: "Guggenmusik Basel Demo",
      type: "guggenmusik",
      season: "Fasnacht 2026",
      leaderId: cust2.id,
      location: "Basel",
      description: "Demo-Gruppe für Testzwecke",
    },
  });

  // Add members
  await prisma.groupMember.upsert({
    where: { groupId_customerId: { groupId: group.id, customerId: cust1.id } },
    update: {},
    create: { groupId: group.id, customerId: cust1.id, costumeVariant: "Herren Typ A", measurementStatus: "complete" },
  });
  await prisma.groupMember.upsert({
    where: { groupId_customerId: { groupId: group.id, customerId: cust2.id } },
    update: {},
    create: { groupId: group.id, customerId: cust2.id, costumeVariant: "Damen Typ B", measurementStatus: "checked" },
  });
  await prisma.groupMember.upsert({
    where: { groupId_customerId: { groupId: group.id, customerId: cust3.id } },
    update: {},
    create: { groupId: group.id, customerId: cust3.id, measurementStatus: "pending" },
  });

  console.log("Created demo group with 3 members");

  // Demo project for individual customer
  const proj1 = await prisma.project.upsert({
    where: { id: "demo-project-001" },
    update: {},
    create: {
      id: "demo-project-001",
      title: "Waggis Kostüm 2026",
      description: "Einzelkostüm für Fasnacht 2026, Herrenmodell",
      customerId: cust1.id,
      costumeCategory: "Herren",
      quantity: 1,
      customerStatus: "production_started",
      internalStatus: "sewing",
      priority: "high",
      deadline: new Date("2026-02-10"),
      totalAmount: 850,
      paidAmount: 425,
      paymentStatus: "partial",
    },
  });

  // Demo project for group
  const proj2 = await prisma.project.upsert({
    where: { id: "demo-project-002" },
    update: {},
    create: {
      id: "demo-project-002",
      title: "Guggenmusik Kostüme 2026",
      description: "24 Kostüme für die Guggenmusik Basel Demo",
      groupId: group.id,
      costumeCategory: "Mixed",
      quantity: 24,
      customerStatus: "measurement_pending",
      internalStatus: "design",
      priority: "urgent",
      deadline: new Date("2026-01-20"),
      totalAmount: 18600,
      paidAmount: 5000,
      paymentStatus: "partial",
    },
  });

  // TEST: Sarah — brand-new order (Step 1)
  const proj3 = await prisma.project.upsert({
    where: { id: "demo-project-003" },
    update: {},
    create: {
      id: "demo-project-003",
      title: "Waggis Kostüm — Sarah Neu",
      description: "Neuer Einzelauftrag, Beratung noch ausstehend",
      customerId: custSarah.id,
      costumeCategory: "Damen",
      quantity: 1,
      customerStatus: "request_received",
      internalStatus: "new",
      priority: "normal",
      deadline: new Date("2026-03-01"),
    },
  });

  // TEST: Peter — waiting for measurements (Step 4)
  const proj4 = await prisma.project.upsert({
    where: { id: "demo-project-004" },
    update: {},
    create: {
      id: "demo-project-004",
      title: "Edelwaggis Kostüm 2026",
      description: "Design bestätigt — Kunde soll Massblatt ausfüllen",
      customerId: custPeter.id,
      costumeCategory: "Herren",
      quantity: 1,
      customerStatus: "measurement_pending",
      internalStatus: "design",
      priority: "high",
      deadline: new Date("2026-02-15"),
      totalAmount: 920,
      paymentStatus: "unpaid",
    },
  });

  // Create conversations
  await prisma.conversation.upsert({
    where: { id: "demo-conv-001" },
    update: {},
    create: { id: "demo-conv-001", projectId: proj1.id },
  });
  await prisma.conversation.upsert({
    where: { id: "demo-conv-002" },
    update: {},
    create: { id: "demo-conv-002", projectId: proj2.id },
  });
  await prisma.conversation.upsert({
    where: { id: "demo-conv-003" },
    update: {},
    create: { id: "demo-conv-003", projectId: proj3.id },
  });
  await prisma.conversation.upsert({
    where: { id: "demo-conv-004" },
    update: {},
    create: { id: "demo-conv-004", projectId: proj4.id },
  });

  // Welcome message on Peter's project (admin asked for measurements)
  const peterMsgCount = await prisma.message.count({ where: { conversationId: "demo-conv-004" } });
  if (peterMsgCount === 0) {
    await prisma.message.create({
      data: {
        conversationId: "demo-conv-004",
        senderRole: "admin",
        senderName: "Lani Atelier",
        body: "Hallo Peter! Ihr Design ist bestätigt. Bitte füllen Sie das Massblatt im Kundenbereich aus — unter 'Massblatt ausfüllen'. Bei Fragen einfach hier antworten.",
        readAt: null,
      },
    });
    await prisma.notification.create({
      data: {
        customerId: custPeter.id,
        type: "status_change",
        title: "Bitte Massblatt ausfüllen",
        body: "Ihr Projekt 'Edelwaggis Kostüm 2026' wartet auf Ihre Masse.",
        refId: proj4.id,
        refType: "project",
      },
    });
  }

  // Demo messages
  const existingMessages = await prisma.message.count({ where: { conversationId: "demo-conv-001" } });
  if (existingMessages === 0) {
    await prisma.message.createMany({
      data: [
        { conversationId: "demo-conv-001", senderRole: "customer", senderName: "Max Muster", body: "Guten Tag! Ich wollte fragen, wie der Stand bei meinem Kostüm ist?", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { conversationId: "demo-conv-001", senderRole: "admin", senderName: "Lani Atelier", body: "Hallo Max! Ihr Kostüm ist gerade in der Nähphase. Wir schätzen, dass wir in 2 Wochen fertig sind.", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), readAt: new Date() },
        { conversationId: "demo-conv-001", senderRole: "customer", senderName: "Max Muster", body: "Super, vielen Dank für die Info! 😊", createdAt: new Date(Date.now() - 60 * 60 * 1000) },
      ],
    });
  }

  // Demo measurements
  await prisma.measurement.upsert({
    where: { id: "demo-measurement-001" },
    update: {},
    create: {
      id: "demo-measurement-001",
      customerId: cust1.id,
      projectId: proj1.id,
      fields: { chest: 98, waist: 86, hips: 102, shoulder_width: 44, sleeve_length: 62, torso_length: 68, inseam: 82, height: 178, weight: 78 },
      status: "complete",
    },
  });

  // Demo tasks
  await prisma.task.upsert({
    where: { id: "demo-task-001" },
    update: {},
    create: {
      id: "demo-task-001",
      projectId: proj1.id,
      title: "Stoff bestellen (Rot/Weiss)",
      status: "done",
      priority: "high",
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });
  await prisma.task.upsert({
    where: { id: "demo-task-002" },
    update: {},
    create: {
      id: "demo-task-002",
      projectId: proj1.id,
      title: "Zuschnitt vorbereiten",
      status: "done",
      priority: "normal",
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });
  await prisma.task.upsert({
    where: { id: "demo-task-003" },
    update: {},
    create: {
      id: "demo-task-003",
      projectId: proj1.id,
      title: "Anprobe mit Kunden vereinbaren",
      status: "todo",
      priority: "high",
      dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("Created demo CRM data (4 projects, 5 customers, 1 group)");

  console.log(`
╔══════════════════════════════════════════════════════════════════════════╗
║                        TEST ACCOUNTS — QUICK REFERENCE                   ║
╠══════════════════════════════════════════════════════════════════════════╣
║  ADMIN LOGIN:  /admin/login                                              ║
║    test.admin@lani.ch  /  Test@123   (recommended for testing)           ║
║    mainmoiz899@gmail.com  /  Admin@123  (owner account)                  ║
╠══════════════════════════════════════════════════════════════════════════╣
║  CUSTOMER PORTAL:  /kundenbereich/login                                  ║
║                                                                          ║
║  Step 1 — New order (nothing done yet):                                  ║
║    sarah.neu@example.com  /  NEUKUNDE1                                   ║
║    → Project: demo-project-003 (Anfrage eingegangen)                     ║
║                                                                          ║
║  Step 4 — Upload sizes NOW:                                              ║
║    peter.waggis@example.com  /  PETER001                                 ║
║    → Project: demo-project-004 (Massnahme ausstehend)                    ║
║    → Go to: /kundenbereich/massblatt                                     ║
║                                                                          ║
║  Step 5 — In production + chat history:                                  ║
║    max.muster@example.com  /  DEMO2026                                   ║
║    → Project: demo-project-001 (In Produktion)                           ║
║                                                                          ║
║  Group leader:                                                           ║
║    anna.beispiel@example.com  /  ANNA2026                                ║
║    → Manages group: demo-group-001                                       ║
║                                                                          ║
║  Group member (measurements pending):                                    ║
║    hans.mueller@example.com  /  HANS8765                                ║
╠══════════════════════════════════════════════════════════════════════════╣
║  START APP:  pnpm dev   (Socket.io required for live chat)               ║
║  RE-SEED:    pnpm db:seed                                               ║
╚══════════════════════════════════════════════════════════════════════════╝
`);
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
