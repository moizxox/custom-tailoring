import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { crmCatch, crmError, readJsonBody } from "@/lib/crm/api";

interface Params { params: Promise<{ id: string; reclamationId: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  const parsed = await readJsonBody(req);
  if (!parsed.ok) return parsed.response;
  try {
    const { reclamationId } = await params;
    const status = typeof parsed.body.status === "string" ? parsed.body.status : undefined;
    const title = typeof parsed.body.title === "string" ? parsed.body.title.trim() : undefined;
    const description =
      parsed.body.description !== undefined
        ? typeof parsed.body.description === "string"
          ? parsed.body.description.trim() || null
          : null
        : undefined;
    const reclamation = await prisma.projectReclamation.update({
      where: { id: reclamationId },
      data: {
        title,
        description,
        status,
        resolvedAt:
          status === "resolved" || status === "closed" ? new Date() : status ? null : undefined,
      },
    });
    return NextResponse.json({ reclamation });
  } catch (error) {
    return crmCatch(error, "Reklamation konnte nicht gespeichert werden.");
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  try {
    const { reclamationId } = await params;
    await prisma.projectReclamation.delete({ where: { id: reclamationId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return crmCatch(error, "Reklamation konnte nicht gelöscht werden.");
  }
}
