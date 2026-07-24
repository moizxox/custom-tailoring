import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProject, updateProject, deleteProject, archiveProject } from "@/lib/crm/projects";
import { parseProjectBody } from "@/lib/crm/project-body";
import { crmCatch, crmError, readJsonBody } from "@/lib/crm/api";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  try {
    const { id } = await params;
    const project = await getProject(id);
    if (!project) return crmError("Nicht gefunden.", 404);
    return NextResponse.json({ project });
  } catch (error) {
    return crmCatch(error, "Projekt konnte nicht geladen werden.");
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  const parsed = await readJsonBody(req);
  if (!parsed.ok) return parsed.response;

  try {
    const { id } = await params;
    const fields = parseProjectBody(parsed.body);
    const project = await updateProject(id, fields);
    return NextResponse.json({ project });
  } catch (error) {
    return crmCatch(error, "Projekt konnte nicht gespeichert werden.");
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  const parsed = await readJsonBody(req);
  if (!parsed.ok) return parsed.response;
  try {
    const { id } = await params;
    if (typeof parsed.body.archived === "boolean") {
      const project = await archiveProject(id, parsed.body.archived);
      return NextResponse.json({ project });
    }
    return crmError("Keine gültige Aktion.", 400);
  } catch (error) {
    return crmCatch(error, "Projekt konnte nicht aktualisiert werden.");
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  try {
    const { id } = await params;
    await deleteProject(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return crmCatch(error, "Projekt konnte nicht gelöscht werden.");
  }
}
