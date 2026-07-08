import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ customers: [], groups: [], projects: [] });
  }

  const [customers, groups, projects] = await Promise.all([
    prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { phone: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, name: true, email: true, role: true },
    }),
    prisma.group.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { season: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, name: true, type: true, season: true },
    }),
    prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { customer: { name: { contains: q, mode: "insensitive" } } },
          { group: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: 5,
      select: {
        id: true,
        title: true,
        customerStatus: true,
        customer: { select: { name: true } },
        group: { select: { name: true } },
      },
    }),
  ]);

  return NextResponse.json({ customers, groups, projects });
}
