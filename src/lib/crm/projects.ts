import { prisma } from "@/lib/prisma";
import { emptyToNull } from "@/lib/crm/api";

// ─── Status constants (Wunschkleid-style customer workflow) ───────────────────

export const CUSTOMER_STATUSES = [
  { value: "request_received", label: "Anfrage erhalten" },
  { value: "design_clarification", label: "Design in Abklärung" },
  { value: "offer_created", label: "Offerte erstellt" },
  { value: "offer_accepted", label: "Offerte angenommen" },
  { value: "deposit_open", label: "Anzahlung offen" },
  { value: "deposit_received", label: "Anzahlung eingegangen" },
  { value: "measurements_recording", label: "Masse werden erfasst" },
  { value: "measurements_complete", label: "Masse vollständig" },
  { value: "fabrics_ordered", label: "Stoffe bestellt" },
  { value: "prototype_in_progress", label: "Prototyp in Arbeit" },
  { value: "prototype_approval", label: "Prototyp zur Freigabe" },
  { value: "production_started", label: "Produktion gestartet" },
  { value: "production_running", label: "Produktion läuft" },
  { value: "quality_control", label: "Qualitätskontrolle" },
  { value: "shipping_from_production", label: "Versand aus Produktion" },
  { value: "arrived_switzerland", label: "Eingetroffen in der Schweiz" },
  { value: "final_payment_open", label: "Restzahlung offen" },
  { value: "ready_for_pickup", label: "Abholbereit" },
  { value: "completed", label: "Abgeschlossen" },
  { value: "cancelled", label: "Storniert" },
  // legacy aliases kept for older records
  { value: "consultation_scheduled", label: "Beratung geplant" },
  { value: "design_approved", label: "Design bestätigt" },
  { value: "measurement_pending", label: "Massnahme ausstehend" },
  { value: "fitting_scheduled", label: "Anprobe geplant" },
  { value: "alterations", label: "Anpassungen" },
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

export const COSTUME_CATEGORIES = [
  { value: "Herren", label: "Herren" },
  { value: "Damen", label: "Damen" },
  { value: "Kinder", label: "Kinder" },
  { value: "Mixed", label: "Mixed" },
] as const;

export const ORDER_TYPES = [
  { value: "guggenmusik", label: "Guggenmusik" },
  { value: "clique", label: "Cliquen" },
  { value: "verein", label: "Vereine" },
  { value: "familie", label: "Familie" },
  { value: "einzelperson", label: "Einzelpersonen" },
  { value: "schnitzelbaengg", label: "Schnitzelbängg" },
  { value: "other", label: "Sonstiges" },
] as const;

export const PAYMENT_KINDS = [
  { value: "deposit", label: "Anzahlung" },
  { value: "partial", label: "Teilzahlung" },
  { value: "final", label: "Restzahlung" },
  { value: "refund", label: "Rückerstattung" },
  { value: "other", label: "Sonstiges" },
] as const;

export const RECLAMATION_STATUSES = [
  { value: "open", label: "Offen" },
  { value: "in_progress", label: "In Bearbeitung" },
  { value: "resolved", label: "Gelöst" },
  { value: "closed", label: "Geschlossen" },
] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number]["value"];
export type InternalStatus = (typeof INTERNAL_STATUSES)[number]["value"];
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number]["value"];

// ─── Project number ───────────────────────────────────────────────────────────

