import { Resend } from "resend";
import nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/** Supports both NODEMAILER_* and SMTP_* env var names */
function smtpHost() {
  return process.env.NODEMAILER_HOST ?? process.env.SMTP_HOST;
}

function smtpPort() {
  return Number(process.env.NODEMAILER_PORT ?? process.env.SMTP_PORT ?? 587);
}

function smtpSecure() {
  const val = process.env.NODEMAILER_SECURE ?? process.env.SMTP_SECURE;
  if (val === "true") return true;
  if (val === "false") return false;
  return smtpPort() === 465;
}

function smtpUser() {
  return process.env.NODEMAILER_USER ?? process.env.SMTP_USER;
}

function smtpPass() {
  return (process.env.NODEMAILER_PASSWORD ?? process.env.SMTP_PASS)?.replace(/\s/g, "");
}

function fromAddress() {
  return (
    process.env.NODEMAILER_FROM ??
    process.env.SMTP_FROM ??
    process.env.RESEND_FROM_EMAIL ??
    smtpUser() ??
    "noreply@lani-kostumschneiderei.ch"
  );
}

function hasSmtpConfig() {
  return Boolean(smtpHost() && smtpUser() && smtpPass());
}

function hasResendConfig() {
  const key = process.env.RESEND_API_KEY;
  return Boolean(key && key !== "REPLACE_WITH_YOUR_RESEND_KEY");
}

let _smtpTransport: nodemailer.Transporter | null = null;

function getSmtpTransport() {
  if (!_smtpTransport) {
    _smtpTransport = nodemailer.createTransport({
      host: smtpHost(),
      port: smtpPort(),
      secure: smtpSecure(),
      auth: {
        user: smtpUser(),
        pass: smtpPass(),
      },
    });
  }
  return _smtpTransport;
}

/** Check which email provider is active */
export function getEmailProvider(): "smtp" | "resend" | "none" {
  if (hasSmtpConfig()) return "smtp";
  if (hasResendConfig()) return "resend";
  return "none";
}

/**
 * Send an email via Nodemailer (SMTP) or Resend.
 * Priority: SMTP (Nodemailer) → Resend → console log in dev.
 */
export async function sendEmail(opts: SendEmailOptions): Promise<{
  ok: boolean;
  reason?: string;
  provider?: string;
}> {
  const to = Array.isArray(opts.to) ? opts.to : [opts.to];
  const from = fromAddress();

  if (hasSmtpConfig()) {
    try {
      const transport = getSmtpTransport();
      await transport.sendMail({
        from,
        to: to.join(", "),
        subject: opts.subject,
        html: opts.html,
        replyTo: opts.replyTo,
      });
      console.log(`[email] sent via SMTP to ${to.join(", ")}`);
      return { ok: true, provider: "smtp" };
    } catch (err) {
      console.error("[email] SMTP send error", err);
      return { ok: false, reason: "smtp_failed", provider: "smtp" };
    }
  }

  if (hasResendConfig()) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from,
        to,
        subject: opts.subject,
        html: opts.html,
        replyTo: opts.replyTo,
      });
      console.log(`[email] sent via Resend to ${to.join(", ")}`);
      return { ok: true, provider: "resend" };
    } catch (err) {
      console.error("[email] Resend send error", err);
      return { ok: false, reason: "resend_failed", provider: "resend" };
    }
  }

  console.warn("[email] No SMTP or Resend configured — email NOT sent:");
  console.warn(`  To: ${to.join(", ")}`);
  console.warn(`  Subject: ${opts.subject}`);
  return { ok: false, reason: "no_provider" };
}
