import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getGroup, updateGroup, deleteGroup } from "@/lib/crm/groups";
import { crmCatch, crmError, emptyToNull, readJsonBody } from "@/lib/crm/api";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  try {
    const { id } = await params;
    const group = await getGroup(id);
    if (!group) return crmError("Nicht gefunden.", 404);
    return NextResponse.json({ group });
  } catch (error) {
    return crmCatch(error, "Gruppe konnte nicht geladen werden.");
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  const parsed = await readJsonBody(req);
  if (!parsed.ok) return parsed.response;
  const body = parsed.body;

  try {
    const { id } = await params;
    const group = await updateGroup(id, {
      name: typeof body.name === "string" ? body.name : undefined,
      description: typeof body.description === "string" ? body.description : undefined,
      type: typeof body.type === "string" ? body.type : undefined,
      season: typeof body.season === "string" ? body.season : undefined,
      leaderId: body.leaderId !== undefined ? emptyToNull(body.leaderId) : undefined,
      location: typeof body.location === "string" ? body.location : undefined,
      notes: typeof body.notes === "string" ? body.notes : undefined,
    });
    return NextResponse.json({ group });
  } catch (error) {
    return crmCatch(error, "Gruppe konnte nicht gespeichert werden.");
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  try {
    const { id } = await params;
    await deleteGroup(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return crmCatch(error, "Gruppe konnte nicht gelöscht werden.");
  }
}
