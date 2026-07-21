import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createGroup, listGroups } from "@/lib/crm/groups";
import { crmCatch, crmError, emptyToNull, readJsonBody } from "@/lib/crm/api";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  try {
    const { searchParams } = new URL(req.url);
    const result = await listGroups({
      search: searchParams.get("q") ?? undefined,
      type: searchParams.get("type") ?? undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    return crmCatch(error, "Gruppen konnten nicht geladen werden.");
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  const parsed = await readJsonBody(req);
  if (!parsed.ok) return parsed.response;
  const body = parsed.body;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return crmError("Name ist erforderlich.", 400);

  try {
    const group = await createGroup({
      name,
      description: typeof body.description === "string" ? body.description : null,
      type: typeof body.type === "string" ? body.type : "group",
      season: typeof body.season === "string" ? body.season : null,
      leaderId: emptyToNull(body.leaderId),
      location: typeof body.location === "string" ? body.location : null,
      notes: typeof body.notes === "string" ? body.notes : null,
    });
    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    return crmCatch(error, "Gruppe konnte nicht erstellt werden.");
  }
}
