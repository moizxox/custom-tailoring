import { prisma } from "@/lib/prisma";
import { createCustomer } from "@/lib/crm/customers";
import { createProject } from "@/lib/crm/projects";
import { sendAccessCodeEmail } from "@/lib/crm/email";

export async function listContactSubmissions(opts?: {
  unreadOnly?: boolean;
  skip?: number;
  take?: number;
}) {
  const where = opts?.unreadOnly ? { read: false } : {};

  const [submissions, total, unreadCount] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: opts?.skip ?? 0,
      take: opts?.take ?? 50,
    }),
    prisma.contactSubmission.count({ where }),
    prisma.contactSubmission.count({ where: { read: false } }),
  ]);

  return { submissions, total, unreadCount };
}

export async function getContactSubmission(id: string) {
  return prisma.contactSubmission.findUnique({ where: { id } });
}

export async function markSubmissionRead(id: string) {
  return prisma.contactSubmission.update({
    where: { id },
    data: { read: true },
  });
}

export async function convertSubmissionToCustomer(
  submissionId: string,
  opts?: {
    createProject?: boolean;
    projectTitle?: string;
    sendAccessCode?: boolean;
  }
) {
  const submission = await prisma.contactSubmission.findUnique({
    where: { id: submissionId },
  });
  if (!submission) return { error: "Nicht gefunden." as const };

  if (submission.convertedCustomerId) {
    const existing = await prisma.customer.findUnique({
      where: { id: submission.convertedCustomerId },
    });
    if (existing) return { error: "Bereits konvertiert." as const, customer: existing };
  }

  const existingByEmail = await prisma.customer.findUnique({
    where: { email: submission.email },
  });
  if (existingByEmail) {
    await prisma.contactSubmission.update({
      where: { id: submissionId },
      data: {
        read: true,
        convertedCustomerId: existingByEmail.id,
        convertedAt: new Date(),
      },
    });
    return { customer: existingByEmail, alreadyExisted: true };
  }

  const customer = await createCustomer({
    name: submission.name,
    email: submission.email,
    phone: submission.phone ?? undefined,
    location: submission.location ?? undefined,
    notes: `Aus Kontaktformular: ${submission.message.slice(0, 200)}`,
  });

  let project = null;
  if (opts?.createProject !== false) {
    project = await createProject({
      title: opts?.projectTitle ?? `Anfrage — ${submission.name}`,
      description: submission.message,
      customerId: customer.id,
    });
  }

  await prisma.contactSubmission.update({
    where: { id: submissionId },
    data: {
      read: true,
      convertedCustomerId: customer.id,
      convertedAt: new Date(),
    },
  });

  if (opts?.sendAccessCode !== false) {
    await sendAccessCodeEmail({
      to: customer.email,
      name: customer.name,
      accessCode: customer.accessCode,
    });
  }

  return { customer, project };
}
