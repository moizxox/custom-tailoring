import { prisma } from "@/lib/db/prisma";

/**
 * Fetch CMS content for a page section from the database.
 * Falls back to the provided static default if no DB record exists.
 * Safe to call in server components — throws only if DB is truly unreachable.
 */
export async function getCmsContent<T>(
  pageSlug: string,
  sectionKey: string,
  fallback: T
): Promise<T> {
  try {
    const row = await prisma.pageContent.findUnique({
      where: { pageSlug_sectionKey: { pageSlug, sectionKey } },
    });
    if (!row) return fallback;
    return row.content as T;
  } catch {
    // DB not configured or unreachable — return static fallback gracefully
    return fallback;
  }
}

/**
 * Fetch a site-wide setting by key.
 * Falls back to the provided default if not found.
 */
export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key } });
    if (!row) return fallback;
    return row.value as T;
  } catch {
    return fallback;
  }
}
