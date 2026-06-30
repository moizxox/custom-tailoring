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
  | "toggle"
  | "items"; // repeating card items with icon picker

export interface CmsFieldOption {
  value: string;
  label: string;
}

export interface CmsItemField {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "icon_slug" | "image" | "select";
  hint?: string;
  options?: CmsFieldOption[];
}

const LEGAL_SECTION_ITEM_FIELDS: CmsItemField[] = [
  { key: "title", label: "Section title", type: "text" },
  {
    key: "headingTag",
    label: "Heading tag",
    type: "select",
    options: [
      { value: "h2", label: "H2" },
      { value: "h3", label: "H3" },
      { value: "h4", label: "H4" },
    ],
  },
  { key: "body", label: "Content", type: "textarea", hint: "Separate paragraphs with a blank line" },
];

const CONTENT_BLOCK_FIELDS: CmsField[] = [
  { key: "label", label: "Section label", type: "text" },
  { key: "heading", label: "Heading", type: "text" },
  { key: "headingAccent", label: "Accent word(s)", type: "text" },
  { key: "paragraphs", label: "Body text", type: "textarea", hint: "Separate paragraphs with a blank line" },
  { key: "imageSrc", label: "Image", type: "image" },
  { key: "imageAlt", label: "Image alt text", type: "text" },
  {
    key: "imagePosition",
    label: "Image position",
    type: "select",
    options: [
      { value: "left", label: "Left" },
      { value: "right", label: "Right" },
    ],
  },
  { key: "ctaLabel", label: "CTA label", type: "text" },
  { key: "ctaUrl", label: "CTA link", type: "url" },
];

