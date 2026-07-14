import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  findCustomerById,
  updateCustomer,
  deleteCustomer,
  regenerateAccessCode,
} from "@/lib/crm/customers";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const customer = await findCustomerById(id);
  if (!customer) return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });

  return NextResponse.json({ customer });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  if (body.regenerateCode) {
    const updated = await regenerateAccessCode(id);
    return NextResponse.json({ customer: updated });
  }

  try {
    const customer = await updateCustomer(id, body);
    return NextResponse.json({ customer });
  } catch {
    return NextResponse.json({ error: "Fehler beim Aktualisieren." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await deleteCustomer(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Fehler beim Löschen." }, { status: 500 });
  }
}
