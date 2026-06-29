export const HOME_SECTION_DEFAULTS: Record<string, Record<string, unknown>> = {
  hero: {
    eyebrow: "Kostümschneiderei Basel",
    heading: "Ihre Kostüme.\nUnser Handwerk.",
    headingAccent: "Handwerk.",
    subtext:
      "Wir sind Ihre Kostümschneiderei in Basel – spezialisiert auf massgeschneiderte Kostüme für Guggenmusiken, Cliquen und Einzelpersonen.",
    ctaPrimaryLabel: "Termin buchen",
    ctaPrimaryUrl: "/termin",
    ctaSecondaryLabel: "Leistungen entdecken",
    ctaSecondaryUrl: "/leistungen",
    headingTag: "h1",
  },
  servicesGrid: {
    section_label: "Von der Idee bis zum fertigen Kostüm",
    heading: "Unsere Leistungen",
    heading_accent: "Leistungen",
    subtext:
      "Alles aus einer Hand – von der Beratung über die Massanfertigung bis zur Übergabe. Verlässlich, präzise und mit Liebe zum Handwerk.",
    cta_label: "Alle Leistungen",
    cta_url: "/leistungen",
  },
  process: {
    section_label: "So einfach geht's",
    heading: "Ihr Weg zum",
    heading_accent: "perfekten Kostüm",
  },
  galleryPreview: {
    section_label: "Unsere Handwerkskunst",
    heading: "Jedes Kostüm",
    heading_accent: "ein Unikat.",
    subtext:
      "Von der Guggenmusik bis zur Einzelanfertigung — jedes Projekt erzählt eine eigene Geschichte. Ein Einblick in unsere Arbeit.",
    cta_label: "Zur Galerie",
    cta_url: "/galerie",
  },
  aboutBand: {
    section_label: "Bereit für Ihr Projekt?",
    heading: "Tradition in jedem Stich.",
    heading_accent: "Tradition",
    body_text:
      "Moderne in jeder Linie. Für Menschen mit Stilgefühl und Anspruch – wir schaffen Kostüme, die Persönlichkeit und Handwerk vereinen.",
    cta_label: "Termin buchen",
    cta_url: "/termin",
    cta_secondary_label: "Unser Angebot",
    cta_secondary_url: "/leistungen",
  },
  photoMarquee: {
    section_label: "Im Atelier",
    heading: "Wo Ihre Kostüme",
    heading_accent: "entstehen",
    subtext:
      "Ein Blick hinter die Kulissen — Werkstatt, Stoffe und fertige Arbeiten aus unserem Atelier in Basel.",
  },
  contactSection: {
    section_label: "Kontakt",
    heading: "Haben Sie eine Frage oder ein Projekt?",
    headingAccent: "Frage",
    subtext:
      "Schreiben Sie uns — wir melden uns persönlich und zeitnah. Für eine ausführliche Beratung können Sie auch direkt einen Termin buchen.",
    ctaLabel: "Termin buchen",
    ctaUrl: "/termin",
    formTitle: "Anfrage senden",
    formSubtitle: "Wir antworten persönlich und zeitnah.",
    nameLabel: "Name *",
    namePlaceholder: "Ihr Name",
    phoneLabel: "Telefon",
    phonePlaceholder: "+41 ...",
    emailLabel: "E-Mail *",
    emailPlaceholder: "ihre@email.ch",
    messageLabel: "Nachricht",
    messagePlaceholder: "Wie können wir Ihnen helfen?",
    submitLabel: "Anfrage absenden",
    successTitle: "Vielen Dank!",
    successMessage: "Wir melden uns persönlich und zeitnah bei Ihnen.",
  },
};

export function getDefaultSectionContent(pageSlug: string, sectionKey: string): Record<string, unknown> {
  if (pageSlug === "home") return HOME_SECTION_DEFAULTS[sectionKey] ?? {};
  return {};
}
