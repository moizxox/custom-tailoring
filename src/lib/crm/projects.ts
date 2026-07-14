import { prisma } from "@/lib/prisma";

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

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number]["value"];
export type InternalStatus = (typeof INTERNAL_STATUSES)[number]["value"];
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number]["value"];

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export interface CreateProjectInput {
  title: string;
  description?: string;
  customerId?: string;
  groupId?: string;
  costumeCategory?: string;
  quantity?: number;
  deadline?: Date;
  priority?: string;
  internalNotes?: string;
}

export async function createProject(input: CreateProjectInput) {
  const project = await prisma.project.create({
    data: {
      title: input.title.trim(),
      description: input.description?.trim() ?? null,
      customerId: input.customerId ?? null,
      groupId: input.groupId ?? null,
      costumeCategory: input.costumeCategory ?? null,
      quantity: input.quantity ?? 1,
      deadline: input.deadline ?? null,
      priority: input.priority ?? "normal",
      internalNotes: input.internalNotes?.trim() ?? null,
    },
  });

  // Auto-create a conversation for every new project
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
      measurements: { orderBy: { createdAt: "desc" } },
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
    totalAmount?: number;
    paidAmount?: number;
    paymentStatus?: string;
  }
) {
  return prisma.project.update({
    where: { id },
    data: {
      title: data.title?.trim(),
      description: data.description?.trim() ?? undefined,
      costumeCategory: data.costumeCategory ?? undefined,
      quantity: data.quantity ?? undefined,
      deadline: data.deadline ?? undefined,
      priority: data.priority ?? undefined,
      internalNotes: data.internalNotes?.trim() ?? undefined,
      customerStatus: data.customerStatus ?? undefined,
      internalStatus: data.internalStatus ?? undefined,
      totalAmount: data.totalAmount != null ? data.totalAmount : undefined,
      paidAmount: data.paidAmount != null ? data.paidAmount : undefined,
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
