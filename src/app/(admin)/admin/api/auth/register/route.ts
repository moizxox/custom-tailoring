import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    // Only allow registration if already authenticated as admin
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }

    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "E-Mail und Passwort erforderlich." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Passwort muss mindestens 8 Zeichen lang sein." }, { status: 400 });
    }

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Diese E-Mail-Adresse ist bereits registriert." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.admin.create({
      data: { email, password: hashed, name: name || null },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