export interface CmsField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
  options?: CmsFieldOption[];
  itemFields?: CmsItemField[]; // for type "items"
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
          {
            key: "intro_points",
            label: "Bullet points",
            type: "items",
            hint: "Short bullet lines below the intro text",
            itemFields: [
              { key: "text", label: "Text", type: "text" },
            ],
          },
          {
            key: "badges",
            label: "Service badge pills",
            type: "items",
            hint: "Icon pills shown below the buttons",
            itemFields: [
              { key: "icon_slug", label: "Icon", type: "icon_slug" },
              { key: "label", label: "Label", type: "text" },
            ],
          },
        ],
      },
      {
        key: "servicesGrid",
        label: "Services section",
        description: "Service cards grid — edit icons, titles, descriptions",
        fields: [
          { key: "section_label", label: "Section label", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          { key: "heading_accent", label: "Accent word(s)", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
          { key: "cta_label", label: "CTA label", type: "text" },
          { key: "cta_url", label: "CTA link", type: "url" },
          {
            key: "services",
            label: "Service cards",
            type: "items",
            hint: "Each card shown in the grid",
            itemFields: [
              { key: "icon_slug", label: "Icon", type: "icon_slug" },
              { key: "title", label: "Title", type: "text" },
              { key: "description", label: "Description", type: "textarea" },
              { key: "link_url", label: "Link URL", type: "url" },
            ],
          },
        ],
      },
      {
        key: "process",
        label: "Process section",
        description: "Step-by-step process cards",
        fields: [
          { key: "section_label", label: "Section label", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          { key: "heading_accent", label: "Accent word(s)", type: "text" },
          {
            key: "steps",
            label: "Process steps",
            type: "items",
            hint: "Each step in the process",
            itemFields: [
              { key: "number", label: "Number", type: "text" },
              { key: "title", label: "Title", type: "text" },
              { key: "description", label: "Description", type: "textarea" },
            ],
          },
        ],
      },
      {
        key: "galleryPreview",
        label: "Gallery preview",
        description: "3-photo preview grid and text",
        fields: [
          { key: "section_label", label: "Section label", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          { key: "heading_accent", label: "Accent word(s)", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
          { key: "cta_label", label: "CTA label", type: "text" },
          { key: "cta_url", label: "CTA link", type: "url" },
          {
            key: "preview_items",
            label: "Preview photos",
            type: "items",
            hint: "Photos in the 3-card grid",
            itemFields: [
              { key: "src", label: "Image URL", type: "image" },
              { key: "category", label: "Category tag", type: "text" },
              { key: "title", label: "Title", type: "text" },
            ],
          },
        ],
      },
      {
        key: "aboutBand",
        label: "About band",
        description: "Text + USP feature cards with icons",
        fields: [
          { key: "section_label", label: "Section label", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          { key: "heading_accent", label: "Accent word(s)", type: "text" },
          { key: "body_text", label: "Body text", type: "textarea" },
          { key: "cta_label", label: "Primary CTA label", type: "text" },
          { key: "cta_url", label: "Primary CTA link", type: "url" },
          { key: "cta_secondary_label", label: "Secondary CTA label", type: "text" },
          { key: "cta_secondary_url", label: "Secondary CTA link", type: "url" },
          {
            key: "usps",
            label: "Feature USPs",
            type: "items",
            hint: "Small cards on the right side",
            itemFields: [
              { key: "icon_slug", label: "Icon", type: "icon_slug" },
              { key: "title", label: "Title", type: "text" },
              { key: "description", label: "Description", type: "textarea" },
            ],
          },
        ],
      },
      {
        key: "photoMarquee",
        label: "Atelier marquee",
        description: "Scrolling photo strip and text above it",
        fields: [
          { key: "section_label", label: "Section label", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          { key: "heading_accent", label: "Accent word(s)", type: "text" },
          { key: "subtext", label: "Subtext", type: "textarea" },
          {
            key: "photos",
            label: "Marquee photos",
            type: "items",
            hint: "Photos in the scrolling strip",
            itemFields: [
              { key: "src", label: "Image URL", type: "image" },
              { key: "alt", label: "Alt text", type: "text" },
            ],
          },
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
        description: "Team members shown on the page",
        fields: [
          {
            key: "items",
            label: "Team members",
            type: "items",
            itemFields: [
              { key: "name", label: "Name", type: "text" },
              { key: "role", label: "Role", type: "text" },
              { key: "icon_slug", label: "Icon", type: "icon_slug" },
              { key: "bio", label: "Bio", type: "textarea" },
            ],
          },
        ],
      },
      {
        key: "story",
        label: "Story section",
        fields: [
          { key: "label", label: "Section label", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          { key: "headingAccent", label: "Accent word(s)", type: "text" },
          { key: "paragraphs", label: "Body text", type: "textarea", hint: "Separate paragraphs with a blank line" },
          { key: "ctaLabel", label: "CTA label", type: "text" },
          { key: "ctaUrl", label: "CTA link", type: "url" },
        ],
      },
      {
        key: "work",
        label: "Work section",
        fields: CONTENT_BLOCK_FIELDS,
      },
      {
        key: "values",
        label: "Values",
        fields: [
          { key: "sectionLabel", label: "Section label", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          {
            key: "items",
            label: "Value cards",
            type: "items",
            itemFields: [
              { key: "icon_slug", label: "Icon", type: "icon_slug" },
              { key: "title", label: "Title", type: "text" },
              { key: "text", label: "Description", type: "textarea" },
            ],
          },
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
        label: "Services overview",
        description: "Cards shown in the services grid",
        fields: [
          {
            key: "heading", label: "Section heading", type: "text",
          },
          {
            key: "items",
            label: "Service cards",
            type: "items",
            itemFields: [
              { key: "title", label: "Title", type: "text" },
              { key: "description", label: "Description", type: "textarea" },
            ],
          },
        ],
      },
      {
        key: "orderProcess",
        label: "Order process",
        description: "Numbered steps for the ordering process",
        fields: [
          { key: "heading", label: "Section heading", type: "text" },
          {
            key: "steps",
            label: "Process steps",
            type: "items",
            itemFields: [
              { key: "number", label: "Number", type: "text" },
              { key: "title", label: "Title", type: "text" },
              { key: "description", label: "Description", type: "textarea" },
            ],
          },
        ],
      },
      {
        key: "faqs",
        label: "FAQs",
        description: "Frequently asked questions",
        fields: [
          {
            key: "items",
            label: "FAQ items",
            type: "items",
            itemFields: [
              { key: "q", label: "Question", type: "text" },
              { key: "a", label: "Answer", type: "textarea" },
            ],
          },
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
        description: "Gallery grid images and categories",
        fields: [
          {
            key: "items",
            label: "Gallery entries",
            type: "items",
            itemFields: [
              { key: "src", label: "Image", type: "image" },
              { key: "category", label: "Category", type: "text" },
              { key: "title", label: "Title", type: "text" },
            ],
          },
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
      { key: "hero", label: "Hero section", fields: pageHeroFields() },
      {
        key: "intro",
        label: "Intro section",
        fields: [
          { key: "label", label: "Section label", type: "text" },
          { key: "heading", label: "Heading", type: "text" },
          { key: "headingAccent", label: "Accent word(s)", type: "text" },
          { key: "paragraphs", label: "Body text", type: "textarea" },
          { key: "addressLine", label: "Address line", type: "text" },
          { key: "hoursWeekday", label: "Weekday hours", type: "text" },
          { key: "hoursSaturday", label: "Saturday hours", type: "text" },
          { key: "ctaLabel", label: "CTA label", type: "text" },
          { key: "ctaUrl", label: "CTA link", type: "url" },
          {
            key: "slides",
            label: "Photo slider",
            type: "items",
            itemFields: [
              { key: "src", label: "Image", type: "image" },
              { key: "alt", label: "Alt text", type: "text" },
            ],
          },
        ],
      },
      { key: "workshop", label: "Workshop section", fields: CONTENT_BLOCK_FIELDS },
      { key: "materials", label: "Materials section", fields: CONTENT_BLOCK_FIELDS },
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
        key: "timetables",
        label: "Walk-in timetables",
        description: "Fixed measurement times per location (Hochsaison)",
        fields: [
          { key: "heading", label: "Section heading", type: "text" },
          { key: "subtext", label: "Section subtext", type: "textarea" },
          {
            key: "items",
            label: "Location timetables",
            type: "items",
            itemFields: [
              {
                key: "locationId",
                label: "Location",
                type: "select",
                options: [
                  { value: "pratteln", label: "Pratteln" },
                  { value: "therwil", label: "Therwil" },
                ],
              },
              { key: "label", label: "Card title", type: "text" },
              { key: "description", label: "Description", type: "textarea" },
              {
                key: "active",
                label: "Active",
                type: "select",
                options: [
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ],
              },
              { key: "slots", label: "Time slots", type: "textarea", hint: "One per line: Montag: 14:00–18:00 (optional note)" },
            ],
          },
        ],
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
      {
        key: "steps",
        label: "Process steps",
        description: "4-step 'How it works' cards with icons",
        fields: [
          { key: "heading", label: "Section heading", type: "text" },
          {
            key: "items",
            label: "Steps",
            type: "items",
            itemFields: [
              { key: "icon", label: "Icon", type: "icon_slug" },
              { key: "title", label: "Title", type: "text" },
              { key: "text", label: "Description", type: "textarea" },
            ],
          },
        ],
      },
      {
        key: "cta",
        label: "Bottom CTA",
        fields: [
          { key: "heading", label: "Heading", type: "text" },
          { key: "subtext", label: "Subtext", type: "text" },
          { key: "buttonLabel", label: "Button label", type: "text" },
          { key: "buttonUrl", label: "Button link", type: "url" },
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
      { key: "hero", label: "Hero section", fields: pageHeroFields() },
      {
        key: "fabrics",
        label: "Fabric cards",
        fields: [
          {
            key: "items",
            label: "Fabric types",
            type: "items",
            itemFields: [
              { key: "name", label: "Name", type: "text" },
              { key: "desc", label: "Description", type: "textarea" },
              { key: "icon_slug", label: "Icon", type: "icon_slug" },
              { key: "gradient", label: "Gradient classes", type: "text", hint: "e.g. from-periwinkle-lighter to-sand-light" },
            ],
          },
          { key: "ctaText", label: "CTA intro text", type: "text" },
          { key: "ctaLabel", label: "CTA button label", type: "text" },
          { key: "ctaUrl", label: "CTA link", type: "url" },
        ],
      },
      { key: "advisory", label: "Advisory section", fields: CONTENT_BLOCK_FIELDS },
      {
        key: "bottomCta",
        label: "Bottom CTA",
        fields: [
          { key: "heading", label: "Heading", type: "text" },
          { key: "text", label: "Text", type: "textarea" },
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
      { key: "hero", label: "Hero section", fields: pageHeroFields() },
      { key: "main", label: "Main section", fields: CONTENT_BLOCK_FIELDS },
      {
        key: "services",
        label: "Services list",
        fields: [
          { key: "heading", label: "Section heading", type: "text" },
          {
            key: "items",
            label: "Service items",
            type: "items",
            itemFields: [{ key: "label", label: "Label", type: "text" }],
          },
          { key: "ctaLabel", label: "CTA label", type: "text" },
          { key: "ctaUrl", label: "CTA link", type: "url" },
        ],
      },
    ],
  },
  {
    slug: "shop",
    label: "Shop",
    icon: "🛍️",
    path: "/shop",
    sections: [
      { key: "hero", label: "Hero section", fields: pageHeroFields() },
      {
        key: "tiers",
        label: "Quality tiers",
        fields: [
          { key: "heading", label: "Section heading", type: "text" },
          { key: "subtext", label: "Section subtext", type: "textarea" },
          {
            key: "items",
            label: "Tier cards",
            type: "items",
            itemFields: [
              { key: "name", label: "Name", type: "text" },
              { key: "badge", label: "Badge label", type: "text" },
              { key: "tagline", label: "Tagline", type: "text" },
              { key: "features", label: "Features", type: "textarea", hint: "One feature per line" },
              { key: "recommendation", label: "Recommendation", type: "textarea" },
            ],
          },
        ],
      },
      {
        key: "categories",
        label: "Shop categories",
        fields: [
          { key: "heading", label: "Section heading", type: "text" },
          {
            key: "items",
            label: "Categories",
            type: "items",
            itemFields: [
              { key: "name", label: "Name", type: "text" },
              { key: "description", label: "Description", type: "textarea" },
              { key: "slug", label: "Anchor slug", type: "text" },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "journal",
    label: "Journal",
    icon: "📰",
    path: "/journal",
    sections: [
      { key: "hero", label: "Hero section", fields: pageHeroFields() },
      {
        key: "posts",
        label: "Journal posts",
        fields: [
          {
            key: "items",
            label: "Posts",
            type: "items",
            itemFields: [
              { key: "slug", label: "URL slug", type: "text" },
              { key: "category", label: "Category", type: "text" },
              { key: "date", label: "Date label", type: "text" },
              { key: "title", label: "Title", type: "text" },
              { key: "excerpt", label: "Excerpt", type: "textarea" },
              { key: "image", label: "Cover image", type: "image" },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "faqs",
    label: "FAQs",
    icon: "❓",
    path: "/faqs",
    sections: [
      { key: "hero", label: "Hero section", fields: pageHeroFields() },
      {
        key: "items",
        label: "FAQ list",
        fields: [
          {
            key: "items",
            label: "Questions",
            type: "items",
            itemFields: [
              { key: "q", label: "Question", type: "text" },
              { key: "a", label: "Answer", type: "textarea" },
            ],
          },
          { key: "ctaText", label: "CTA text", type: "text" },
          { key: "ctaButton", label: "CTA button label", type: "text" },
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
      { key: "hero", label: "Hero section", fields: pageHeroFields() },
      {
        key: "company",
        label: "Company details",
        fields: [
          { key: "name", label: "Company name", type: "text" },
          { key: "owner", label: "Owner", type: "text" },
          { key: "address", label: "Street address", type: "text" },
          { key: "city", label: "City / ZIP", type: "text" },
          { key: "country", label: "Country", type: "text" },
          { key: "secondLocation", label: "Second location", type: "text" },
          { key: "phone", label: "Phone", type: "text" },
          { key: "phoneHref", label: "Phone link", type: "url" },
          { key: "email", label: "Email", type: "text" },
          { key: "companyId", label: "Company ID", type: "text" },
          { key: "vatId", label: "VAT ID", type: "text" },
          { key: "purpose", label: "Company purpose", type: "text" },
        ],
      },
      {
        key: "sections",
        label: "Additional sections",
        description: "Haftung, Urheberrecht, or any extra legal blocks",
        fields: [
          {
            key: "items",
            label: "Sections",
            type: "items",
            itemFields: LEGAL_SECTION_ITEM_FIELDS,
          },
        ],
      },
    ],
  },
  {
    slug: "datenschutz",
    label: "Privacy policy",
    icon: "🔒",
    path: "/datenschutz",
    sections: [
      { key: "hero", label: "Hero section", fields: pageHeroFields() },
      {
        key: "sections",
        label: "Policy sections",
        fields: [
          { key: "intro", label: "Intro note", type: "textarea" },
          {
            key: "items",
            label: "Sections",
            type: "items",
            itemFields: LEGAL_SECTION_ITEM_FIELDS,
          },
        ],
      },
    ],
  },
  {
    slug: "agb",
    label: "Terms & conditions",
    icon: "📋",
    path: "/agb",
    sections: [
      { key: "hero", label: "Hero section", fields: pageHeroFields() },
      {
        key: "sections",
        label: "AGB sections",
        fields: [
          { key: "intro", label: "Intro note", type: "textarea" },
          {
            key: "items",
            label: "Sections",
            type: "items",
            itemFields: LEGAL_SECTION_ITEM_FIELDS,
          },
        ],
      },
    ],
  },
  {
    slug: "widerruf",
    label: "Right of withdrawal",
    icon: "↩️",
    path: "/widerruf",
    sections: [
      { key: "hero", label: "Hero section", fields: pageHeroFields() },
      {
        key: "sections",
        label: "Withdrawal sections",
        fields: [
          { key: "intro", label: "Intro note", type: "textarea" },
          {
            key: "items",
            label: "Sections",
            type: "items",
            itemFields: LEGAL_SECTION_ITEM_FIELDS,
          },
        ],
      },
    ],
  },
  {
    slug: "shop-bedingungen",
    label: "Shop terms",
    icon: "🛒",
    path: "/shop-bedingungen",
    sections: [
      { key: "hero", label: "Hero section", fields: pageHeroFields() },
      {
        key: "sections",
        label: "Shop terms sections",
        fields: [
          { key: "intro", label: "Intro note", type: "textarea" },
          {
            key: "items",
            label: "Sections",
            type: "items",
            itemFields: LEGAL_SECTION_ITEM_FIELDS,
          },
        ],
      },
    ],
  },
];

export function getPageSchema(slug: string): CmsPageSchema | undefined {
  return PAGE_SCHEMAS.find((p) => p.slug === slug);
}
