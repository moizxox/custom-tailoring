import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { crmCatch, crmError, emptyToNull, readJsonBody } from "@/lib/crm/api";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);

  const parsed = await readJsonBody(req);
  if (!parsed.ok) return parsed.response;
  const body = parsed.body;
  const projectId = typeof body.projectId === "string" ? body.projectId : "";
  if (!projectId) return crmError("projectId erforderlich.", 400);

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        customerId: true,
        groupId: true,
        group: { select: { members: { select: { customerId: true } } } },
      },
    });
    if (!project) return crmError("Projekt nicht gefunden.", 404);

    const targetCustomerId = emptyToNull(body.customerId) ?? project.customerId;

    if (!targetCustomerId) {
      return crmError(
        "Bitte eine Person wählen. Für Gruppenprojekte ist customerId erforderlich.",
        400
      );
    }

    if (project.groupId) {
      const isMember = project.group?.members.some((m) => m.customerId === targetCustomerId);
      const isProjectCustomer = project.customerId === targetCustomerId;
      if (!isMember && !isProjectCustomer) {
        return crmError("Kunde ist kein Gruppenmitglied dieses Projekts.", 400);
      }
    }

    const existing = await prisma.measurement.findFirst({
      where: { projectId, customerId: targetCustomerId },
      orderBy: { updatedAt: "desc" },
    });
    if (existing) {
      return NextResponse.json({ measurement: existing, reused: true });
    }

    const measurement = await prisma.measurement.create({
      data: {
        customerId: targetCustomerId,
        projectId,
        fields: {},
        status: "pending",
      },
      include: { customer: { select: { id: true, name: true } } },
    });
    return NextResponse.json({ measurement }, { status: 201 });
  } catch (error) {
    return crmCatch(error, "Massnahme konnte nicht erstellt werden.");
  }
}
