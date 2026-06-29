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
    services: [
      { icon_slug: "tailor-dummy-ruler-sewing-tailoring.svg", title: "Individuelle Beratung", description: "Wir hören zu, verstehen Ihre Wünsche und finden das passende Konzept.", link_url: "/leistungen#beratung" },
      { icon_slug: "tape-measure-sewing-tailoring-size.svg", title: "Massanfertigung", description: "Jedes Kostüm wird nach Ihren Massen und Vorstellungen gefertigt.", link_url: "/leistungen#massanfertigung" },
      { icon_slug: "fabric-cloth-sewing-tailoring.svg", title: "Feinste Materialien", description: "Hochwertige Stoffe und liebevolle Details für einzigartige Kostüme.", link_url: "/leistungen#stoffe" },
      { icon_slug: "pencil-sewing-tailoring-drawing.svg", title: "Einzigartige Designs", description: "Kreativ, stilvoll und mit Liebe zum Detail — von Sketch bis Stoff.", link_url: "/leistungen#design" },
      { icon_slug: "hanger-sewing-fashion-cloth.svg", title: "Fasnacht mit Stil", description: "Für unvergessliche Momente — Kostüme, die Geschichten erzählen.", link_url: "/leistungen#fasnacht" },
      { icon_slug: "sewing-pattern-sewing-tailoring-fashion-design.svg", title: "Schnittmuster", description: "Traditionelles Handwerk trifft zeitlose Eleganz.", link_url: "/leistungen#schnittmuster" },
      { icon_slug: "sewing-machine-sewing-tailoring-cloth.svg", title: "Serienanfertigung", description: "Für Guggenmusiken, Cliquen und Gruppen — gleichmässig und präzise.", link_url: "/leistungen#serienanfertigung" },
      { icon_slug: "seam-ripper-sewing-tool-tailoring.svg", title: "Änderungen", description: "Anpassungen mit Sorgfalt — damit alles perfekt sitzt.", link_url: "/leistungen#aenderungen" },
      { icon_slug: "sewing-needles-sewing-tailoring-needle.svg", title: "Reparaturen", description: "Wir geben Ihrem Lieblingsstück neues Leben.", link_url: "/leistungen#reparaturen" },
      { icon_slug: "box-threads-sewing-tailoring.svg", title: "Stoffauswahl", description: "Persönliche Begleitung beim Auswählen der besten Materialien.", link_url: "/leistungen#stoffe" },
      { icon_slug: "pin-cushion-handcraft-sewing-tailoring.svg", title: "Termin buchen", description: "Vereinbaren Sie ein unverbindliches Beratungsgespräch.", link_url: "/termin" },
      { icon_slug: "button-sewing-tailoring-handcraft.svg", title: "Persönlicher Service", description: "Wir begleiten Sie mit Herz und Leidenschaft — auch nach der Übergabe.", link_url: "/kontakt" },
    ],
  },
  process: {
    section_label: "So einfach geht's",
    heading: "Ihr Weg zum",
    heading_accent: "perfekten Kostüm",
    steps: [
      { number: "01", title: "Beratung", description: "Wir lernen Sie und Ihre Wünsche kennen. Persönlich, offen und ohne Druck." },
      { number: "02", title: "Konzept & Design", description: "Wir entwerfen ein individuelles Konzept – von der Skizze bis zum Entwurf." },
      { number: "03", title: "Anfertigung", description: "Mit Präzision und Liebe zum Detail entstehen Ihre Kostüme in unserem Atelier." },
      { number: "04", title: "Anprobe & Übergabe", description: "Wir passen alles an und übergeben Ihr perfektes Kostüm – pünktlich und mit Sorgfalt." },
    ],
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
    usps: [
      { icon_slug: "tailor-dummy-fashion-sewing-tailoring.svg", title: "Persönlich & nah", description: "Wir sind für Sie da – mit Herz und Verstand." },
      { icon_slug: "sewing-machine-sewing-tailoring-cloth.svg", title: "Erfahren & engagiert", description: "Handwerk, das begeistert – seit vielen Jahren." },
      { icon_slug: "embroidery-sewing-needlework-handcraft.svg", title: "Für besondere Momente", description: "Kostüme, die Geschichten erzählen." },
    ],
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
