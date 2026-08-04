import type { CmsField, CmsSection } from "@/lib/cms/page-schemas";

/** Shared modular building blocks available on every CMS page. */
export const MODULAR_SECTION_PREFIX = "flex_";

export function isModularSectionKey(key: string): boolean {
  return key.startsWith(MODULAR_SECTION_PREFIX);
}

function withOpts(fields: CmsField[]): CmsField[] {
  // appearance fields are merged later by withAppearanceOnAllSections —
  // keep modular defs lean; page-schemas will add appearance if missing.
  return fields;
}

/**
 * Same selection of flexible sections on every page.
 * defaultHidden: true so existing layouts stay unchanged until enabled in CMS.
 */
export const MODULAR_SECTIONS: CmsSection[] = [
  {
    key: "flex_richText",
    label: "Textblock",
    description: "Überschrift + Fliesstext — für Hinweise, Stories, Saison-Infos",
    defaultHidden: true,
    modular: true,
    fields: withOpts([
      { key: "label", label: "Abschnitts-Label", type: "text", group: "content" },
      { key: "heading", label: "Überschrift", type: "text", group: "content" },
      { key: "headingAccent", label: "Akzentwort(e)", type: "text", group: "content" },
      {
        key: "body",
        label: "Text",
        type: "textarea",
        group: "content",
        hint: "Absätze mit Leerzeile trennen",
      },
    ]),
  },
  {
    key: "flex_imageText",
    label: "Bild + Text",
    description: "Zweispaltig mit Bild und Text (wie About-Band)",
    defaultHidden: true,
    modular: true,
    fields: withOpts([
      { key: "label", label: "Abschnitts-Label", type: "text", group: "content" },
      { key: "heading", label: "Überschrift", type: "text", group: "content" },
      { key: "headingAccent", label: "Akzentwort(e)", type: "text", group: "content" },
      {
        key: "paragraphs",
        label: "Text",
        type: "textarea",
        group: "content",
        hint: "Absätze mit Leerzeile trennen",
      },
      { key: "imageSrc", label: "Bild", type: "image", group: "content" },
      { key: "imageAlt", label: "Bild-Beschreibung", type: "text", group: "content" },
      {
        key: "imagePosition",
        label: "Bildposition",
        type: "select",
        group: "content",
        options: [
          { value: "left", label: "Links" },
          { value: "right", label: "Rechts" },
        ],
      },
      { key: "ctaLabel", label: "Button-Text", type: "text", group: "links" },
      { key: "ctaUrl", label: "Button-Link", type: "url", group: "links" },
    ]),
  },
  {
    key: "flex_cta",
    label: "CTA-Banner",
    description: "Aufruf mit Überschrift und einem Button",
    defaultHidden: true,
    modular: true,
    fields: withOpts([
      { key: "heading", label: "Überschrift", type: "text", group: "content" },
      { key: "subtext", label: "Untertitel", type: "textarea", group: "content" },
      { key: "buttonLabel", label: "Button-Text", type: "text", group: "links" },
      { key: "buttonUrl", label: "Button-Link", type: "url", group: "links" },
    ]),
  },
  {
    key: "flex_process",
    label: "Ablauf / Schritte",
    description: "Nummerierte Schritte (Beratung → Fertigung …)",
    defaultHidden: true,
    modular: true,
    fields: withOpts([
      { key: "section_label", label: "Abschnitts-Label", type: "text", group: "content" },
      { key: "heading", label: "Überschrift", type: "text", group: "content" },
      { key: "heading_accent", label: "Akzentwort(e)", type: "text", group: "content" },
      {
        key: "steps",
        label: "Schritte",
        type: "items",
        group: "items",
        itemFields: [
          { key: "number", label: "Nummer", type: "text" },
          { key: "title", label: "Titel", type: "text" },
          { key: "description", label: "Beschreibung", type: "textarea" },
        ],
      },
    ]),
  },
  {
    key: "flex_gallery",
    label: "Bildergalerie (Vorschau)",
    description: "Drei Vorschaubilder mit Link zur Galerie",
    defaultHidden: true,
    modular: true,
    fields: withOpts([
      { key: "section_label", label: "Abschnitts-Label", type: "text", group: "content" },
      { key: "heading", label: "Überschrift", type: "text", group: "content" },
      { key: "heading_accent", label: "Akzentwort(e)", type: "text", group: "content" },
      { key: "subtext", label: "Untertitel", type: "textarea", group: "content" },
      {
        key: "show_cta",
        label: "CTA anzeigen",
        type: "toggle",
        group: "links",
      },
      { key: "cta_label", label: "CTA-Text", type: "text", group: "links" },
      { key: "cta_url", label: "CTA-Link", type: "url", group: "links" },
      {
        key: "preview_items",
        label: "Bilder",
        type: "items",
        group: "items",
        itemFields: [
          { key: "src", label: "Bild", type: "image" },
          { key: "category", label: "Kategorie", type: "text" },
          { key: "title", label: "Titel", type: "text" },
        ],
      },
    ]),
  },
  {
    key: "flex_faq",
    label: "FAQ-Liste",
    description: "Fragen & Antworten als Akkordeon-Liste",
    defaultHidden: true,
    modular: true,
    fields: withOpts([
      { key: "section_label", label: "Abschnitts-Label", type: "text", group: "content" },
      { key: "heading", label: "Überschrift", type: "text", group: "content" },
      {
        key: "items",
        label: "Fragen",
        type: "items",
        group: "items",
        itemFields: [
          { key: "q", label: "Frage", type: "text" },
          { key: "a", label: "Antwort", type: "textarea" },
        ],
      },
    ]),
  },
  {
    key: "flex_contactBand",
    label: "Kontakt-Band",
    description: "Einladung zu Kontakt / Termin mit Button",
    defaultHidden: true,
    modular: true,
    fields: withOpts([
      { key: "label", label: "Abschnitts-Label", type: "text", group: "content" },
      { key: "heading", label: "Überschrift", type: "text", group: "content" },
      { key: "subtext", label: "Text", type: "textarea", group: "content" },
      { key: "buttonLabel", label: "Button-Text", type: "text", group: "links" },
      { key: "buttonUrl", label: "Button-Link", type: "url", group: "links" },
    ]),
  },
];

