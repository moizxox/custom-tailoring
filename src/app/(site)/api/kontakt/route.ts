import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/send";

const LOCATION_LABELS: Record<string, string> = {
  pratteln: "Atelier Pratteln",
  therwil: "Atelier Therwil",
  unsicher: "Noch unentschlossen",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      location?: string;
      message?: string;
    };

    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json({ error: "Name, E-Mail und Nachricht sind erforderlich." }, { status: 400 });
    }

    const name = body.name.trim();
    const email = body.email.trim().toLowerCase();
    const phone = body.phone?.trim() ?? null;
    const location = body.location ?? null;
    const message = body.message.trim();

    await prisma.contactSubmission.create({
      data: { name, email, phone, location, message },
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : "";
    const safeLocation = location ? escapeHtml(LOCATION_LABELS[location] ?? location) : "";
    const safeMessage = escapeHtml(message);
    const safeFirstName = escapeHtml(name.split(" ")[0] ?? name);

    const recipientEmail =
      process.env.CONTACT_NOTIFICATION_EMAIL ??
      process.env.SMTP_USER ??
      process.env.RESEND_FROM_EMAIL;

    if (recipientEmail) {
      await sendEmail({
        to: recipientEmail,
        replyTo: email,
        subject: `Neue Kontaktanfrage von ${name}`,
        html: `
          <h2 style="font-family: Georgia, serif; color: #2c2a28;">Neue Kontaktanfrage</h2>
          <table style="font-family: sans-serif; font-size: 14px; color: #444; border-collapse: collapse;">
            <tr><td style="padding: 4px 12px 4px 0; color: #888; white-space: nowrap;">Name</td><td><strong>${safeName}</strong></td></tr>
            <tr><td style="padding: 4px 12px 4px 0; color: #888;">E-Mail</td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            ${safePhone ? `<tr><td style="padding: 4px 12px 4px 0; color: #888;">Telefon</td><td>${safePhone}</td></tr>` : ""}
            ${safeLocation ? `<tr><td style="padding: 4px 12px 4px 0; color: #888;">Standort</td><td>${safeLocation}</td></tr>` : ""}
          </table>
          <h3 style="font-family: Georgia, serif; color: #2c2a28; margin-top: 20px;">Nachricht</h3>
          <p style="font-family: sans-serif; font-size: 14px; color: #444; white-space: pre-wrap; background: #f5f4f2; padding: 12px; border-radius: 8px;">${safeMessage}</p>
          <p style="font-family: sans-serif; font-size: 12px; color: #aaa; margin-top: 20px;">Eingegangen über kostumschneiderei.ch/kontakt</p>
        `,
      });
    }

    await sendEmail({
      to: email,
      subject: "Ihre Anfrage bei Kostümschneiderei Lani — Bestätigung",
      html: `
        <h2 style="font-family: Georgia, serif; color: #2c2a28;">Vielen Dank, ${safeFirstName}!</h2>
        <p style="font-family: sans-serif; font-size: 14px; color: #444; line-height: 1.6;">
          Wir haben Ihre Nachricht erhalten und melden uns so bald wie möglich — in der Regel innerhalb von 1–2 Werktagen.
        </p>
        <p style="font-family: sans-serif; font-size: 14px; color: #888; margin-top: 24px;">
          Ihre Anfrage:<br>
          <em style="color: #555;">${escapeHtml(message.slice(0, 200))}${message.length > 200 ? "…" : ""}</em>
        </p>
        <hr style="border: none; border-top: 1px solid #e5e3de; margin: 24px 0;">
        <p style="font-family: sans-serif; font-size: 12px; color: #aaa;">
          Kostümschneiderei Lani · Atelier Pratteln & Therwil
        </p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[kontakt] submit failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
