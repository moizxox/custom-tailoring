import { sendEmail } from "@/lib/email/send";

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

const emailStyles = {
  heading: 'font-family: Georgia, serif; color: #2c2a28;',
  body: 'font-family: sans-serif; font-size: 14px; color: #444; line-height: 1.6;',
  footer: 'font-family: sans-serif; font-size: 12px; color: #aaa;',
  code: 'font-family: monospace; font-size: 18px; letter-spacing: 2px; background: #f5f4f2; padding: 12px 20px; border-radius: 8px; display: inline-block; color: #2c2a28;',
  button: 'display: inline-block; background: #7c83c9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-family: sans-serif; font-size: 14px; font-weight: 600;',
};

export async function sendAccessCodeEmail(opts: {
  to: string;
  name: string;
  accessCode: string;
}) {
  const loginUrl = `${appUrl()}/kundenbereich/login`;

  return sendEmail({
    to: opts.to,
    subject: "Ihr Zugangscode — Kostümschneiderei Lani",
    html: `
      <h2 style="${emailStyles.heading}">Willkommen, ${opts.name.split(" ")[0]}!</h2>
      <p style="${emailStyles.body}">
        Ihr persönlicher Zugangscode für den Kundenbereich:
      </p>
      <p style="text-align: center; margin: 24px 0;">
        <code style="${emailStyles.code}">${opts.accessCode}</code>
      </p>
      <p style="${emailStyles.body}">
        Melden Sie sich an unter <a href="${loginUrl}" style="color: #7c83c9;">${loginUrl}</a>
        mit Ihrer E-Mail-Adresse und diesem Code.
      </p>
      <hr style="border: none; border-top: 1px solid #e5e3de; margin: 24px 0;">
      <p style="${emailStyles.footer}">
        Kostümschneiderei Lani · Atelier Pratteln & Therwil
      </p>
    `,
  });
}

export async function sendMagicLinkEmail(opts: {
  to: string;
  name: string;
  token: string;
}) {
  const link = `${appUrl()}/kundenbereich/zugang/${opts.token}`;

  return sendEmail({
    to: opts.to,
    subject: "Ihr Zugangslink — Kostümschneiderei Lani",
    html: `
      <h2 style="${emailStyles.heading}">Hallo, ${opts.name.split(" ")[0]}!</h2>
      <p style="${emailStyles.body}">
        Klicken Sie auf den Button, um sich direkt im Kundenbereich anzumelden.
        Der Link ist 72 Stunden gültig und kann nur einmal verwendet werden.
      </p>
      <p style="text-align: center; margin: 28px 0;">
        <a href="${link}" style="${emailStyles.button}">Zum Kundenbereich</a>
      </p>
      <p style="${emailStyles.body}; font-size: 12px; color: #888;">
        Falls der Button nicht funktioniert: <a href="${link}" style="color: #7c83c9;">${link}</a>
      </p>
      <hr style="border: none; border-top: 1px solid #e5e3de; margin: 24px 0;">
      <p style="${emailStyles.footer}">
        Kostümschneiderei Lani · Atelier Pratteln & Therwil
      </p>
    `,
  });
}

export async function sendVerificationEmail(opts: {
  to: string;
  name: string;
  token: string;
}) {
  const link = `${appUrl()}/kundenbereich/verify/${opts.token}`;

  return sendEmail({
    to: opts.to,
    subject: "E-Mail bestätigen — Kostümschneiderei Lani",
    html: `
      <h2 style="${emailStyles.heading}">Hallo, ${opts.name.split(" ")[0]}!</h2>
      <p style="${emailStyles.body}">
        Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Kundenkonto zu aktivieren.
      </p>
      <p style="text-align: center; margin: 28px 0;">
        <a href="${link}" style="${emailStyles.button}">E-Mail bestätigen</a>
      </p>
      <p style="${emailStyles.body}; font-size: 12px; color: #888;">
        Der Link ist 24 Stunden gültig.
      </p>
      <hr style="border: none; border-top: 1px solid #e5e3de; margin: 24px 0;">
      <p style="${emailStyles.footer}">
        Kostümschneiderei Lani · Atelier Pratteln & Therwil
      </p>
    `,
  });
}

export async function sendWelcomeEmail(opts: {
  to: string;
  name: string;
  accessCode: string;
}) {
  return sendAccessCodeEmail(opts);
}
