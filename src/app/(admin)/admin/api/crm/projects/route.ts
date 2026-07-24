import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createProject, listProjects } from "@/lib/crm/projects";
import { parseProjectBody } from "@/lib/crm/project-body";
import { crmCatch, crmError, readJsonBody } from "@/lib/crm/api";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  try {
    const { searchParams } = new URL(req.url);
    const archivedParam = searchParams.get("archived");
    const result = await listProjects({
      search: searchParams.get("q") ?? undefined,
      customerStatus: searchParams.get("customerStatus") ?? undefined,
      internalStatus: searchParams.get("internalStatus") ?? undefined,
      priority: searchParams.get("priority") ?? undefined,
      season: searchParams.get("season") ?? undefined,
      archived:
        archivedParam === "1" || archivedParam === "true"
          ? true
          : archivedParam === "all"
            ? undefined
            : false,
    });
    return NextResponse.json(result);
  } catch (error) {
    return crmCatch(error, "Projekte konnten nicht geladen werden.");
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  const parsed = await readJsonBody(req);
  if (!parsed.ok) return parsed.response;
  const fields = parseProjectBody(parsed.body);
  const title = fields.title?.trim() ?? "";
  if (!title) return crmError("Titel erforderlich.", 400);

  try {
    const project = await createProject({ ...fields, title });
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return crmCatch(error, "Projekt konnte nicht erstellt werden.");
  }
}