/** Generate next KSP{YY}-{####} number for the current year. */
export async function allocateProjectNumber(now = new Date()): Promise<string> {
  const yy = String(now.getFullYear()).slice(-2);
  const prefix = `KSP${yy}-`;
  const latest = await prisma.project.findFirst({
    where: { projectNumber: { startsWith: prefix } },
    orderBy: { projectNumber: "desc" },
    select: { projectNumber: true },
  });
  let next = 1;
  if (latest?.projectNumber) {
    const n = Number.parseInt(latest.projectNumber.slice(prefix.length), 10);
    if (Number.isFinite(n)) next = n + 1;
  }
  return `${prefix}${String(next).padStart(4, "0")}`;
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export interface CreateProjectInput {
  title: string;
  description?: string | null;
  customerId?: string | null;
  groupId?: string | null;
  season?: string | null;
  costumeCategory?: string | null;
  orderType?: string | null;
  quantity?: number;
  measurementDeadline1?: Date | null;
  measurementDeadline2?: Date | null;
  measurementDeadline3?: Date | null;
  fittingDate?: Date | null;
  deadline?: Date | null;
  deliveryDate?: Date | null;
  deliveryDate2?: Date | null;
  priority?: string;
  notes?: string | null;
  internalNotes?: string | null;
  contactPersonId?: string | null;
  contactPersonName?: string | null;
  contactPersonContact?: string | null;
  treasurerName?: string | null;
  treasurerContact?: string | null;
  treasurerNotes?: string | null;
  socialMediaName?: string | null;
  socialMediaContact?: string | null;
  socialMediaNotes?: string | null;
  hasMajorCostume?: boolean;
  majorCostumeNotes?: string | null;
  depositRequired?: number | null;
  totalAmount?: number | null;
  paidAmount?: number | null;
  paymentStatus?: string;
  archived?: boolean;
}

function trimOrNull(v: string | null | undefined) {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const s = v.trim();
  return s.length ? s : null;
}

export async function createProject(input: CreateProjectInput) {
  const projectNumber = await allocateProjectNumber();

  const project = await prisma.project.create({
    data: {
      projectNumber,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      customerId: emptyToNull(input.customerId),
      groupId: emptyToNull(input.groupId),
      season: input.season?.trim() || null,
      costumeCategory: input.costumeCategory?.trim() || null,
      orderType: input.orderType?.trim() || null,
      quantity: input.quantity ?? 1,
      measurementDeadline1: input.measurementDeadline1 ?? null,
      measurementDeadline2: input.measurementDeadline2 ?? null,
      measurementDeadline3: input.measurementDeadline3 ?? null,
      fittingDate: input.fittingDate ?? null,
      deadline: input.deadline ?? null,
      deliveryDate: input.deliveryDate ?? null,
      deliveryDate2: input.deliveryDate2 ?? null,
      priority: input.priority ?? "normal",
      notes: input.notes?.trim() || null,
      internalNotes: input.internalNotes?.trim() || null,
      contactPersonId: emptyToNull(input.contactPersonId),
      contactPersonName: input.contactPersonName?.trim() || null,
      contactPersonContact: input.contactPersonContact?.trim() || null,
      treasurerName: input.treasurerName?.trim() || null,
      treasurerContact: input.treasurerContact?.trim() || null,
      treasurerNotes: input.treasurerNotes?.trim() || null,
      socialMediaName: input.socialMediaName?.trim() || null,
      socialMediaContact: input.socialMediaContact?.trim() || null,
      socialMediaNotes: input.socialMediaNotes?.trim() || null,
      hasMajorCostume: input.hasMajorCostume ?? false,
      majorCostumeNotes: input.majorCostumeNotes?.trim() || null,
      depositRequired: input.depositRequired ?? null,
      totalAmount: input.totalAmount ?? null,
      paidAmount: input.paidAmount ?? null,
      paymentStatus: input.paymentStatus ?? "unpaid",
      archived: input.archived ?? false,
    },
  });

  await prisma.conversation.create({ data: { projectId: project.id } });
  await prisma.projectStatusHistory.create({
    data: {
      projectId: project.id,
      status: project.customerStatus,
      note: "Auftrag erstellt",
      changedBy: "admin",
    },
  });

  return project;
}

export async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      customer: true,
      contactPerson: { select: { id: true, name: true, email: true, phone: true } },
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
      statusHistory: { orderBy: { createdAt: "desc" }, take: 50 },
      payments: { orderBy: { paidAt: "desc" } },
      reclamations: { orderBy: { createdAt: "desc" } },
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
  season?: string;
  archived?: boolean;
  skip?: number;
  take?: number;
}

export async function listProjects(filters: ProjectFilters = {}) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { projectNumber: { contains: filters.search, mode: "insensitive" } },
      { season: { contains: filters.search, mode: "insensitive" } },
      { customer: { name: { contains: filters.search, mode: "insensitive" } } },
      { group: { name: { contains: filters.search, mode: "insensitive" } } },
    ];
  }
  if (filters.customerId) where.customerId = filters.customerId;
  if (filters.groupId) where.groupId = filters.groupId;
  if (filters.customerStatus) where.customerStatus = filters.customerStatus;
  if (filters.internalStatus) where.internalStatus = filters.internalStatus;
  if (filters.priority) where.priority = filters.priority;
  if (filters.season) where.season = filters.season;
  if (filters.archived !== undefined) where.archived = filters.archived;
  else where.archived = false;

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

export async function setProjectCustomerStatus(
  id: string,
  status: string,
  opts?: { note?: string | null; changedBy?: string | null },
) {
  const project = await prisma.project.update({
    where: { id },
    data: { customerStatus: status },
  });
  await prisma.projectStatusHistory.create({
    data: {
      projectId: id,
      status,
      note: opts?.note?.trim() || null,
      changedBy: opts?.changedBy?.trim() || "admin",
    },
  });
  return project;
}

