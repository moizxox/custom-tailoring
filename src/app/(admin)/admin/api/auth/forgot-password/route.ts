import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/email/send";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "E-Mail erforderlich." }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return NextResponse.json({ ok: true });
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/admin/reset-password?token=${token}`;

    const result = await sendEmail({
      to: email,
      subject: "Passwort zurücksetzen",
      html: `
        <p>Hallo,</p>
        <p>Sie haben einen Passwort-Reset angefordert. Klicken Sie auf den folgenden Link:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Dieser Link ist 1 Stunde gültig.</p>
        <p>Falls Sie keinen Reset angefordert haben, können Sie diese E-Mail ignorieren.</p>
      `,
    });

    if (!result.ok) {
      console.log(`[Dev] Password reset link: ${resetUrl}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
