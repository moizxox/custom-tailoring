import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token und Passwort erforderlich." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Passwort muss mindestens 8 Zeichen lang sein." }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Ungültiger oder abgelaufener Token." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.admin.update({
        where: { email: resetToken.email },
        data: { password: hashed },
      }),
      prisma.passwordResetToken.update({
        where: { token },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
