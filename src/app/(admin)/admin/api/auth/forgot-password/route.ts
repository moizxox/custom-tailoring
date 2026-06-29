import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { randomBytes } from "crypto";
import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "E-Mail erforderlich." }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    // Always return 200 to prevent email enumeration
    if (!admin) {
      return NextResponse.json({ ok: true });
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/admin/reset-password?token=${token}`;

    if (process.env.RESEND_API_KEY) {
      const resend = getResend();
      if (resend) {
        await resend.emails.send({
        from: "Kostümschneiderei CMS <noreply@kostuemschneiderei.ch>",
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
      }
    } else {
      // Development: log to console
      console.log(`[Dev] Password reset link: ${resetUrl}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
