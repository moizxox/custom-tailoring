import { sendEmail, getEmailProvider } from "../src/lib/email/send";

async function main() {
  console.log("Provider:", getEmailProvider());
  const r = await sendEmail({
    to: process.env.NODEMAILER_USER ?? "gyromaster55@gmail.com",
    subject: "Lani CRM — Email Test OK",
    html: "<p>If you see this, Nodemailer/Gmail is working!</p>",
  });
  console.log("Result:", r);
  process.exit(r.ok ? 0 : 1);
}

main();
