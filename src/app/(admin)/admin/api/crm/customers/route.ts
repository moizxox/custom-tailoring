import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCustomer, listCustomers } from "@/lib/crm/customers";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const result = await listCustomers({
    search: searchParams.get("q") ?? undefined,
    role: searchParams.get("role") ?? undefined,
    skip: parseInt(searchParams.get("skip") ?? "0", 10),
    take: parseInt(searchParams.get("take") ?? "50", 10),
  });

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  if (!body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: "Name und E-Mail sind Pflichtfelder." }, { status: 400 });
  }

  try {
    const customer = await createCustomer({
      name: body.name,
      email: body.email,
      phone: body.phone,
      notes: body.notes,
      location: body.location,
      role: body.role,
    });
    return NextResponse.json({ customer }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Diese E-Mail-Adresse ist bereits vergeben." }, { status: 409 });
    }
    return NextResponse.json({ error: "Fehler beim Erstellen." }, { status: 500 });
  }
}
