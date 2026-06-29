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
  | "array"
  | "select"
  | "number"
  | "color"
  | "icon"
  | "toggle";

export interface CmsFieldOption {
  value: string;
  label: string;
}

export interface CmsField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
  options?: CmsFieldOption[];
}

const HEADING_TAG_FIELD: CmsField = {
  key: "headingTag",
  label: "Heading tag",
  type: "select",
  options: [
    { value: "h1", label: "H1" },
    { value: "h2", label: "H2" },
    { value: "h3", label: "H3" },
    { value: "h4", label: "H4" },
  ],
  hint: "HTML heading level for SEO",
};

function pageHeroFields(): CmsField[] {
  return [
    { key: "label", label: "Section label", type: "text" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "headingAccent", label: "Accent word(s)", type: "text", hint: "Word(s) highlighted in color" },
    { key: "subtext", label: "Subtext", type: "textarea" },
    HEADING_TAG_FIELD,
  ];
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
          HEADING_TAG_FIELD,
        ],
      },
      {
        key: "servicesGrid",
        label: "Services section",
        fields: [
          { key: "section_label", label: "Section label", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          { key: "heading_accent", label: "Accent word(s)", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
          { key: "cta_label", label: "CTA label", type: "text" },
          { key: "cta_url", label: "CTA link", type: "url" },
        ],
      },
      {
        key: "process",
        label: "Process section",
        fields: [
          { key: "section_label", label: "Section label", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          { key: "heading_accent", label: "Accent word(s)", type: "text" },
        ],
      },
      {
        key: "galleryPreview",
        label: "Gallery preview",
        fields: [
          { key: "section_label", label: "Section label", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          { key: "heading_accent", label: "Accent word(s)", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
          { key: "cta_label", label: "CTA label", type: "text" },
          { key: "cta_url", label: "CTA link", type: "url" },
        ],
      },
      {
        key: "aboutBand",
        label: "About band",
        fields: [
          { key: "section_label", label: "Section label", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          { key: "heading_accent", label: "Accent word(s)", type: "text" },
          { key: "body_text", label: "Body text", type: "textarea" },
          { key: "cta_label", label: "Primary CTA label", type: "text" },
          { key: "cta_url", label: "Primary CTA link", type: "url" },
          { key: "cta_secondary_label", label: "Secondary CTA label", type: "text" },
          { key: "cta_secondary_url", label: "Secondary CTA link", type: "url" },
        ],
      },
      {
        key: "photoMarquee",
        label: "Atelier marquee",
        fields: [
          { key: "section_label", label: "Section label", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          { key: "heading_accent", label: "Accent word(s)", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
        ],
      },
      {
        key: "contactSection",
        label: "Contact section",
        fields: [
          { key: "section_label", label: "Section label", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          { key: "headingAccent", label: "Accent word(s)", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
          { key: "ctaLabel", label: "CTA label", type: "text" },
          { key: "ctaUrl", label: "CTA link", type: "url" },
          { key: "formTitle", label: "Form title", type: "text" },
          { key: "formSubtitle", label: "Form subtitle", type: "text" },
          { key: "nameLabel", label: "Name label", type: "text" },
          { key: "namePlaceholder", label: "Name placeholder", type: "text" },
          { key: "phoneLabel", label: "Phone label", type: "text" },
          { key: "phonePlaceholder", label: "Phone placeholder", type: "text" },
          { key: "emailLabel", label: "Email label", type: "text" },
          { key: "emailPlaceholder", label: "Email placeholder", type: "text" },
          { key: "messageLabel", label: "Message label", type: "text" },
          { key: "messagePlaceholder", label: "Message placeholder", type: "text" },
          { key: "submitLabel", label: "Submit label", type: "text" },
          { key: "successTitle", label: "Success title", type: "text" },
          { key: "successMessage", label: "Success message", type: "textarea" },
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
        fields: pageHeroFields(),
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
        fields: pageHeroFields(),
      },
      {
        key: "contactForm",
        label: "Contact form",
        description: "Form labels and placeholders",
        fields: [
          { key: "title", label: "Form title", type: "text" },
          { key: "subtitle", label: "Form intro", type: "text" },
          { key: "namePlaceholder", label: "Name field placeholder", type: "text" },
          { key: "phonePlaceholder", label: "Phone field placeholder", type: "text" },
          { key: "emailPlaceholder", label: "Email field placeholder", type: "text" },
          { key: "messagePlaceholder", label: "Message field placeholder", type: "text" },
          { key: "submitLabel", label: "Submit button label", type: "text" },
          { key: "successTitle", label: "Success title", type: "text" },
          { key: "successMessage", label: "Success message", type: "textarea" },
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
        fields: pageHeroFields(),
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
        fields: pageHeroFields(),
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
        fields: pageHeroFields(),
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
        fields: pageHeroFields(),
      },
      {
        key: "booking",
        label: "Online booking",
        description: "Appointment types, time slots, and walk-in section",
        fields: [
          { key: "daysAhead", label: "Days shown in calendar", type: "number", hint: "1–14 days ahead" },
          {
            key: "timeSlots",
            label: "Time slots",
            type: "array",
            hint: 'JSON array, e.g. ["09:00","10:00","14:00"]',
          },
          {
            key: "appointmentTypes",
            label: "Appointment types",
            type: "array",
            hint: "JSON array: id, label, description per entry",
          },
          { key: "walkInTitle", label: "Walk-in section title", type: "text" },
          { key: "walkInDescription", label: "Walk-in section text", type: "textarea" },
          { key: "namePlaceholder", label: "Name field placeholder", type: "text" },
          { key: "emailPlaceholder", label: "Email field placeholder", type: "text" },
          { key: "phonePlaceholder", label: "Phone field placeholder", type: "text" },
          { key: "notesPlaceholder", label: "Notes field placeholder", type: "text" },
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
        fields: pageHeroFields(),
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
        fields: pageHeroFields(),
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
        fields: pageHeroFields(),
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
