// ─────────────────────────────────────────────────────────────────────────────
// WordPress REST API base types
// ─────────────────────────────────────────────────────────────────────────────

export interface WpImage {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface WpPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: WpImage | null;
  acf: Record<string, unknown>;
}

export interface WpProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  regularPrice: string;
  salePrice: string;
  images: WpImage[];
  categories: { id: number; name: string; slug: string }[];
  inStock: boolean;
}

export interface WpPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  featuredImage: WpImage | null;
  categories: { id: number; name: string; slug: string }[];
}

export interface WpMenu {
  id: number;
  name: string;
  items: WpMenuItem[];
}

export interface WpMenuItem {
  id: number;
  title: string;
  url: string;
  slug: string;
  children: WpMenuItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ACF Block field shapes
// Each interface maps 1:1 to an ACF flexible content block in WordPress.
// Field names use snake_case to match ACF output exactly.
// ─────────────────────────────────────────────────────────────────────────────

/** ACF: hero block */
export interface AcfHero {
  acf_fc_layout: "hero";
  eyebrow_text: string;           // e.g. "Ihre Kostüme. Unser Handwerk."
  heading: string;                // Main H1 text
  heading_accent: string;         // Word(s) to render in periwinkle italic
  subtext: string;                // Paragraph below heading
  cta_primary_label: string;
  cta_primary_url: string;
  cta_secondary_label?: string;
  cta_secondary_url?: string;
  background_image?: WpImage;
  show_contact_form: boolean;
  badges: AcfBadge[];
}

export interface AcfBadge {
  icon_slug: string;              // SVG filename in /public/icons/sewing/
  label: string;
}

/** ACF: services grid block */
export interface AcfServicesGrid {
  acf_fc_layout: "services_grid";
  section_label?: string;
  heading: string;
  heading_accent?: string;
  subtext?: string;
  services: AcfServiceItem[];
  show_cta: boolean;
  cta_label?: string;
  cta_url?: string;
}

export interface AcfServiceItem {
  title: string;
  description: string;
  icon_slug: string;              // SVG filename in /public/icons/sewing/
  link_url?: string;
}

/** ACF: process steps block */
export interface AcfProcess {
  acf_fc_layout: "process";
  section_label?: string;
  heading: string;
  heading_accent?: string;
  steps: AcfProcessStep[];
}

export interface AcfProcessStep {
  number: string;                 // "01", "02", ...
  title: string;
  description: string;
}

/** ACF: gallery preview block */
export interface AcfGalleryPreview {
  acf_fc_layout: "gallery_preview";
  section_label?: string;
  heading: string;
  heading_accent?: string;
  subtext?: string;
  items: AcfGalleryItem[];
  show_cta: boolean;
  cta_label?: string;
  cta_url?: string;
}

export interface AcfGalleryItem {
  image: WpImage;
  category: string;              // e.g. "Guggenmusik", "Einzelperson"
  title?: string;
}

/** ACF: about/CTA band block */
export interface AcfAboutBand {
  acf_fc_layout: "about_band";
  section_label?: string;
  heading: string;
  heading_accent?: string;
  body_text: string;
  cta_label: string;
  cta_url: string;
  cta_secondary_label?: string;
  cta_secondary_url?: string;
  usps: AcfUsp[];
}

export interface AcfUsp {
  icon_slug: string;
  title: string;
  description: string;
}

/** ACF: text + image split block */
export interface AcfSplit {
  acf_fc_layout: "split";
  section_label?: string;
  heading: string;
  heading_accent?: string;
  body_text: string;
  image: WpImage;
  image_position: "left" | "right";
  cta_label?: string;
  cta_url?: string;
}

/** ACF: testimonials block */
export interface AcfTestimonials {
  acf_fc_layout: "testimonials";
  section_label?: string;
  heading: string;
  items: AcfTestimonialItem[];
}

export interface AcfTestimonialItem {
  quote: string;
  author: string;
  role?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  avatar?: WpImage;
}

/** Union of all ACF block types — used in FlexibleContent renderer */
export type AcfBlock =
  | AcfHero
  | AcfServicesGrid
  | AcfProcess
  | AcfGalleryPreview
  | AcfAboutBand
  | AcfSplit
  | AcfTestimonials;

// ─────────────────────────────────────────────────────────────────────────────
// Site navigation
// ─────────────────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
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
