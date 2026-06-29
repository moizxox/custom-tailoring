// ─────────────────────────────────────────────────────────────────────────────
// CMS types
// ─────────────────────────────────────────────────────────────────────────────

export interface CmsImage {
  url: string;
  alt: string;
  publicId?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Site navigation
// ─────────────────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Section content shapes (used by page editors and getCmsContent)
// ─────────────────────────────────────────────────────────────────────────────

export interface HeroContent {
  eyebrow: string;
  heading: string;
  headingAccent: string;
  subtext: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryUrl?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  icon: string;
  bio: string;
}

export interface GalleryItem {
  src: string;
  category: string;
  title?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  linkUrl?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Customer Portal types (Phase 2 — CRM)
// ─────────────────────────────────────────────────────────────────────────────

export interface CustomerProject {
  id: string;
  title: string;
  customer: string;
  status: ProjectStatus;
  season: string;
  costumeType: "Einzel" | "Gruppe" | "Clique";
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus =
  | "Anfrage"
  | "Beratung"
  | "Konzept"
  | "Anfertigung"
  | "Anprobe"
  | "Fertig"
  | "Abgeschlossen";

export interface CustomerDocument {
  id: string;
  name: string;
  type: "Angebot" | "Rechnung" | "Massblatt" | "Foto" | "Sonstiges";
  url: string;
  uploadedAt: string;
  projectId: string;
}

export interface MeasurementForm {
  id: string;
  customerId: string;
  projectId: string;
  data: MeasurementData;
  createdAt: string;
}

/** Letter-coded values (A, B, C1, O, K1a, …) matching Massblatt diagrams */
export interface MeasurementData {
  values: Record<string, number>;
  notes?: string;
}