export async function updateProjectStatus(
  id: string,
  opts: { customerStatus?: string; internalStatus?: string; note?: string | null },
) {
  const project = await prisma.project.update({
    where: { id },
    data: {
      customerStatus: opts.customerStatus,
      internalStatus: opts.internalStatus,
    },
  });
  if (opts.customerStatus) {
    await prisma.projectStatusHistory.create({
      data: {
        projectId: id,
        status: opts.customerStatus,
        note: opts.note?.trim() || null,
        changedBy: "admin",
      },
    });
  }
  return project;
}

export async function updateProject(
  id: string,
  data: Partial<CreateProjectInput> & {
    customerStatus?: string;
    internalStatus?: string;
    totalAmount?: number | null;
    paidAmount?: number | null;
    paymentStatus?: string;
    depositRequired?: number | null;
  },
) {
  return prisma.project.update({
    where: { id },
    data: {
      title: data.title !== undefined ? data.title.trim() : undefined,
      description:
        data.description !== undefined ? data.description?.trim() || null : undefined,
      customerId: data.customerId !== undefined ? emptyToNull(data.customerId) : undefined,
      groupId: data.groupId !== undefined ? emptyToNull(data.groupId) : undefined,
      season: data.season !== undefined ? trimOrNull(data.season) : undefined,
      costumeCategory:
        data.costumeCategory !== undefined
          ? data.costumeCategory?.trim() || null
          : undefined,
      orderType:
        data.orderType !== undefined ? data.orderType?.trim() || null : undefined,
      quantity: data.quantity ?? undefined,
      measurementDeadline1:
        data.measurementDeadline1 !== undefined ? data.measurementDeadline1 : undefined,
      measurementDeadline2:
        data.measurementDeadline2 !== undefined ? data.measurementDeadline2 : undefined,
      measurementDeadline3:
        data.measurementDeadline3 !== undefined ? data.measurementDeadline3 : undefined,
      fittingDate: data.fittingDate !== undefined ? data.fittingDate : undefined,
      deadline: data.deadline !== undefined ? data.deadline : undefined,
      deliveryDate: data.deliveryDate !== undefined ? data.deliveryDate : undefined,
      deliveryDate2: data.deliveryDate2 !== undefined ? data.deliveryDate2 : undefined,
      priority: data.priority ?? undefined,
      notes: data.notes !== undefined ? data.notes?.trim() || null : undefined,
      internalNotes:
        data.internalNotes !== undefined
          ? data.internalNotes?.trim() || null
          : undefined,
      contactPersonId:
        data.contactPersonId !== undefined ? emptyToNull(data.contactPersonId) : undefined,
      contactPersonName:
        data.contactPersonName !== undefined ? trimOrNull(data.contactPersonName) : undefined,
      contactPersonContact:
        data.contactPersonContact !== undefined
          ? trimOrNull(data.contactPersonContact)
          : undefined,
      treasurerName:
        data.treasurerName !== undefined ? trimOrNull(data.treasurerName) : undefined,
      treasurerContact:
        data.treasurerContact !== undefined ? trimOrNull(data.treasurerContact) : undefined,
      treasurerNotes:
        data.treasurerNotes !== undefined ? trimOrNull(data.treasurerNotes) : undefined,
      socialMediaName:
        data.socialMediaName !== undefined ? trimOrNull(data.socialMediaName) : undefined,
      socialMediaContact:
        data.socialMediaContact !== undefined
          ? trimOrNull(data.socialMediaContact)
          : undefined,
      socialMediaNotes:
        data.socialMediaNotes !== undefined ? trimOrNull(data.socialMediaNotes) : undefined,
      hasMajorCostume: data.hasMajorCostume ?? undefined,
      majorCostumeNotes:
        data.majorCostumeNotes !== undefined
          ? trimOrNull(data.majorCostumeNotes)
          : undefined,
      customerStatus: data.customerStatus ?? undefined,
      internalStatus: data.internalStatus ?? undefined,
      totalAmount: data.totalAmount !== undefined ? data.totalAmount : undefined,
      paidAmount: data.paidAmount !== undefined ? data.paidAmount : undefined,
      depositRequired:
        data.depositRequired !== undefined ? data.depositRequired : undefined,
      paymentStatus: data.paymentStatus ?? undefined,
      archived: data.archived ?? undefined,
    },
  });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

export async function archiveProject(id: string, archived = true) {
  return prisma.project.update({ where: { id }, data: { archived } });
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

export function formatMoney(amount: number | string | null | undefined): string {
  if (amount == null || amount === "") return "0.00";
  const n = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}
