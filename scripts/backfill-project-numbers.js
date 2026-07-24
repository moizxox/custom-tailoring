/* Backfill projectNumber for existing projects (KSP{YY}-{####} by createdAt). */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany({
    where: { projectNumber: null },
    orderBy: { createdAt: "asc" },
    select: { id: true, createdAt: true },
  });
  if (projects.length === 0) {
    console.log("No projects to backfill.");
    return;
  }
  // Track counters per year, continuing after existing numbers
  const counters = {};
  const existing = await prisma.project.findMany({
    where: { projectNumber: { not: null } },
    select: { projectNumber: true },
  });
  for (const e of existing) {
    const m = /^KSP(\d{2})-(\d+)$/.exec(e.projectNumber ?? "");
    if (m) {
      const yy = m[1];
      const n = parseInt(m[2], 10);
      counters[yy] = Math.max(counters[yy] ?? 0, n);
    }
  }
  for (const p of projects) {
    const yy = String(p.createdAt.getFullYear()).slice(-2);
    counters[yy] = (counters[yy] ?? 0) + 1;
    const num = `KSP${yy}-${String(counters[yy]).padStart(4, "0")}`;
    await prisma.project.update({ where: { id: p.id }, data: { projectNumber: num } });
    console.log(`${p.id} -> ${num}`);
  }
  console.log(`Backfilled ${projects.length} projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
