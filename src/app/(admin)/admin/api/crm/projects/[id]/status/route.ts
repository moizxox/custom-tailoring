import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { setProjectCustomerStatus } from "@/lib/crm/projects";
import { crmCatch, crmError, readJsonBody } from "@/lib/crm/api";

interface Params { params: Promise<{ id: string }> }

/** SETZEN — set customer/workflow status with optional note + history entry. */
export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  const parsed = await readJsonBody(req);
  if (!parsed.ok) return parsed.response;
  const status = typeof parsed.body.status === "string" ? parsed.body.status.trim() : "";
  if (!status) return crmError("Status erforderlich.", 400);
  const note = typeof parsed.body.note === "string" ? parsed.body.note : null;

  try {
    const { id } = await params;
    const project = await setProjectCustomerStatus(id, status, {
      note,
      changedBy: session.user?.email ?? session.user?.name ?? "admin",
    });
    return NextResponse.json({ project });
  } catch (error) {
    return crmCatch(error, "Status konnte nicht gesetzt werden.");
  }
}
