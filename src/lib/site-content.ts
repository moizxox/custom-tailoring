/**
 * Central site content — structured for later CMS migration (WordPress ACF / WooCommerce).
 * Edit texts, locations, timetable slots and shop categories here until CMS is wired up.
 */

export type LocationId = "pratteln" | "therwil";

export interface AtelierLocation {
  id: LocationId;
  name: string;
  address: string;
  city: string;
  mapsUrl: string;
  mapsEmbed: string;
  phone?: string;
  note?: string;
}

export interface TimetableSlot {
  day: string;
  time: string;
  note?: string;
}

export interface TimetableSeason {
  label: string;
  description: string;
  active: boolean;
  slots: TimetableSlot[];
}

export interface ShopQualityTier {
  id: "einfach" | "standard" | "premium";
  name: string;
  tagline: string;
  features: string[];
  recommendation: string;
}

export interface ShopCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  qualityTier?: ShopQualityTier["id"];
  priceFrom: string;
  shortDescription: string;
  inStock?: boolean;
  /** Placeholder until client adds real product images in CMS */
  imageSrc?: string;
}

export const SITE_CONTACT = {
  email: "info@kostuem-schneiderei.ch",
  phone: "079 654 66 55",
  phoneHref: "tel:+41796546655",
  whatsapp: "https://wa.me/41796546655",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  hoursDefault: "Termine nur nach Vereinbarung",
} as const;

export const ATELIER_LOCATIONS: AtelierLocation[] = [
  {
    id: "pratteln",
    name: "Pratteln",
    address: "Hohenrainstrasse 26c",
    city: "4133 Pratteln",
    mapsUrl: "https://maps.google.com/?q=Hohenrainstrasse+26c+4133+Pratteln",
    mapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2700.0!2d7.688!3d47.520!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDMxJzEyLjAiTiA3wrA0MScxNi44IkU!5e0!3m2!1sde!2sch!4v1",
  },
  {
    id: "therwil",
    name: "Therwil",
    address: "Reinacherstrasse 5",
    city: "4106 Therwil",
    mapsUrl: "https://maps.google.com/?q=Reinacherstrasse+5+4106+Therwil",
    mapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2700.0!2d7.552!3d47.498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDI5JzUyLjgiTiA3wrAzMycwNy4yIkU!5e0!3m2!1sde!2sch!4v1",
  },
];

/** Walk-in measurement windows during Fasnacht high season — one timetable per location */
export const MEASUREMENT_TIMETABLES: Record<LocationId, TimetableSeason> = {
  pratteln: {
    label: "Hochsaison Fasnacht — Pratteln",
    description:
      "In der Hochsaison nehmen wir Massen ohne Termin zu festen Zeiten im Atelier Pratteln entgegen. Ausserhalb dieser Zeiten nur nach Vereinbarung.",
    active: true,
    slots: [
      { day: "Dienstag", time: "17:00 – 19:00 Uhr" },
      { day: "Donnerstag", time: "17:00 – 19:00 Uhr" },
      { day: "Samstag", time: "10:00 – 12:00 Uhr", note: "Januar – März" },
    ],
  },
  therwil: {
    label: "Hochsaison Fasnacht — Therwil",
    description:
      "In der Hochsaison nehmen wir Massen ohne Termin zu festen Zeiten im Atelier Therwil entgegen. Ausserhalb dieser Zeiten nur nach Vereinbarung.",
    active: true,
    slots: [
      { day: "Mittwoch", time: "17:00 – 19:00 Uhr" },
      { day: "Freitag", time: "17:00 – 19:00 Uhr" },
      { day: "Samstag", time: "14:00 – 16:00 Uhr", note: "Januar – März" },
    ],
  },
};

export const SHOP_QUALITY_TIERS: ShopQualityTier[] = [
  {
    id: "einfach",
    name: "Einfach",
    tagline: "Solide und funktional — budgetfreundlich für grosse Gruppen",
    features: [
      "Ohne Taschen",
      "Einfache Verarbeitung",
      "Funktionale Stoffe",
      "Dezente Details",
    ],
    recommendation: "Für Gruppen, die eine schlichte und sehr budgetfreundliche Lösung wünschen.",
  },
  {
    id: "standard",
    name: "Standard",
    tagline: "Ausgewogene Mittelstufe — Komfort und schöne Verarbeitung",
    features: [
      "Hosentaschen",
      "1–2 Innentaschen",
      "Feinere Verarbeitung",
      "Mittel- bis hochwertige Stoffe",
      "Dekorative Grunddetails",
    ],
    recommendation: "Ideal für klassische Fasnachtsfiguren und Cliquen mit harmonischem Gesamtpaket.",
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Mehr Ausstattung, Komfort und langlebige Qualität",
    features: [
      "Verstärkte Hosentaschen mit Reissverschluss",
      "Mehrere Innentaschen mit Reissverschluss",
      "Gurtschlaufen und stabile Abschlüsse",
      "Hochwertigere Stoffe & Veredelungen",
      "Sehr angenehme Passform",
    ],
    recommendation: "Für Kund:innen, die langlebige Qualität und aufwendigere Optik bevorzugen.",
  },
];

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    id: "stammkostueme",
    name: "Stammkostüme",
    slug: "stammkostueme",
    description: "Einheitliche Kostüme für Cliquen und Guggen — robust, langlebig und ausdrucksstark.",
  },
  {
    id: "sujetkostueme",
    name: "Sujetkostüme",
    slug: "sujetkostueme",
    description: "Kreativ gestaltete Sujetkostüme, perfekt abgestimmt auf Ihr Sujet und professionell ausgearbeitet.",
  },
  {
    id: "basler-nach-mass",
    name: "Basler Fasnachtskostüme nach Mass",
    slug: "basler-nach-mass",
    description:
      "Passgenaue Kostüme für klassische Figuren wie Waggis, Ueli, Blätzlibajass, Edelwaggis, Harlekin, Pierrot und viele weitere.",
  },
  {
    id: "basler-ab-lager",
    name: "Basler Fasnachtskostüme ab Lager",
    slug: "basler-ab-lager",
    description: "Vorproduzierte Auswahl für Kinder und Erwachsene — sofort verfügbar zu attraktiven Preisen.",
  },
];

