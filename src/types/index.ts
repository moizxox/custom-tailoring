// ─── WordPress REST API types ────────────────────────────────────────────────

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

// ─── Site-level types ────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: WpImage | null;
  bio: string;
}

export interface GalleryItem {
  id: string;
  image: WpImage;
  category: string;
  title: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  quote: string;
  rating: number;
}

// ─── Customer Portal types (Phase 2 placeholder) ─────────────────────────────

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

export interface Document {
  id: string;
  name: string;
  type: "Angebot" | "Rechnung" | "Massblatt" | "Sonstiges";
  url: string;
  uploadedAt: string;
  projectId: string;
}

export interface Measurement {
  id: string;
  customerId: string;
  projectId: string;
  data: MeasurementData;
  createdAt: string;
}

export interface MeasurementData {
  brust: number;
  taille: number;
  huefte: number;
  schulterbreite: number;
  armlaenge: number;
  rueckenlaenge: number;
  koerpergroesse: number;
  notes?: string;
}
