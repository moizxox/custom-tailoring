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
    intro_points: [
      { text: "Kostüme für Fasnacht, Bühne und besondere Anlässe" },
      { text: "Beratung, Schnitt und Anfertigung aus einer Hand" },
      { text: "Persönlicher Service – von der Idee bis zur letzten Naht" },
    ],
    badges: [
      { icon_slug: "tailor-dummy-fashion-sewing-tailoring.svg", label: "Massanfertigung" },
      { icon_slug: "tape-measure-sewing-tailoring-size.svg", label: "Massnehmen" },
      { icon_slug: "scissor-cut-fabric-sewing.svg", label: "Handarbeit" },
    ],
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
    preview_items: [
      { src: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/gallery/schloesslischraenzer-major.jpg", category: "Major", title: "Schlösslischränzer Major" },
      { src: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/gallery/gwuerztraminer-2026.jpg", category: "Guggenmusik", title: "Gwürztraminer Waageclique" },
      { src: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/gallery/waageclique-edelwaggis.jpg", category: "Clique", title: "Edelwaggis Waageclique" },
    ],
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
    photos: [
      { src: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/atelier/atelier-1.png", alt: "Atelier – Werkstatt" },
      { src: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/gallery/schloesslischraenzer-major.jpg", alt: "Schlösslischränzer Major" },
      { src: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/atelier/atelier-2.jpg", alt: "Näharbeit im Atelier" },
      { src: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/gallery/gwuerztraminer-2026.jpg", alt: "Gwürztraminer Waageclique" },
      { src: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/atelier/atelier-3.jpg", alt: "Stoffe und Materialien" },
      { src: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/gallery/waageclique-edelwaggis.jpg", alt: "Edelwaggis Waageclique" },
      { src: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/gallery/baenkli-clique.jpg", alt: "Bänkli Clique" },
      { src: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/gallery/waggis-clique.jpg", alt: "Waggis Clique" },
    ],
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

export const SERVICE_SECTION_DEFAULTS: Record<string, Record<string, unknown>> = {
  offerings: {
    heading: "Unsere Leistungen im Überblick",
    items: [
      { title: "Individuelle Beratung & Entwurfskizzen", description: "Gemeinsam entwickeln wir Ihre Kostümidee." },
      { title: "Massanfertigung", description: "Wir schneidern passgenau und sorgen für einen optimalen Sitz und angenehmen Tragekomfort." },
      { title: "Auswahl hochwertiger Stoffe & Materialien", description: "Von klassischen Stoffen bis hin zu Glitzer, Samt, Satin oder Spezialtextilien." },
      { title: "Optional Stoffdruck & Stickerei", description: "Logos, Muster, Namen oder Vereinsfarben — individuelle Drucke oder Stickereien." },
      { title: "Veredelung & Applikationen", description: "Ob Borten, Glöckchen, Fransen oder Accessoires — der finale Schliff für Ihr Kostüm." },
      { title: "Kostüme für Gruppen & Einzelpersonen", description: "Einheitlich im Stil, aber auf jedes Gruppenmitglied abgestimmt." },
    ],
  },
  orderProcess: {
    heading: "So funktioniert der Bestellprozess für Ihr Fasnachtskostüm",
    steps: [
      { number: "1", title: "Kontaktaufnahme & erste Informationen", description: "Sie erreichen uns per E-Mail, Telefon oder Kontaktformular — oder buchen direkt online." },
      { number: "2", title: "Beratung & Offerte", description: "Nach dem Erstkontakt erhalten Sie persönliche Beratung, Stoff- und Gestaltungsvorschläge sowie eine unverbindliche Offerte." },
      { number: "3", title: "Definitive Bestellung", description: "Sobald Sie den Auftrag bestätigen, planen wir Ihr Projekt verbindlich ein." },
      { number: "4", title: "Massnehmen & Produktionsbeginn", description: "In der Hochsaison veröffentlichen wir feste Zeitfenster für Massnehmen ohne Voranmeldung." },
      { number: "5", title: "Feinarbeit & Veredelung", description: "Applikationen, Stickereien und individuelle Details verleihen dem Kostüm seine charakteristische Ausstrahlung." },
      { number: "6", title: "Abholung / Übergabe", description: "Nach Fertigstellung vereinbaren wir einen individuellen Abhol- oder Übergabetermin." },
    ],
  },
  faqs: {
    items: [
      { q: "Gibt es eine Anprobe vor der Fertigstellung?", a: "In der Regel nicht nötig. Bei kurzfristiger Lieferung vor der Fasnacht empfehlen wir eine Anprobe zur Sicherheit." },
      { q: "Was ist, wenn sich meine Masse nach der ersten Massaufnahme stark ändern?", a: "Wir fertigen das Kostüm anhand der Körpermasse an, die zum Zeitpunkt der Massaufnahme ermittelt wurden. Nachträgliche Änderungen werden als individuelle Nachanpassungen berechnet." },
      { q: "Wie aufwendig sind Änderungen nach der Fertigstellung?", a: "Kleinere Änderungen sind in der Regel unkompliziert. Grössere Anpassungen erfordern einen höheren Aufwand und sind kostenpflichtig." },
    ],
  },
};

export const MASSFERTIGUNG_SECTION_DEFAULTS: Record<string, Record<string, unknown>> = {
  steps: {
    heading: "So entsteht Ihr Kostüm",
    items: [
      { icon: "tailor-dummy-ruler-sewing-tailoring.svg", title: "Mass nehmen", text: "Wir nehmen alle relevanten Masse präzise auf — persönlich im Atelier oder über Ihren geschützten Kundenbereich." },
      { icon: "pencil-sewing-tailoring-drawing.svg", title: "Schnittmuster", text: "Auf Basis Ihrer Masse erstellen wir ein individuelles Schnittmuster. Kein Kostüm von der Stange – jedes wird neu konstruiert." },
      { icon: "fabric-cloth-sewing-tailoring.svg", title: "Stoffauswahl", text: "Gemeinsam wählen wir die passenden Materialien aus. Wir helfen Ihnen, das Richtige zu finden – nach Budget und Wunsch." },
      { icon: "sewing-machine-sewing-tailoring-cloth.svg", title: "Anfertigung", text: "Jeder Schritt der Produktion erfolgt in unserem Basler Atelier, von Hand und mit grösster Sorgfalt." },
    ],
  },
  cta: {
    heading: "Bereit für Ihr Kostüm?",
    subtext: "Buchen Sie Ihr kostenloses Erstgespräch. Wir freuen uns auf Sie.",
    buttonLabel: "Termin buchen",
    buttonUrl: "/termin",
  },
};

import { EXTRA_SECTION_DEFAULTS } from "@/lib/cms/extra-defaults";

export function getDefaultSectionContent(pageSlug: string, sectionKey: string): Record<string, unknown> {
  if (pageSlug === "home") return HOME_SECTION_DEFAULTS[sectionKey] ?? {};
  if (pageSlug === "service") return SERVICE_SECTION_DEFAULTS[sectionKey] ?? {};
  if (pageSlug === "massfertigung") return MASSFERTIGUNG_SECTION_DEFAULTS[sectionKey] ?? {};
  return EXTRA_SECTION_DEFAULTS[pageSlug]?.[sectionKey] ?? {};
}
