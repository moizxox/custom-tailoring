/**
 * Portal customer helpers — now DB-backed via Prisma.
 *
 * The PortalCustomer view type is kept for backward-compat with portal UI
 * components that haven't yet been fully migrated.
 */
import { prisma } from "@/lib/prisma";
import { getAccessibleProjectWhere } from "@/lib/portal/projects";

export type CostumeCategory = "Herren" | "Damen" | "Kinder";

export interface PortalCustomer {
  id: string;
  name: string;
  email: string;
  projectTitle: string;
  costumeCategory: CostumeCategory;
  accessCode: string;
}

/** Look up a customer by email + access code and return a PortalCustomer view */
export async function findCustomerByCredentials(
  email: string,
  accessCode: string
): Promise<PortalCustomer | null> {
  const customer = await prisma.customer.findFirst({
    where: {
      email: { equals: email.trim().toLowerCase(), mode: "insensitive" },
      accessCode: {
        equals: accessCode.trim().toUpperCase(),
        mode: "insensitive",
      },
    },
  });

  if (!customer) return null;

  const projectWhere = await getAccessibleProjectWhere(customer.id);
  const project = await prisma.project.findFirst({
    where: projectWhere,
    orderBy: { createdAt: "desc" },
  });

  return toPortalCustomer(customer, project ?? null);
}

/** Fetch a customer by id and return a PortalCustomer view */
export async function findCustomerById(
  id: string
): Promise<PortalCustomer | null> {
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) return null;

  const projectWhere = await getAccessibleProjectWhere(customer.id);
  const project = await prisma.project.findFirst({
    where: projectWhere,
    orderBy: { createdAt: "desc" },
  });

  return toPortalCustomer(customer, project ?? null);
}

/** Resolve a one-time portal access token → PortalCustomer */
export async function resolveAccessToken(
  token: string
): Promise<PortalCustomer | null> {
  const entry = await prisma.portalAccessToken.findUnique({
    where: { token },
    include: { customer: true },
  });
  if (!entry || entry.used || entry.expiresAt < new Date()) return null;

  await prisma.portalAccessToken.update({
    where: { id: entry.id },
    data: { used: true },
  });

  const projectWhere = await getAccessibleProjectWhere(entry.customer.id);
  const project = await prisma.project.findFirst({
    where: projectWhere,
    orderBy: { createdAt: "desc" },
  });

  return toPortalCustomer(entry.customer, project ?? null);
}

// ─── Internal ─────────────────────────────────────────────────────────────────

type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  accessCode: string;
};

function toPortalCustomer(
  customer: CustomerRecord,
  project: { title: string; costumeCategory: string | null } | null
): PortalCustomer {
  const cat = (project?.costumeCategory ?? "Herren") as CostumeCategory;
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    projectTitle: project?.title ?? "Aktuelles Projekt",
    costumeCategory: cat,
    accessCode: customer.accessCode,
  };
}
