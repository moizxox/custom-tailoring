import { emptyToNull, parseOptionalDate } from "@/lib/crm/api";
import type { CreateProjectInput } from "@/lib/crm/projects";

function optNum(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function optStr(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return String(value);
}

function optBool(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  return value === true || value === "true" || value === 1 || value === "1";
}

/** Map a JSON body to CreateProjectInput / update fields. */
export function parseProjectBody(body: Record<string, unknown>): Partial<CreateProjectInput> & {
  customerStatus?: string;
  internalStatus?: string;
  paymentStatus?: string;
} {
  return {
    title: typeof body.title === "string" ? body.title : undefined,
    description: optStr(body.description),
    customerId: body.customerId !== undefined ? emptyToNull(body.customerId) : undefined,
    groupId: body.groupId !== undefined ? emptyToNull(body.groupId) : undefined,
    season: optStr(body.season),
    costumeCategory: optStr(body.costumeCategory),
    orderType: optStr(body.orderType),
    quantity:
      body.quantity !== undefined
        ? typeof body.quantity === "number"
          ? body.quantity
          : Number(body.quantity) || 1
        : undefined,
    measurementDeadline1: parseOptionalDate(body.measurementDeadline1),
    measurementDeadline2: parseOptionalDate(body.measurementDeadline2),
    measurementDeadline3: parseOptionalDate(body.measurementDeadline3),
    fittingDate: parseOptionalDate(body.fittingDate),
    deadline: parseOptionalDate(body.deadline),
    deliveryDate: parseOptionalDate(body.deliveryDate),
    deliveryDate2: parseOptionalDate(body.deliveryDate2),
    priority: typeof body.priority === "string" ? body.priority : undefined,
    notes: optStr(body.notes),
    internalNotes: optStr(body.internalNotes),
    contactPersonId:
      body.contactPersonId !== undefined ? emptyToNull(body.contactPersonId) : undefined,
    contactPersonName: optStr(body.contactPersonName),
    contactPersonContact: optStr(body.contactPersonContact),
    treasurerName: optStr(body.treasurerName),
    treasurerContact: optStr(body.treasurerContact),
    treasurerNotes: optStr(body.treasurerNotes),
    socialMediaName: optStr(body.socialMediaName),
    socialMediaContact: optStr(body.socialMediaContact),
    socialMediaNotes: optStr(body.socialMediaNotes),
    hasMajorCostume: optBool(body.hasMajorCostume),
    majorCostumeNotes: optStr(body.majorCostumeNotes),
    depositRequired: optNum(body.depositRequired),
    totalAmount: optNum(body.totalAmount),
    paidAmount: optNum(body.paidAmount),
    paymentStatus: typeof body.paymentStatus === "string" ? body.paymentStatus : undefined,
    customerStatus: typeof body.customerStatus === "string" ? body.customerStatus : undefined,
    internalStatus: typeof body.internalStatus === "string" ? body.internalStatus : undefined,
    archived: optBool(body.archived),
  };
}