/** Starter products — client can add more via CMS later */
export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "waggis-standard",
    name: "Waggis Kostüm",
    slug: "waggis-kostuem",
    categoryId: "basler-nach-mass",
    qualityTier: "standard",
    priceFrom: "Ab CHF 450.–",
    shortDescription: "Klassischer Basler Waggis — nach Mass, in der Qualitätsstufe Ihrer Wahl.",
    imageSrc: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/gallery/waggis-clique.jpg",
  },
  {
    id: "edelwaggis-premium",
    name: "Edelwaggis",
    slug: "edelwaggis",
    categoryId: "basler-nach-mass",
    qualityTier: "premium",
    priceFrom: "Ab CHF 680.–",
    shortDescription: "Edle Ausführung mit hochwertigen Stoffen und verstärkten Details.",
    imageSrc: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/gallery/waageclique-edelwaggis.jpg",
  },
  {
    id: "clique-stamm-einfach",
    name: "Clique Stammkostüm",
    slug: "clique-stammkostuem",
    categoryId: "stammkostueme",
    qualityTier: "einfach",
    priceFrom: "Ab CHF 280.–",
    shortDescription: "Einheitliches Clique-Kostüm für Gruppen — robust und budgetfreundlich.",
    imageSrc: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/gallery/gwuerztraminer-2026.jpg",
  },
  {
    id: "kinder-lager",
    name: "Kinderkostüm ab Lager",
    slug: "kinderkostuem-lager",
    categoryId: "basler-ab-lager",
    qualityTier: "standard",
    priceFrom: "Ab CHF 120.–",
    shortDescription: "Sofort verfügbar — begrenzte Grössenauswahl, attraktives Preis-Leistungs-Verhältnis.",
    inStock: true,
    imageSrc: "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/gallery/baenkli-clique.jpg",
  },
];

export const LEGAL_LINKS = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
  { label: "Shop-Bedingungen", href: "/shop-bedingungen" },
  { label: "Widerrufsrecht", href: "/widerruf" },
] as const;

export const NAV_LINKS = [
  { label: "Galerie", href: "/galerie" },
  { label: "Shop", href: "/shop" },
  { label: "Massnehmen", href: "/massfertigung" },
  { label: "Kostümveredelung", href: "/kostuemveredelung" },
  { label: "Team", href: "/ueber-uns#team" },
  { label: "Service", href: "/service" },
  { label: "Kontakt", href: "/kontakt" },
] as const;

/** Leistungen from kostuemschneiderei.ch/service */
export const SERVICE_OFFERINGS = [
  {
    title: "Individuelle Beratung & Entwurfskizzen",
    description: "Gemeinsam entwickeln wir Ihre Kostümidee.",
  },
  {
    title: "Massanfertigung",
    description: "Wir schneidern passgenau und sorgen für einen optimalen Sitz und angenehmen Tragekomfort.",
  },
  {
    title: "Auswahl hochwertiger Stoffe & Materialien",
    description: "Von klassischen Stoffen bis hin zu Glitzer, Samt, Satin oder Spezialtextilien.",
  },
  {
    title: "Optional Stoffdruck & Stickerei",
    description: "Logos, Muster, Namen oder Vereinsfarben — individuelle Drucke oder Stickereien.",
  },
  {
    title: "Veredelung & Applikationen",
    description: "Ob Borten, Glöckchen, Fransen oder Accessoires — der finale Schliff für Ihr Kostüm.",
  },
  {
    title: "Kostüme für Gruppen & Einzelpersonen",
    description: "Einheitlich im Stil, aber auf jedes Gruppenmitglied abgestimmt. Ideal für Guggen, Cliquen oder Fasnachtsvereine.",
  },
] as const;

