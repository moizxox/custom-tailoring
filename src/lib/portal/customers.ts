import type { MeasurementData } from "@/types";

export type CostumeCategory = "Herren" | "Damen" | "Kinder";

export interface PortalCustomer {
  id: string;
  name: string;
  email: string;
  projectTitle: string;
  costumeCategory: CostumeCategory;
  /** Personal access code (sent after order confirmation) */
  accessCode: string;
}

/** Demo customers — replace with CRM / database in production */
export const PORTAL_CUSTOMERS: PortalCustomer[] = [
  {
    id: "cust-001",
    name: "Max Muster",
    email: "max@example.com",
    projectTitle: "Waggis Kostüm 2026",
    costumeCategory: "Herren",
    accessCode: "LANI2026",
  },
  {
    id: "cust-002",
    name: "Anna Beispiel",
    email: "anna@example.com",
    projectTitle: "Clique Kostüm Damen",
    costumeCategory: "Damen",
    accessCode: "BASel482",
  },
];

/** One-time private links — e.g. emailed after order */
export const PORTAL_ACCESS_TOKENS: Record<
  string,
  { customerId: string; expiresAt?: string }
> = {
  "demo-max-2026": { customerId: "cust-001" },
  "demo-anna-2026": { customerId: "cust-002" },
};

export function findCustomerByCredentials(
  email: string,
  accessCode: string
): PortalCustomer | null {
  const normalized = email.trim().toLowerCase();
  return (
    PORTAL_CUSTOMERS.find(
      (c) =>
        c.email.toLowerCase() === normalized &&
        c.accessCode.toUpperCase() === accessCode.trim().toUpperCase()
    ) ?? null
  );
}

export function findCustomerById(id: string): PortalCustomer | null {
  return PORTAL_CUSTOMERS.find((c) => c.id === id) ?? null;
}

export function resolveAccessToken(token: string): PortalCustomer | null {
  const entry = PORTAL_ACCESS_TOKENS[token];
  if (!entry) return null;
  if (entry.expiresAt && new Date(entry.expiresAt) < new Date()) return null;
  return findCustomerById(entry.customerId);
}

export interface MeasurementSubmission {
  customerId: string;
  projectTitle: string;
  costumeCategory: CostumeCategory;
  measurements: MeasurementData;
  photoNames: string[];
  submittedAt: string;
}

/** In-memory store for demo — use database in production */
const submissions: MeasurementSubmission[] = [];

export function saveMeasurementSubmission(submission: MeasurementSubmission) {
  submissions.push(submission);
  return submission;
}

export function getSubmissionsForCustomer(customerId: string) {
  return submissions.filter((s) => s.customerId === customerId);
}
