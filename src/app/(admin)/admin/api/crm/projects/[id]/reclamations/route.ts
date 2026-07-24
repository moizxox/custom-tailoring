import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { crmCatch, crmError, readJsonBody } from "@/lib/crm/api";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  try {
    const { id } = await params;
    const reclamations = await prisma.projectReclamation.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ reclamations });
  } catch (error) {
    return crmCatch(error, "Reklamationen konnten nicht geladen werden.");
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  const parsed = await readJsonBody(req);
  if (!parsed.ok) return parsed.response;
  const title = typeof parsed.body.title === "string" ? parsed.body.title.trim() : "";
  if (!title) return crmError("Titel erforderlich.", 400);
  const description =
    typeof parsed.body.description === "string" ? parsed.body.description.trim() || null : null;

  try {
    const { id } = await params;
    const reclamation = await prisma.projectReclamation.create({
      data: { projectId: id, title, description },
    });
    return NextResponse.json({ reclamation }, { status: 201 });
  } catch (error) {
    return crmCatch(error, "Reklamation konnte nicht erstellt werden.");
  }
}
