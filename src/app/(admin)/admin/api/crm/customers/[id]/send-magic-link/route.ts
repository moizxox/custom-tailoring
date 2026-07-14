import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { findCustomerById, createPortalAccessToken } from "@/lib/crm/customers";
import { sendMagicLinkEmail } from "@/lib/crm/email";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const customer = await findCustomerById(id);
  if (!customer) return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });

  const token = await createPortalAccessToken(id);
  const result = await sendMagicLinkEmail({
    to: customer.email,
    name: customer.name,
    token,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: "E-Mail konnte nicht gesendet werden. Prüfen Sie RESEND_API_KEY." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
