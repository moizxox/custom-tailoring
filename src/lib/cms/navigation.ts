import { prisma } from "@/lib/db/prisma";
import { NAV_LINKS } from "@/lib/site-content";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  openInNewTab?: boolean;
}

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export interface FooterContent {
  ctaHeading: string;
  ctaSubheading: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  ctaSecondaryLabel: string;
  ctaSecondaryUrl: string;
  copyrightText: string;
  columns: FooterColumn[];
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
  copyrightText: "Kostümschneiderei. Alle Rechte vorbehalten.",
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
