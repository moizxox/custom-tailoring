import { prisma } from "@/lib/db/prisma";
import { DEFAULT_LEGAL_LINKS } from "@/lib/cms/extra-defaults";
import { NAV_LINKS } from "@/lib/site-content";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  openInNewTab?: boolean;
  /** When true, item stays in CMS but is omitted from the public Navbar. */
  hidden?: boolean;
  /** Nested submenu items — drag an item under another in the CMS to nest. */
  children?: NavItem[];
}

export interface FooterLocation {
  name: string;
  address: string;
  city: string;
}

export interface FooterContent {
  /* CTA banner */
  ctaHeading: string;
  ctaSubheading: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  ctaSecondaryLabel: string;
  ctaSecondaryUrl: string;
  /* Brand */
  brandName: string;
  brandAccent: string;
  brandSubline: string;
  /* Contact */
  phone: string;
  phoneHref: string;
  email: string;
  hours: string;
  /* Social */
  instagramUrl: string;
  facebookUrl: string;
  /* Locations */
  locations: FooterLocation[];
  /* Link columns */
  columns: { heading: string; links: { label: string; href: string }[] }[];
  legalLinks: { label: string; href: string }[];
  /* Bottom */
  copyrightText: string;
}

export const DEFAULT_NAV_ITEMS: NavItem[] = NAV_LINKS.map((l, i) => ({
  id: String(i + 1),
  label: l.label,
  href: l.href,
  openInNewTab: false,
}));

export const DEFAULT_FOOTER: FooterContent = {
  ctaHeading: "Ihr Traumkostüm beginnt hier.",
  ctaSubheading: "Handwerk. Individualität. Fasnacht.",
  ctaPrimaryLabel: "Termin buchen",
  ctaPrimaryUrl: "/termin",
  ctaSecondaryLabel: "Anfrage senden",
  ctaSecondaryUrl: "/kontakt",
  brandName: "Kostüm",
  brandAccent: "schneiderei",
  brandSubline: "Linvara AG",
  phone: "079 654 66 55",
  phoneHref: "tel:+41796546655",
  email: "info@kostuem-schneiderei.ch",
  hours: "Termine nur nach Vereinbarung",
  instagramUrl: "",
  facebookUrl: "",
  locations: [
    { name: "Linvara AG Pratteln", address: "Hohenrainstrasse 26c", city: "4133 Pratteln" },
    { name: "Linvara AG Therwil", address: "Reinacherstrasse 5", city: "4106 Therwil" },
  ],
  columns: [
    {
      heading: "Navigation",
      links: [
        { label: "Katalog", href: "/shop" },
        { label: "Galerie", href: "/galerie" },
        { label: "Mass Nehmen", href: "/massfertigung" },
        { label: "Kostümveredelung", href: "/kostuemveredelung" },
        { label: "Team", href: "/ueber-uns#team" },
        { label: "Kontakt", href: "/kontakt" },
      ],
    },
    {
      heading: "Service",
      links: [
        { label: "Termin buchen", href: "/termin" },
        { label: "Massen ohne Termin", href: "/massen-ohne-termin" },
        { label: "Time Slots", href: "/termin#massen-ohne-termin" },
        { label: "Leistungen", href: "/service" },
        { label: "FAQs", href: "/faqs" },
        { label: "Atelier", href: "/atelier" },
        { label: "Kundenbereich", href: "/kundenbereich/login" },
      ],
    },
  ],
  legalLinks: DEFAULT_LEGAL_LINKS,
  copyrightText: "Kostümschneiderei. Alle Rechte vorbehalten.",
};

/** Normalize legacy flat nav + nested children into a clean tree (max depth 1). */
export function normalizeNavItems(raw: unknown): NavItem[] {
  if (!Array.isArray(raw) || raw.length === 0) return DEFAULT_NAV_ITEMS;

  const normalized: NavItem[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as Record<string, unknown>;
    const id =
      typeof item.id === "string" && item.id
        ? item.id
        : Math.random().toString(36).slice(2, 9);
    const label = typeof item.label === "string" ? item.label : "";
    const href = typeof item.href === "string" ? item.href : "/";
    if (!label.trim()) continue;

    const children: NavItem[] = [];
    const childrenRaw = Array.isArray(item.children) ? item.children : [];
    for (const child of childrenRaw) {
      if (!child || typeof child !== "object") continue;
      const c = child as Record<string, unknown>;
      const cLabel = typeof c.label === "string" ? c.label : "";
      if (!cLabel.trim()) continue;
      children.push({
        id:
          typeof c.id === "string" && c.id
            ? c.id
            : Math.random().toString(36).slice(2, 9),
        label: cLabel,
        href: typeof c.href === "string" ? c.href : "/",
        openInNewTab: Boolean(c.openInNewTab),
        hidden: Boolean(c.hidden),
      });
    }

    normalized.push({
      id,
      label,
      href,
      openInNewTab: Boolean(item.openInNewTab),
      hidden: Boolean(item.hidden),
      ...(children.length > 0 ? { children } : {}),
    });
  }

  return normalized;
}

/** Public Navbar: drop hidden items (and hidden children). */
export function filterVisibleNavItems(items: NavItem[]): NavItem[] {
  return items
    .filter((item) => !item.hidden)
    .map((item) => {
      const children = item.children?.filter((c) => !c.hidden);
      if (!children?.length) {
        const { children: _drop, ...rest } = item;
        void _drop;
        return rest;
      }
      return { ...item, children };
    });
}

export async function getNavItems(): Promise<NavItem[]> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key: "navigation" } });
    if (row && Array.isArray(row.value)) return normalizeNavItems(row.value);
  } catch {}
  return DEFAULT_NAV_ITEMS;
}

export async function getFooterContent(): Promise<FooterContent> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key: "footer" } });
    if (row && typeof row.value === "object" && row.value !== null) {
      return { ...DEFAULT_FOOTER, ...(row.value as Partial<FooterContent>) };
    }
  } catch {}
  return DEFAULT_FOOTER;
}
