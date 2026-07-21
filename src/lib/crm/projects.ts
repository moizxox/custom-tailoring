import { prisma } from "@/lib/prisma";
import { emptyToNull } from "@/lib/crm/api";

// ─── Status constants ─────────────────────────────────────────────────────────

export const CUSTOMER_STATUSES = [
  { value: "request_received", label: "Anfrage eingegangen" },
  { value: "consultation_scheduled", label: "Beratung geplant" },
  { value: "design_approved", label: "Design bestätigt" },
  { value: "measurement_pending", label: "Massnahme ausstehend" },
  { value: "production_started", label: "In Produktion" },
  { value: "fitting_scheduled", label: "Anprobe geplant" },
  { value: "alterations", label: "Anpassungen" },
  { value: "ready_for_pickup", label: "Abholbereit" },
  { value: "completed", label: "Abgeschlossen" },
] as const;

export const INTERNAL_STATUSES = [
  { value: "new", label: "Neu" },
  { value: "design", label: "Design" },
  { value: "cutting", label: "Zuschnitt" },
  { value: "sewing", label: "Nähen" },
  { value: "embellishment", label: "Veredelung" },
  { value: "fitting", label: "Anprobe" },
  { value: "finishing", label: "Fertigstellung" },
  { value: "done", label: "Fertig" },
] as const;

export const PROJECT_PRIORITIES = [
  { value: "low", label: "Niedrig" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Hoch" },
  { value: "urgent", label: "Dringend" },
] as const;

/** Body/fit for Massblatt */
export const COSTUME_CATEGORIES = [
  { value: "Herren", label: "Herren" },
  { value: "Damen", label: "Damen" },
  { value: "Kinder", label: "Kinder" },
  { value: "Mixed", label: "Mixed" },
] as const;

/** Order / client type */
export const ORDER_TYPES = [
  { value: "guggenmusik", label: "Guggenmusik" },
  { value: "clique", label: "Cliquen" },
  { value: "verein", label: "Vereine" },
  { value: "familie", label: "Familie" },
  { value: "einzelperson", label: "Einzelpersonen" },
  { value: "schnitzelbaengg", label: "Schnitzelbängg" },
  { value: "other", label: "Sonstiges" },
] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number]["value"];
export type InternalStatus = (typeof INTERNAL_STATUSES)[number]["value"];
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number]["value"];

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export interface CreateProjectInput {
  title: string;
  description?: string | null;
  customerId?: string | null;
  groupId?: string | null;
  costumeCategory?: string | null;
  orderType?: string | null;
  quantity?: number;
  deadline?: Date | null;
  deliveryDate?: Date | null;
  priority?: string;
  notes?: string | null;
  internalNotes?: string | null;
}

export async function createProject(input: CreateProjectInput) {
  const project = await prisma.project.create({
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      customerId: emptyToNull(input.customerId),
      groupId: emptyToNull(input.groupId),
      costumeCategory: input.costumeCategory?.trim() || null,
      orderType: input.orderType?.trim() || null,
      quantity: input.quantity ?? 1,
      deadline: input.deadline ?? null,
      deliveryDate: input.deliveryDate ?? null,
      priority: input.priority ?? "normal",
      notes: input.notes?.trim() || null,
      internalNotes: input.internalNotes?.trim() || null,
    },
  });

  await prisma.conversation.create({ data: { projectId: project.id } });

  return project;
}

export async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      customer: true,
      group: { include: { members: { include: { customer: true } } } },
      tasks: { orderBy: { createdAt: "asc" } },
      files: { orderBy: { createdAt: "desc" } },
      measurements: {
        orderBy: { createdAt: "desc" },
        include: { customer: { select: { id: true, name: true, email: true } } },
      },
      conversations: {
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 50,
          },
        },
        take: 1,
      },
    },
  });
}

export interface ProjectFilters {
  search?: string;
  customerId?: string;
  groupId?: string;
  customerStatus?: string;
  internalStatus?: string;
  priority?: string;
  skip?: number;
  take?: number;
}

export async function listProjects(filters: ProjectFilters = {}) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { customer: { name: { contains: filters.search, mode: "insensitive" } } },
      { group: { name: { contains: filters.search, mode: "insensitive" } } },
    ];
  }
  if (filters.customerId) where.customerId = filters.customerId;
  if (filters.groupId) where.groupId = filters.groupId;
  if (filters.customerStatus) where.customerStatus = filters.customerStatus;
  if (filters.internalStatus) where.internalStatus = filters.internalStatus;
  if (filters.priority) where.priority = filters.priority;

  try {
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: filters.skip ?? 0,
        take: filters.take ?? 25,
        include: {
          customer: { select: { id: true, name: true, email: true } },
          group: { select: { id: true, name: true } },
          _count: { select: { tasks: true, files: true, measurements: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return { projects, total };
  } catch (error) {
    console.error("[crm] listProjects failed:", error);
    throw error;
  }
}

export async function updateProjectStatus(
  id: string,
  opts: { customerStatus?: string; internalStatus?: string }
) {
  return prisma.project.update({
    where: { id },
    data: {
      customerStatus: opts.customerStatus,
      internalStatus: opts.internalStatus,
    },
  });
}

export async function updateProject(
  id: string,
  data: Partial<CreateProjectInput> & {
    customerStatus?: string;
    internalStatus?: string;
    totalAmount?: number | null;
    paidAmount?: number | null;
    paymentStatus?: string;
  }
) {
  return prisma.project.update({
    where: { id },
    data: {
      title: data.title !== undefined ? data.title.trim() : undefined,
      description:
        data.description !== undefined ? data.description?.trim() || null : undefined,
      customerId: data.customerId !== undefined ? emptyToNull(data.customerId) : undefined,
      groupId: data.groupId !== undefined ? emptyToNull(data.groupId) : undefined,
      costumeCategory:
        data.costumeCategory !== undefined
          ? data.costumeCategory?.trim() || null
          : undefined,
      orderType:
        data.orderType !== undefined ? data.orderType?.trim() || null : undefined,
      quantity: data.quantity ?? undefined,
      deadline: data.deadline !== undefined ? data.deadline : undefined,
      deliveryDate: data.deliveryDate !== undefined ? data.deliveryDate : undefined,
      priority: data.priority ?? undefined,
      notes: data.notes !== undefined ? data.notes?.trim() || null : undefined,
      internalNotes:
        data.internalNotes !== undefined
          ? data.internalNotes?.trim() || null
          : undefined,
      customerStatus: data.customerStatus ?? undefined,
      internalStatus: data.internalStatus ?? undefined,
      totalAmount: data.totalAmount !== undefined ? data.totalAmount : undefined,
      paidAmount: data.paidAmount !== undefined ? data.paidAmount : undefined,
      paymentStatus: data.paymentStatus ?? undefined,
    },
  });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

export function formatCustomerStatus(status: string): string {
  return CUSTOMER_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function formatInternalStatus(status: string): string {
  return INTERNAL_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function formatOrderType(value: string | null | undefined): string {
  if (!value) return "—";
  return ORDER_TYPES.find((t) => t.value === value)?.label ?? value;
}
