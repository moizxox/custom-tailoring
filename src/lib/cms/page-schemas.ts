/**
 * Defines which sections are editable for each page.
 * Labels are in English (admin UI). Content you enter stays in German for the public site.
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
    label: "Home",
    icon: "🏠",
    path: "/",
    sections: [
      {
        key: "hero",
        label: "Hero section",
        description: "Main headline and intro text on the homepage",
        fields: [
          { key: "eyebrow", label: "Eyebrow text", type: "text", placeholder: "Ihre Kostüme. Unser Handwerk." },
          { key: "heading", label: "Main heading", type: "text" },
          { key: "headingAccent", label: "Accent word(s)", type: "text", hint: "Word(s) highlighted in color" },
          { key: "subtext", label: "Intro text", type: "textarea" },
          { key: "ctaPrimaryLabel", label: "Button 1 — label", type: "text" },
          { key: "ctaPrimaryUrl", label: "Button 1 — link", type: "url" },
          { key: "ctaSecondaryLabel", label: "Button 2 — label", type: "text" },
          { key: "ctaSecondaryUrl", label: "Button 2 — link", type: "url" },
        ],
      },
    ],
  },
  {
    slug: "ueber-uns",
    label: "About us",
    icon: "👥",
    path: "/ueber-uns",
    sections: [
      {
        key: "hero",
        label: "Hero section",
        fields: [
          { key: "heading", label: "Heading", type: "text" },
          { key: "subtext", label: "Intro text", type: "textarea" },
        ],
      },
      {
        key: "team",
        label: "Team",
        description: "Team members (JSON array)",
        fields: [
          { key: "members", label: "Team members", type: "array", hint: "Each member: name, role, bio" },
        ],
      },
    ],
  },
  {
    slug: "kontakt",
    label: "Contact",
    icon: "📬",
    path: "/kontakt",
    sections: [
      {
        key: "hero",
        label: "Hero section",
        fields: [
          { key: "heading", label: "Heading", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "service",
    label: "Services",
    icon: "✂️",
    path: "/service",
    sections: [
      {
        key: "hero",
        label: "Hero section",
        fields: [
          { key: "heading", label: "Heading", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
        ],
      },
      {
        key: "offerings",
        label: "Services list",
        description: "List of service offerings",
        fields: [
          { key: "items", label: "Services", type: "array" },
        ],
      },
    ],
  },
  {
    slug: "galerie",
    label: "Gallery",
    icon: "🖼️",
    path: "/galerie",
    sections: [
      {
        key: "hero",
        label: "Hero section",
        fields: [
          { key: "heading", label: "Heading", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
        ],
      },
      {
        key: "gallery",
        label: "Gallery images",
        description: "Gallery images and categories",
        fields: [
          { key: "items", label: "Gallery entries", type: "array" },
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
        label: "Hero section",
        fields: [
          { key: "heading", label: "Heading", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "termin",
    label: "Appointments",
    icon: "📅",
    path: "/termin",
    sections: [
      {
        key: "hero",
        label: "Hero section",
        fields: [
          { key: "heading", label: "Heading", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "massfertigung",
    label: "Custom tailoring",
    icon: "📏",
    path: "/massfertigung",
    sections: [
      {
        key: "hero",
        label: "Hero section",
        fields: [
          { key: "heading", label: "Heading", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "stoffe",
    label: "Fabrics & materials",
    icon: "🧵",
    path: "/stoffe",
    sections: [
      {
        key: "hero",
        label: "Hero section",
        fields: [
          { key: "heading", label: "Heading", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "kostuemveredelung",
    label: "Costume finishing",
    icon: "✨",
    path: "/kostuemveredelung",
    sections: [
      {
        key: "hero",
        label: "Hero section",
        fields: [
          { key: "heading", label: "Heading", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "impressum",
    label: "Legal notice",
    icon: "📄",
    path: "/impressum",
    sections: [
      {
        key: "company",
        label: "Company details",
        fields: [
          { key: "name", label: "Company name", type: "text" },
          { key: "owner", label: "Owner", type: "text" },
          { key: "uid", label: "UID", type: "text" },
          { key: "phone", label: "Phone", type: "text" },
          { key: "email", label: "Email", type: "text" },
        ],
      },
    ],
  },
];

export function getPageSchema(slug: string): CmsPageSchema | undefined {
  return PAGE_SCHEMAS.find((p) => p.slug === slug);
}
