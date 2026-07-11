import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { createCustomer } from "@/lib/crm/customers";
import { sendVerificationEmail, sendWelcomeEmail } from "@/lib/crm/email";

export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

export async function createRegistrationToken(input: RegisterInput) {
  const email = input.email.trim().toLowerCase();

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return { error: "Diese E-Mail ist bereits registriert." as const };
  }

  const pending = await prisma.customerVerificationToken.findFirst({
    where: { email, used: false, expiresAt: { gt: new Date() } },
  });
  if (pending) {
    return { error: "Eine Bestätigungs-E-Mail wurde bereits gesendet. Bitte prüfen Sie Ihr Postfach." as const };
  }

  const passwordHash = input.password
    ? await bcrypt.hash(input.password, 12)
    : null;

  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 h

  await prisma.customerVerificationToken.create({
    data: {
      email,
      name: input.name.trim(),
      phone: input.phone?.trim() ?? null,
      passwordHash,
      token,
      expiresAt,
    },
  });

  const emailResult = await sendVerificationEmail({
    to: email,
    name: input.name.trim(),
    token,
  });

  return { ok: true as const, emailSent: emailResult.ok };
}

export async function verifyRegistrationToken(token: string) {
  const entry = await prisma.customerVerificationToken.findUnique({
    where: { token },
  });

  if (!entry || entry.used || entry.expiresAt < new Date()) {
    return { error: "Ungültiger oder abgelaufener Link." as const };
  }

  const existing = await prisma.customer.findUnique({
    where: { email: entry.email },
  });
  if (existing) {
    await prisma.customerVerificationToken.update({
      where: { id: entry.id },
      data: { used: true },
    });
    return { customer: existing, alreadyExisted: true };
  }

  const customer = await createCustomer({
    name: entry.name,
    email: entry.email,
    phone: entry.phone ?? undefined,
  });

  if (entry.passwordHash) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: { passwordHash: entry.passwordHash },
    });
  }

  await prisma.customerVerificationToken.update({
    where: { id: entry.id },
    data: { used: true },
  });

  await sendWelcomeEmail({
    to: customer.email,
    name: customer.name,
    accessCode: customer.accessCode,
  });

  return { customer };
}

/** Login with email + password (for self-registered customers). */
export async function findCustomerByPassword(
  email: string,
  password: string
) {
  const customer = await prisma.customer.findFirst({
    where: {
      email: { equals: email.trim().toLowerCase(), mode: "insensitive" },
      passwordHash: { not: null },
    },
  });

  if (!customer?.passwordHash) return null;

  const match = await bcrypt.compare(password, customer.passwordHash);
  return match ? customer : null;
}
