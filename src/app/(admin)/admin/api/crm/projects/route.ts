import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createProject, listProjects } from "@/lib/crm/projects";
import { crmCatch, crmError, emptyToNull, parseOptionalDate, readJsonBody } from "@/lib/crm/api";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  try {
    const { searchParams } = new URL(req.url);
    const result = await listProjects({
      search: searchParams.get("q") ?? undefined,
      customerStatus: searchParams.get("customerStatus") ?? undefined,
      internalStatus: searchParams.get("internalStatus") ?? undefined,
      priority: searchParams.get("priority") ?? undefined,
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
  const body = parsed.body;
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return crmError("Titel erforderlich.", 400);

  try {
    const project = await createProject({
      title,
      description: typeof body.description === "string" ? body.description : null,
      customerId: emptyToNull(body.customerId),
      groupId: emptyToNull(body.groupId),
      costumeCategory: typeof body.costumeCategory === "string" ? body.costumeCategory : null,
      orderType: typeof body.orderType === "string" ? body.orderType : null,
      quantity: typeof body.quantity === "number" ? body.quantity : Number(body.quantity) || 1,
      deadline: parseOptionalDate(body.deadline) ?? null,
      deliveryDate: parseOptionalDate(body.deliveryDate) ?? null,
      priority: typeof body.priority === "string" ? body.priority : "normal",
      notes: typeof body.notes === "string" ? body.notes : null,
      internalNotes: typeof body.internalNotes === "string" ? body.internalNotes : null,
    });
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return crmCatch(error, "Projekt konnte nicht erstellt werden.");
  }
}
