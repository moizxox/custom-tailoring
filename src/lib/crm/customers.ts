import { prisma } from "@/lib/prisma";
import type { Customer } from "@prisma/client";
import { nanoid } from "nanoid";

// ─── Public shape used across portal + admin ─────────────────────────────────

export type { Customer };

// ─── Auth helpers ─────────────────────────────────────────────────────────────

/** Find a customer by email + access code (case-insensitive). Used by portal login. */
export async function findCustomerByCredentials(
  email: string,
  accessCode: string
): Promise<Customer | null> {
  return prisma.customer.findFirst({
    where: {
      email: { equals: email.trim().toLowerCase(), mode: "insensitive" },
      accessCode: {
        equals: accessCode.trim().toUpperCase(),
        mode: "insensitive",
      },
    },
  });
}

/** Fetch a customer by id. */
export async function findCustomerById(id: string): Promise<Customer | null> {
  return prisma.customer.findUnique({ where: { id } });
}

/** Resolve a one-time portal access token → customer (magic link). */
export async function resolveAccessToken(
  token: string
): Promise<Customer | null> {
  const entry = await prisma.portalAccessToken.findUnique({
    where: { token },
    include: { customer: true },
  });
  if (!entry) return null;
  if (entry.used) return null;
  if (entry.expiresAt < new Date()) return null;

  await prisma.portalAccessToken.update({
    where: { id: entry.id },
    data: { used: true },
  });

  return entry.customer;
}

// ─── CRUD for admin ───────────────────────────────────────────────────────────

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  location?: string;
  role?: "customer" | "group_leader";
}

export async function createCustomer(input: CreateCustomerInput) {
  const accessCode = generateAccessCode();
  return prisma.customer.create({
    data: {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() ?? null,
      notes: input.notes?.trim() ?? null,
      location: input.location?.trim() ?? null,
      role: input.role ?? "customer",
      accessCode,
    },
  });
}

export async function updateCustomer(
  id: string,
  data: Partial<CreateCustomerInput>
) {
  return prisma.customer.update({
    where: { id },
    data: {
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      phone: data.phone?.trim() ?? undefined,
      notes: data.notes?.trim() ?? undefined,
      location: data.location?.trim() ?? undefined,
      role: data.role,
    },
  });
}

export async function deleteCustomer(id: string) {
  return prisma.customer.delete({ where: { id } });
}

export async function listCustomers(opts?: {
  search?: string;
  role?: string;
  skip?: number;
  take?: number;
}) {
  const where = {
    AND: [
      opts?.search
        ? {
            OR: [
              { name: { contains: opts.search, mode: "insensitive" as const } },
              {
                email: { contains: opts.search, mode: "insensitive" as const },
              },
            ],
          }
        : {},
      opts?.role ? { role: opts.role } : {},
    ],
  };

  try {
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: opts?.skip ?? 0,
        take: opts?.take ?? 50,
        include: {
          _count: { select: { projects: true, groupMemberships: true } },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return { customers, total };
  } catch (error) {
    console.error("[crm] listCustomers failed:", error);
    return { customers: [], total: 0 };
  }
}

export async function regenerateAccessCode(customerId: string) {
  const accessCode = generateAccessCode();
  return prisma.customer.update({
    where: { id: customerId },
    data: { accessCode },
  });
}

// ─── Magic link ───────────────────────────────────────────────────────────────

export async function createPortalAccessToken(customerId: string) {
  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 72); // 72 h

  await prisma.portalAccessToken.create({
    data: { customerId, token, expiresAt },
  });

  return token;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}
