export type HeadingTag = "h1" | "h2" | "h3" | "h4";

export interface HomeHeroCms {
  eyebrow_text?: string;
  heading?: string;
  heading_accent?: string;
  subtext?: string;
  cta_primary_label?: string;
  cta_primary_url?: string;
  cta_secondary_label?: string;
  cta_secondary_url?: string;
  intro_points?: { text: string }[];
  badges?: { icon_slug: string; label: string }[];
}

export function parseHeadingTag(value: unknown, fallback: HeadingTag = "h1"): HeadingTag {
  const tag = String(value ?? "").toLowerCase();
  if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4") return tag;
  return fallback;
}

export function pickString(content: Record<string, unknown>, key: string, fallback: string): string {
  const value = content[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

export interface PageHeroCms {
  label?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  headingTag?: HeadingTag;
}

export function mapPageHeroContent(
  content: Record<string, unknown>,
  defaults: PageHeroCms
): PageHeroCms {
  return {
    label: pickString(content, "label", defaults.label ?? ""),
    title: pickString(content, "heading", defaults.title),
    titleAccent: pickString(content, "headingAccent", defaults.titleAccent ?? ""),
    subtitle: pickString(content, "subtext", defaults.subtitle ?? ""),
    headingTag: parseHeadingTag(content.headingTag, defaults.headingTag ?? "h1"),
  };
}

export function mapHomeHeroContent(content: Record<string, unknown>): Partial<HomeHeroCms> {
  return {
    eyebrow_text: pickString(content, "eyebrow", "Kostümschneiderei Basel"),
    heading: pickString(content, "heading", "Ihre Kostüme.\nUnser Handwerk."),
    heading_accent: pickString(content, "headingAccent", "Handwerk."),
    subtext: pickString(
      content,
      "subtext",
      "Wir sind Ihre Kostümschneiderei in Basel – spezialisiert auf massgeschneiderte Kostüme für Guggenmusiken, Cliquen und Einzelpersonen."
    ),
    cta_primary_label: pickString(content, "ctaPrimaryLabel", "Termin buchen"),
    cta_primary_url: pickString(content, "ctaPrimaryUrl", "/termin"),
    cta_secondary_label: pickString(content, "ctaSecondaryLabel", "Leistungen entdecken"),
    cta_secondary_url: pickString(content, "ctaSecondaryUrl", "/leistungen"),
    intro_points: Array.isArray(content.intro_points)
      ? (content.intro_points as { text: string }[])
      : undefined,
    badges: Array.isArray(content.badges)
      ? (content.badges as { icon_slug: string; label: string }[])
      : undefined,
  };
}

export interface BookingConfig {
  timeSlots: string[];
  daysAhead: number;
  appointmentTypes: Array<{ id: string; label: string; description: string }>;
  walkInTitle: string;
  walkInDescription: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  notesPlaceholder: string;
}

export interface ContactFormConfig {
  title: string;
  subtitle: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
}

export function mapContactFormConfig(
  content: Record<string, unknown>,
  defaults: ContactFormConfig
): ContactFormConfig {
  return {
    title: pickString(content, "title", defaults.title),
    subtitle: pickString(content, "subtitle", defaults.subtitle),
    namePlaceholder: pickString(content, "namePlaceholder", defaults.namePlaceholder),
    phonePlaceholder: pickString(content, "phonePlaceholder", defaults.phonePlaceholder),
    emailPlaceholder: pickString(content, "emailPlaceholder", defaults.emailPlaceholder),
    messagePlaceholder: pickString(content, "messagePlaceholder", defaults.messagePlaceholder),
    submitLabel: pickString(content, "submitLabel", defaults.submitLabel),
    successTitle: pickString(content, "successTitle", defaults.successTitle),
    successMessage: pickString(content, "successMessage", defaults.successMessage),
  };
}

export function buildBookingDates(daysAhead: number) {
  const count = Math.max(1, Math.min(daysAhead, 14));
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    return {
      value: date.toISOString().slice(0, 10),
      weekday: new Intl.DateTimeFormat("de-CH", { weekday: "short" }).format(date),
      label: new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "2-digit" }).format(date),
    };
  });
}

export function mapBookingConfig(
  content: Record<string, unknown>,
  defaults: BookingConfig
): BookingConfig {
  let timeSlots = defaults.timeSlots;
  if (Array.isArray(content.timeSlots)) {
    timeSlots = content.timeSlots.map(String);
  }

  let appointmentTypes = defaults.appointmentTypes;
  if (Array.isArray(content.appointmentTypes)) {
    appointmentTypes = content.appointmentTypes as BookingConfig["appointmentTypes"];
  }

  const daysAheadRaw = content.daysAhead;
  const daysAhead =
    typeof daysAheadRaw === "number"
      ? daysAheadRaw
      : typeof daysAheadRaw === "string" && daysAheadRaw.trim()
      ? parseInt(daysAheadRaw, 10)
      : defaults.daysAhead;

  return {
    timeSlots,
    daysAhead: Number.isFinite(daysAhead) ? daysAhead : defaults.daysAhead,
    appointmentTypes,
    walkInTitle: pickString(content, "walkInTitle", defaults.walkInTitle),
    walkInDescription: pickString(content, "walkInDescription", defaults.walkInDescription),
    namePlaceholder: pickString(content, "namePlaceholder", defaults.namePlaceholder),
    emailPlaceholder: pickString(content, "emailPlaceholder", defaults.emailPlaceholder),
    phonePlaceholder: pickString(content, "phonePlaceholder", defaults.phonePlaceholder),
    notesPlaceholder: pickString(content, "notesPlaceholder", defaults.notesPlaceholder),
  };
}
