import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.projectId) return NextResponse.json({ error: "projectId erforderlich." }, { status: 400 });

  // Get the customer for this project
  const project = await prisma.project.findUnique({ where: { id: body.projectId }, select: { customerId: true } });
  if (!project?.customerId) return NextResponse.json({ error: "Kein Kunde für dieses Projekt." }, { status: 400 });

  const measurement = await prisma.measurement.create({
    data: { customerId: project.customerId, projectId: body.projectId, fields: {}, status: "pending" },
  });
  return NextResponse.json({ measurement }, { status: 201 });
}