export const MODULAR_SECTION_DEFAULTS: Record<string, Record<string, unknown>> = {
  flex_richText: {
    label: "",
    heading: "Neuer Textabschnitt",
    headingAccent: "",
    body: "Hier können Sie Texte hinzufügen, die zu dieser Seite passen.",
  },
  flex_imageText: {
    label: "",
    heading: "Bild und Text",
    headingAccent: "",
    paragraphs: "Erzählen Sie hier Ihre Geschichte.\n\nEin zweiter Absatz.",
    imageSrc: "",
    imageAlt: "",
    imagePosition: "right",
    ctaLabel: "",
    ctaUrl: "",
  },
  flex_cta: {
    heading: "Bereit für den nächsten Schritt?",
    subtext: "Wir beraten Sie gerne persönlich.",
    buttonLabel: "Termin buchen",
    buttonUrl: "/termin",
  },
  flex_process: {
    section_label: "Ablauf",
    heading: "So arbeiten wir",
    heading_accent: "",
    steps: [
      { number: "01", title: "Beratung", description: "Persönliches Gespräch zu Ihren Wünschen." },
      { number: "02", title: "Umsetzung", description: "Massarbeit im Atelier." },
      { number: "03", title: "Übergabe", description: "Anprobe und fertiges Kostüm." },
    ],
  },
  flex_gallery: {
    section_label: "Einblicke",
    heading: "Aus unserer",
    heading_accent: "Arbeit",
    subtext: "Eine Auswahl fertiger Kostüme.",
    show_cta: true,
    cta_label: "Zur Galerie",
    cta_url: "/galerie",
    preview_items: [],
  },
  flex_faq: {
    section_label: "FAQ",
    heading: "Häufige Fragen",
    items: [
      { q: "Wie läuft die Beratung ab?", a: "Persönlich im Atelier oder nach Vereinbarung." },
    ],
  },
  flex_contactBand: {
    label: "Kontakt",
    heading: "Fragen? Wir sind für Sie da.",
    subtext: "Schreiben Sie uns oder buchen Sie einen Termin.",
    buttonLabel: "Kontakt aufnehmen",
    buttonUrl: "/kontakt",
  },
};

/** Append modular sections to a page without duplicating keys already present. */
export function mergeModularSections(sections: CmsSection[]): CmsSection[] {
  const existing = new Set(sections.map((s) => s.key));
  const extras = MODULAR_SECTIONS.filter((s) => !existing.has(s.key));
  return [...sections, ...extras];
}

export function getDefaultHiddenSectionKeys(sections: CmsSection[]): string[] {
  return sections.filter((s) => s.defaultHidden).map((s) => s.key);
}
