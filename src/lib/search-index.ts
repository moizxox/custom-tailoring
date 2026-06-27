import { LEGAL_LINKS, NAV_LINKS, SHOP_CATEGORIES, SHOP_PRODUCTS, SHOP_QUALITY_TIERS } from "@/lib/site-content";

export type SearchResultType = "page" | "product" | "category" | "legal";

export interface SearchResult {
  title: string;
  description?: string;
  href: string;
  type: SearchResultType;
  keywords?: string;
}

/** Static index — replace/extend via CMS search API in a later phase */
export const SEARCH_INDEX: SearchResult[] = [
  { title: "Startseite", description: "Kostümschneiderei für Guggenmusik, Cliquen und Einzelpersonen", href: "/", type: "page", keywords: "home fasnacht basel" },
  { title: "Shop", description: "Fasnachtskostüme online — Stammkostüme, Sujet, ab Lager", href: "/shop", type: "page", keywords: "kaufen bestellen online" },
  { title: "Galerie", description: "Unsere fertigen Kostüme und Referenzen", href: "/galerie", type: "page", keywords: "bilder fotos referenzen gugge clique" },
  { title: "Mass Nehmen", description: "Massanfertigung und digitales Massblatt", href: "/massfertigung", type: "page", keywords: "mass massnehmen anprobe kundenbereich" },
  { title: "Kostümveredelung", description: "Stickerei, Stoffdruck und textile Veredelung", href: "/kostuemveredelung", type: "page", keywords: "stickerei druck logo veredelung" },
  { title: "Team", description: "Menschen hinter der Kostümschneiderei", href: "/ueber-uns#team", type: "page", keywords: "über uns team mitarbeiter" },
  { title: "Über uns", description: "Tradition, Handwerk und unsere Geschichte", href: "/ueber-uns", type: "page" },
  { title: "Service & Leistungen", description: "Beratung, Anfertigung, Bestellprozess und FAQs", href: "/service", type: "page", keywords: "service leistungen angebot prozess" },
  { title: "Atelier", description: "Werkstatt, Stoffe und Standort", href: "/atelier", type: "page", keywords: "werkstatt nähen" },
  { title: "Stoffe & Materialien", description: "Stoffauswahl und Materialberatung", href: "/stoffe", type: "page", keywords: "stoff fabric material" },
  { title: "Kontakt", description: "Atelier Pratteln und Therwil — Telefon, E-Mail", href: "/kontakt", type: "page", keywords: "kontakt adresse telefon email whatsapp" },
  { title: "Termin buchen", description: "Beratung und Terminvereinbarung mit Standortwahl", href: "/termin", type: "page", keywords: "termin terminbuchung beratung buchen appointment" },
  { title: "FAQs", description: "Häufig gestellte Fragen", href: "/faqs", type: "page", keywords: "fragen antworten hilfe" },
  { title: "Journal", description: "Neuigkeiten aus dem Atelier", href: "/journal", type: "page", keywords: "blog news" },
  ...NAV_LINKS.map((link) => ({
    title: link.label,
    href: link.href,
    type: "page" as const,
  })),
  ...SHOP_CATEGORIES.map((cat) => ({
    title: cat.name,
    description: cat.description,
    href: `/shop#${cat.slug}`,
    type: "category" as const,
    keywords: cat.slug,
  })),
  ...SHOP_PRODUCTS.map((product) => ({
    title: product.name,
    description: product.shortDescription,
    href: `/shop#${product.slug}`,
    type: "product" as const,
    keywords: `${product.priceFrom} ${product.qualityTier ?? ""}`,
  })),
  ...SHOP_QUALITY_TIERS.map((tier) => ({
    title: `Qualität ${tier.name}`,
    description: tier.tagline,
    href: "/shop#qualitaet",
    type: "category" as const,
    keywords: `einfach standard premium qualität ${tier.id}`,
  })),
  ...LEGAL_LINKS.map((link) => ({
    title: link.label,
    href: link.href,
    type: "legal" as const,
    keywords: "recht impressum datenschutz agb",
  })),
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

export function searchSite(query: string, limit = 8): SearchResult[] {
  const q = normalize(query.trim());
  if (!q || q.length < 2) return [];

  const scored = SEARCH_INDEX.map((item) => {
    const haystack = normalize([item.title, item.description, item.keywords].filter(Boolean).join(" "));
    let score = 0;
    if (normalize(item.title) === q) score += 100;
    if (normalize(item.title).startsWith(q)) score += 50;
    if (haystack.includes(q)) score += 30;
    q.split(/\s+/).forEach((word) => {
      if (word.length >= 2 && haystack.includes(word)) score += 10;
    });
    return { item, score };
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const results: SearchResult[] = [];
  for (const { item } of scored) {
    const key = `${item.href}|${item.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(item);
    if (results.length >= limit) break;
  }
  return results;
}

export const SEARCH_TYPE_LABELS: Record<SearchResultType, string> = {
  page: "Seite",
  product: "Produkt",
  category: "Kategorie",
  legal: "Rechtliches",
};