/** 6-step order process from kostuemschneiderei.ch/service */
export const ORDER_PROCESS_STEPS = [
  {
    number: "1",
    title: "Kontaktaufnahme & erste Informationen",
    description:
      "Sie erreichen uns per E-Mail, Telefon oder Kontaktformular — oder buchen direkt online. Bitte teilen Sie uns die Grösse Ihrer Gruppe und Ihr Sujet oder erste Ideen mit.",
    bullets: ["Grösse der Gruppe", "Sujet oder Gestaltungsideen", "Oder: Termin online buchen"],
  },
  {
    number: "2",
    title: "Beratung & Offerte",
    description: "Nach dem Erstkontakt erhalten Sie persönliche Beratung, Stoff- und Gestaltungsvorschläge sowie eine unverbindliche Offerte.",
    bullets: ["Persönliche Beratung", "Stoff- & Gestaltungsvorschläge", "Unverbindliche Offerte", "Visualisierung Ihres Wunschkostüms"],
  },
  {
    number: "3",
    title: "Definitive Bestellung",
    description: "Sobald Sie den Auftrag bestätigen, planen wir Ihr Projekt verbindlich ein.",
    bullets: ["Detaillierte Materialauswahl", "Grobplanung der Fertigungszeit", "Terminvereinbarung für Massaufnahme(n)"],
  },
  {
    number: "4",
    title: "Massnehmen & Produktionsbeginn",
    description:
      "In der Hochsaison veröffentlichen wir feste Zeitfenster für Massnehmen ohne Voranmeldung. Für entfernte Gruppen bieten wir Massnehmen vor Ort an.",
    bullets: ["Massen ohne Termin in der Hochsaison", "Massnehmen vor Ort nach Absprache", "Produktion nach vollständigen Angaben"],
  },
  {
    number: "5",
    title: "Feinarbeit & Veredelung",
    description: "Applikationen, Stickereien und individuelle Details verleihen dem Kostüm seine charakteristische Ausstrahlung. Jedes Stück durchläuft eine Qualitätskontrolle.",
    bullets: ["Veredelungen & Applikationen", "Qualitätskontrolle", "Aufbereitung & Verpackung"],
  },
  {
    number: "6",
    title: "Abholung / Übergabe",
    description: "Nach Fertigstellung vereinbaren wir einen individuellen Abhol- oder Übergabetermin.",
    bullets: [],
  },
] as const;

/** Appointment types from kostuemschneiderei.ch/bookonline */
export const APPOINTMENT_TYPES = [
  { id: "beratung-gruppe", label: "Beratung Gruppenkostüme", description: "Erstgespräch für Cliquen, Guggen und Gruppen" },
  { id: "beratung-einzel", label: "Beratung Einzelkostüme", description: "Persönliche Beratung für Einzelpersonen" },
  { id: "kurzberatung", label: "Kurzberatung", description: "Kurzes Gespräch zu einer konkreten Frage" },
  { id: "prototyp-gruppe", label: "Besprechung Prototyp Gruppenkostüme", description: "Prototyp und Muster für Gruppenprojekte" },
  { id: "mass-gruppe", label: "Massaufnahme Gruppen", description: "Massnehmen für Gruppenmitglieder" },
  { id: "abholung", label: "Abholung", description: "Abholung fertiger Kostüme" },
  { id: "aenderungen", label: "Änderungen", description: "Anpassungen an bestehenden Kostümen" },
  { id: "anprobe", label: "Anprobe", description: "Anprobe während oder nach der Fertigung" },
] as const;

/** FAQs from kostuemschneiderei.ch/service */
export const SERVICE_FAQS = [
  {
    category: "Anpassung, Pflege & Sonderfälle",
    q: "Gibt es eine Anprobe vor der Fertigstellung?",
    a: "In der Regel nicht nötig. Bei kurzfristiger Lieferung vor der Fasnacht empfehlen wir eine Anprobe zur Sicherheit.",
  },
  {
    category: "Anpassung, Pflege & Sonderfälle",
    q: "Was ist, wenn sich meine Masse nach der ersten Massaufnahme stark ändern?",
    a: "Wir fertigen das Kostüm anhand der Körpermasse an, die zum Zeitpunkt der Massaufnahme ermittelt wurden. Nachträgliche Änderungen aufgrund von Gewichtszu- oder -abnahmen werden als individuelle Nachanpassungen berechnet. Bei grösseren Schwankungen ist eine Neuanfertigung erforderlich.",
  },
  {
    category: "Anpassung, Pflege & Sonderfälle",
    q: "Wie aufwendig sind Änderungen nach der Fertigstellung?",
    a: "Kleinere Änderungen sind in der Regel unkompliziert. Grössere Anpassungen erfordern einen höheren Aufwand und sind kostenpflichtig, sofern sich die Masse seit der Vermessung verändert haben.",
  },
  {
    category: "Anpassung, Pflege & Sonderfälle",
    q: "Was ist, wenn ich mein Kostüm kurzfristig nicht mehr brauche?",
    a: "Bereits in Produktion befindliche Arbeiten können nicht rückerstattet werden.",
  },
  {
    category: "Anpassung, Pflege & Sonderfälle",
    q: "Wie gehe ich mit Lagerung und Feuchtigkeit nach der Fasnacht um?",
    a: "Trocken, gut belüftet und idealerweise hängend oder in einer atmungsaktiven Hülle aufbewahren.",
  },
] as const;
