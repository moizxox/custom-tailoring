import { PAGE_SCHEMAS } from "@/lib/cms/page-schemas";

/**
 * Slugs that must not be used for custom pages — they already have App Router pages
 * or are system prefixes. Custom pages live at `/{slug}` (not `/seite/{slug}`).
 */
const EXTRA_RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "kundenbereich",
  "katalog",
  "suche",
  "leistungen",
  "massen-ohne-termin",
  "seite",
  "login",
  "uploads",
  "documents",
  "icons",
  "images",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

export function getReservedCustomSlugs(): Set<string> {
  const reserved = new Set<string>(EXTRA_RESERVED_SLUGS);
  for (const page of PAGE_SCHEMAS) {
    if (page.slug === "home") {
      reserved.add("home");
      continue;
    }
    const segment = page.path.replace(/^\//, "").split("/")[0];
    if (segment) reserved.add(segment);
  }
  return reserved;
}

export function isReservedCustomSlug(slug: string): boolean {
  return getReservedCustomSlugs().has(slug.trim().toLowerCase());
}

export function customPagePublicPath(slug: string): string {
  return `/${slug}`;
}
