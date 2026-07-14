import { NextResponse } from "next/server";
import { createRegistrationToken } from "@/lib/crm/registration";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  };

  if (!body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json(
      { error: "Name und E-Mail sind erforderlich." },
      { status: 400 }
    );
  }

  const result = await createRegistrationToken({
    name: body.name,
    email: body.email,
    phone: body.phone,
    password: body.password,
  });

  if ("error" in result && result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, emailSent: result.emailSent });
}
