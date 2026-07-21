import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProject, updateProject, deleteProject } from "@/lib/crm/projects";
import { crmCatch, crmError, emptyToNull, parseOptionalDate, readJsonBody } from "@/lib/crm/api";

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
  const body = parsed.body;

  try {
    const { id } = await params;
    const project = await updateProject(id, {
      title: typeof body.title === "string" ? body.title : undefined,
      description: typeof body.description === "string" ? body.description : undefined,
      customerId: body.customerId !== undefined ? emptyToNull(body.customerId) : undefined,
      groupId: body.groupId !== undefined ? emptyToNull(body.groupId) : undefined,
      costumeCategory:
        typeof body.costumeCategory === "string" ? body.costumeCategory : undefined,
      orderType: typeof body.orderType === "string" ? body.orderType : undefined,
      quantity:
        body.quantity !== undefined
          ? typeof body.quantity === "number"
            ? body.quantity
            : Number(body.quantity)
          : undefined,
      deadline: parseOptionalDate(body.deadline),
      deliveryDate: parseOptionalDate(body.deliveryDate),
      priority: typeof body.priority === "string" ? body.priority : undefined,
      notes: typeof body.notes === "string" ? body.notes : undefined,
      internalNotes: typeof body.internalNotes === "string" ? body.internalNotes : undefined,
      customerStatus: typeof body.customerStatus === "string" ? body.customerStatus : undefined,
      internalStatus: typeof body.internalStatus === "string" ? body.internalStatus : undefined,
      totalAmount:
        body.totalAmount !== undefined && body.totalAmount !== ""
          ? Number(body.totalAmount)
          : body.totalAmount === "" || body.totalAmount === null
            ? null
            : undefined,
      paidAmount:
        body.paidAmount !== undefined && body.paidAmount !== ""
          ? Number(body.paidAmount)
          : body.paidAmount === "" || body.paidAmount === null
            ? null
            : undefined,
      paymentStatus: typeof body.paymentStatus === "string" ? body.paymentStatus : undefined,
    });
    return NextResponse.json({ project });
  } catch (error) {
    return crmCatch(error, "Projekt konnte nicht gespeichert werden.");
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
