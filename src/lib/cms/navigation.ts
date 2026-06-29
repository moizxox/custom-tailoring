import { prisma } from "@/lib/db/prisma";
import { NAV_LINKS } from "@/lib/site-content";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  openInNewTab?: boolean;
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
  brandSubline: "Pratteln & Therwil",
  phone: "079 654 66 55",
  phoneHref: "tel:+41796546655",
  email: "info@kostuem-schneiderei.ch",
  hours: "Termine nur nach Vereinbarung",
  instagramUrl: "https://instagram.com",
  facebookUrl: "https://facebook.com",
  locations: [
    { name: "Pratteln", address: "Hohenrainstrasse 26c", city: "4133 Pratteln" },
    { name: "Therwil", address: "Reinacherstrasse 5", city: "4106 Therwil" },
  ],
  columns: [
    {
      heading: "Navigation",
      links: [
        { label: "Shop", href: "/shop" },
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
        { label: "Leistungen", href: "/service" },
        { label: "FAQs", href: "/faqs" },
        { label: "Atelier", href: "/atelier" },
      ],
    },
  ],
  copyrightText: "Kostümschneiderei. Alle Rechte vorbehalten.",
};

export async function getNavItems(): Promise<NavItem[]> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key: "navigation" } });
    if (row && Array.isArray(row.value)) return row.value as unknown as NavItem[];
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
