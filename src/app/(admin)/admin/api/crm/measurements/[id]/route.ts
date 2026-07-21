import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { crmCatch, crmError, readJsonBody } from "@/lib/crm/api";

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  const parsed = await readJsonBody(req);
  if (!parsed.ok) return parsed.response;
  const body = parsed.body;

  try {
    const { id } = await params;
    const existing = await prisma.measurement.findUnique({ where: { id } });
    if (!existing) return crmError("Nicht gefunden.", 404);

    const prevHistory = Array.isArray(existing.history)
      ? [...(existing.history as object[])]
      : [];
    prevHistory.push({
      changedAt: new Date().toISOString(),
      snapshot: existing.fields,
    } as object);

    const measurement = await prisma.measurement.update({
      where: { id },
      data: {
        fields: (body.fields as object) ?? existing.fields,
        status: typeof body.status === "string" ? body.status : existing.status,
        notes: typeof body.notes === "string" ? body.notes : existing.notes,
        history: prevHistory as object[],
      },
    });
    return NextResponse.json({ measurement });
  } catch (error) {
    return crmCatch(error, "Masse konnten nicht gespeichert werden.");
  }
}
