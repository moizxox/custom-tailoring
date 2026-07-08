/**
 * Portal customer helpers — now DB-backed via Prisma.
 *
 * The PortalCustomer view type is kept for backward-compat with portal UI
 * components that haven't yet been fully migrated.
 */
import { prisma } from "@/lib/prisma";

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
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!customer) return null;
  return toPortalCustomer(customer, customer.projects[0] ?? null);
}

/** Fetch a customer by id and return a PortalCustomer view */
export async function findCustomerById(
  id: string
): Promise<PortalCustomer | null> {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!customer) return null;
  return toPortalCustomer(customer, customer.projects[0] ?? null);
}

/** Resolve a one-time portal access token → PortalCustomer */
export async function resolveAccessToken(
  token: string
): Promise<PortalCustomer | null> {
  const entry = await prisma.portalAccessToken.findUnique({
    where: { token },
    include: {
      customer: {
        include: {
          projects: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });
  if (!entry || entry.used || entry.expiresAt < new Date()) return null;

  await prisma.portalAccessToken.update({
    where: { id: entry.id },
    data: { used: true },
  });

  return toPortalCustomer(entry.customer, entry.customer.projects[0] ?? null);
}

// ─── Internal ─────────────────────────────────────────────────────────────────

type CustomerWithProject = Awaited<
  ReturnType<typeof prisma.customer.findUniqueOrThrow>
> & {
  projects: Array<{ title: string; costumeCategory: string | null }>;
};

function toPortalCustomer(
  customer: CustomerWithProject,
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
