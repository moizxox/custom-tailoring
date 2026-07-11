import { NextResponse } from "next/server";
import { findCustomerByCredentials } from "@/lib/crm/customers";
import { findCustomerByPassword } from "@/lib/crm/registration";
import { createPortalSession } from "@/lib/portal/session";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; accessCode?: string; password?: string };

  if (!body.email?.trim()) {
    return NextResponse.json({ error: "E-Mail ist erforderlich." }, { status: 400 });
  }

  if (!body.accessCode?.trim() && !body.password?.trim()) {
    return NextResponse.json(
      { error: "Zugangscode oder Passwort ist erforderlich." },
      { status: 400 }
    );
  }

  let customer = null;

  if (body.accessCode?.trim()) {
    customer = await findCustomerByCredentials(body.email, body.accessCode);
  } else if (body.password?.trim()) {
    customer = await findCustomerByPassword(body.email, body.password);
  }

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
