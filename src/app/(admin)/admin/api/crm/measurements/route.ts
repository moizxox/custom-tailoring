import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.projectId) return NextResponse.json({ error: "projectId erforderlich." }, { status: 400 });

  const project = await prisma.project.findUnique({
    where: { id: body.projectId },
    select: { customerId: true, groupId: true },
  });
  if (!project) return NextResponse.json({ error: "Projekt nicht gefunden." }, { status: 404 });

  let targetCustomerId = project.customerId;

  if (!targetCustomerId) {
    if (!body.customerId) {
      return NextResponse.json(
        { error: "Für Gruppenprojekte ist customerId erforderlich." },
        { status: 400 }
      );
    }

    if (!project.groupId) {
      return NextResponse.json({ error: "Kein Kunde für dieses Projekt." }, { status: 400 });
    }

    const membership = await prisma.groupMember.findFirst({
      where: { groupId: project.groupId, customerId: body.customerId },
    });
    if (!membership) {
      return NextResponse.json({ error: "Kunde ist kein Gruppenmitglied." }, { status: 400 });
    }

    targetCustomerId = body.customerId;
  }

  const measurement = await prisma.measurement.create({
    data: {
      customerId: targetCustomerId!,
      projectId: body.projectId,
      fields: {},
      status: "pending",
    },
  });
  return NextResponse.json({ measurement }, { status: 201 });
}
