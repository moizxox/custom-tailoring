import { NextResponse } from "next/server";
import { findCustomerByCredentials } from "@/lib/portal/customers";
import { createPortalSession } from "@/lib/portal/session";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; accessCode?: string };

  if (!body.email?.trim() || !body.accessCode?.trim()) {
    return NextResponse.json(
      { error: "E-Mail und Zugangscode sind erforderlich." },
      { status: 400 }
    );
  }

  const customer = findCustomerByCredentials(body.email, body.accessCode);

  if (!customer) {
    return NextResponse.json(
      { error: "Ungültige Anmeldedaten. Bitte prüfen Sie E-Mail und Zugangscode." },
      { status: 401 }
    );
  }

  await createPortalSession(customer.id);

  return NextResponse.json({
    ok: true,
    redirect: "/kundenbereich",
  });
}
