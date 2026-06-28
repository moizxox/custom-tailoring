/**
 * Defines which sections are editable for each page.
 * The `fields` array maps section data keys to editor field types.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "image"
  | "url"
  | "array";

export interface CmsField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
}

export interface CmsSection {
  key: string;
  label: string;
  description?: string;
  fields: CmsField[];
}

export interface CmsPageSchema {
  slug: string;
  label: string;
  icon: string;
  path: string;
  sections: CmsSection[];
}

export const PAGE_SCHEMAS: CmsPageSchema[] = [
  {
    slug: "home",
    label: "Startseite",
    icon: "🏠",
    path: "/",
    sections: [
      {
        key: "hero",
        label: "Hero-Bereich",
        description: "Hauptüberschrift und Einstiegstext der Startseite",
        fields: [
          { key: "eyebrow", label: "Eyebrow-Text", type: "text", placeholder: "Ihre Kostüme. Unser Handwerk." },
          { key: "heading", label: "Hauptüberschrift", type: "text" },
          { key: "headingAccent", label: "Akzent-Wort (farbig)", type: "text", hint: "Wort(e) die farbig hervorgehoben werden" },
          { key: "subtext", label: "Einleitungstext", type: "textarea" },
          { key: "ctaPrimaryLabel", label: "Button 1 — Text", type: "text" },
          { key: "ctaPrimaryUrl", label: "Button 1 — Link", type: "url" },
          { key: "ctaSecondaryLabel", label: "Button 2 — Text", type: "text" },
          { key: "ctaSecondaryUrl", label: "Button 2 — Link", type: "url" },
        ],
      },
    ],
  },
  {
    slug: "ueber-uns",
    label: "Über uns",
    icon: "👥",
    path: "/ueber-uns",
    sections: [
      {
        key: "hero",
        label: "Hero-Bereich",
        fields: [
          { key: "heading", label: "Überschrift", type: "text" },
          { key: "subtext", label: "Einleitungstext", type: "textarea" },
        ],
      },
      {
        key: "team",
        label: "Team",
        description: "Teammitglieder (JSON-Array)",
        fields: [
          { key: "members", label: "Teammitglieder", type: "array", hint: "Jedes Mitglied: name, role, bio" },
        ],
      },
    ],
  },
  {
    slug: "kontakt",
    label: "Kontakt",
    icon: "📬",
    path: "/kontakt",
    sections: [
      {
        key: "hero",
        label: "Hero-Bereich",
        fields: [
          { key: "heading", label: "Überschrift", type: "text" },
          { key: "subtext", label: "Untertext", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "service",
    label: "Service",
    icon: "✂️",
    path: "/service",
    sections: [
      {
        key: "hero",
        label: "Hero-Bereich",
        fields: [
          { key: "heading", label: "Überschrift", type: "text" },
          { key: "subtext", label: "Untertext", type: "textarea" },
        ],
      },
      {
        key: "offerings",
        label: "Leistungen",
        description: "Liste der Serviceleistungen",
        fields: [
          { key: "items", label: "Leistungen", type: "array" },
        ],
      },
    ],
  },
  {
    slug: "galerie",
    label: "Galerie",
    icon: "🖼️",
    path: "/galerie",
    sections: [
      {
        key: "hero",
        label: "Hero-Bereich",
        fields: [
          { key: "heading", label: "Überschrift", type: "text" },
          { key: "subtext", label: "Untertext", type: "textarea" },
        ],
      },
      {
        key: "gallery",
        label: "Galerie-Bilder",
        description: "Bilder und Kategorien der Galerie",
        fields: [
          { key: "items", label: "Galerie-Einträge", type: "array" },
        ],
      },
    ],
  },
  {
    slug: "atelier",
    label: "Atelier",
    icon: "🏛️",
    path: "/atelier",
    sections: [
      {
        key: "hero",
        label: "Hero-Bereich",
        fields: [
          { key: "heading", label: "Überschrift", type: "text" },
          { key: "subtext", label: "Untertext", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "termin",
    label: "Terminbuchung",
    icon: "📅",
    path: "/termin",
    sections: [
      {
        key: "hero",
        label: "Hero-Bereich",
        fields: [
          { key: "heading", label: "Überschrift", type: "text" },
          { key: "subtext", label: "Untertext", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "massfertigung",
    label: "Massfertigung",
    icon: "📏",
    path: "/massfertigung",
    sections: [
      {
        key: "hero",
        label: "Hero-Bereich",
        fields: [
          { key: "heading", label: "Überschrift", type: "text" },
          { key: "subtext", label: "Untertext", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "stoffe",
    label: "Stoffe & Materialien",
    icon: "🧵",
    path: "/stoffe",
    sections: [
      {
        key: "hero",
        label: "Hero-Bereich",
        fields: [
          { key: "heading", label: "Überschrift", type: "text" },
          { key: "subtext", label: "Untertext", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "kostuemveredelung",
    label: "Kostümveredelung",
    icon: "✨",
    path: "/kostuemveredelung",
    sections: [
      {
        key: "hero",
        label: "Hero-Bereich",
        fields: [
          { key: "heading", label: "Überschrift", type: "text" },
          { key: "subtext", label: "Untertext", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "impressum",
    label: "Impressum",
    icon: "📄",
    path: "/impressum",
    sections: [
      {
        key: "company",
        label: "Firmendaten",
        fields: [
          { key: "name", label: "Firmenname", type: "text" },
          { key: "owner", label: "Inhaberin", type: "text" },
          { key: "uid", label: "UID", type: "text" },
          { key: "phone", label: "Telefon", type: "text" },
          { key: "email", label: "E-Mail", type: "text" },
        ],
      },
    ],
  },
];

export function getPageSchema(slug: string): CmsPageSchema | undefined {
  return PAGE_SCHEMAS.find((p) => p.slug === slug);
}
