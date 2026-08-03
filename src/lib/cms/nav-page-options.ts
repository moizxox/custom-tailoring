import { PAGE_SCHEMAS } from "@/lib/cms/page-schemas";

export interface NavPageOption {
  href: string;
  /** Friendly label shown in the admin select */
  label: string;
  group: "Seiten" | "Eigene Seiten" | "Weitere";
}

/** German display names for built-in CMS pages (schema labels are often English). */
const BUILTIN_LABEL_DE: Record<string, string> = {
  home: "Startseite",
  "ueber-uns": "Über uns",
  kontakt: "Kontakt",
  service: "Service / Leistungen",
  galerie: "Galerie",
  atelier: "Atelier",
  termin: "Termin",
  massfertigung: "Massfertigung",
  stoffe: "Stoffe",
  kostuemveredelung: "Kostümveredelung",
  shop: "Katalog",
  journal: "Journal",
  faqs: "FAQs",
  impressum: "Impressum",
  agb: "AGB",
  datenschutz: "Datenschutz",
  widerruf: "Widerruf",
  "shop-bedingungen": "Shop-Bedingungen",
  "massen-ohne-termin": "Massen ohne Termin",
  leistungen: "Leistungen",
};

const EXTRA_LINKS: NavPageOption[] = [
  {
    href: "/kundenbereich/login",
    label: "Kundenbereich (Login)",
    group: "Weitere",
  },
  {
    href: "/kundenbereich",
    label: "Kundenbereich",
    group: "Weitere",
  },
  {
    href: "/katalog",
    label: "Katalog (Kurz-URL)",
    group: "Weitere",
  },
  {
    href: "/termin#massen-ohne-termin",
    label: "Termin → Time Slots Abschnitt",
    group: "Weitere",
  },
  {
    href: "/ueber-uns#team",
    label: "Über uns → Team",
    group: "Weitere",
  },
];

export interface CustomPageNavSource {
  title: string;
  slug: string;
  published?: boolean;
  navLabel?: string | null;
}

/** Flat list of selectable site pages for navigation / footer link pickers. */
export function buildNavPageOptions(customPages: CustomPageNavSource[] = []): NavPageOption[] {
  const builtins: NavPageOption[] = PAGE_SCHEMAS.map((page) => ({
    href: page.path,
    label: BUILTIN_LABEL_DE[page.slug] ?? page.label,
    group: "Seiten" as const,
  }));

  // Ensure legal / seasonal routes exist even if not in PAGE_SCHEMAS
  const builtinHrefs = new Set(builtins.map((o) => o.href));
  for (const extra of [
    { href: "/massen-ohne-termin", label: "Massen ohne Termin", group: "Seiten" as const },
    { href: "/agb", label: "AGB", group: "Seiten" as const },
    { href: "/datenschutz", label: "Datenschutz", group: "Seiten" as const },
    { href: "/widerruf", label: "Widerruf", group: "Seiten" as const },
    { href: "/shop-bedingungen", label: "Shop-Bedingungen", group: "Seiten" as const },
  ]) {
    if (!builtinHrefs.has(extra.href)) builtins.push(extra);
  }

  const customs: NavPageOption[] = customPages
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title, "de"))
    .map((page) => ({
      href: `/seite/${page.slug}`,
      label: `${page.navLabel?.trim() || page.title}${page.published === false ? " (Entwurf)" : ""}`,
      group: "Eigene Seiten" as const,
    }));

  return [...builtins, ...customs, ...EXTRA_LINKS];
}

export function findNavPageOption(
  href: string,
  options: NavPageOption[],
): NavPageOption | undefined {
  const normalized = href.trim();
  return options.find((o) => o.href === normalized);
}
