import { unstable_noStore as noStore } from "next/cache";
import { getSiteSetting } from "@/lib/cms/content";
import { getPageSchema } from "@/lib/cms/page-schemas";

export function getDefaultSectionOrder(pageSlug: string): string[] {
  const schema = getPageSchema(pageSlug);
  return schema?.sections.map((s) => s.key) ?? [];
}

export async function getPageSectionOrder(pageSlug: string): Promise<string[]> {
  // Always read latest order from DB — do not bake into static ISR cache.
  noStore();

  const defaults = getDefaultSectionOrder(pageSlug);
  const saved = await getSiteSetting<unknown>(`page_order_${pageSlug}`, []);
  const savedKeys = Array.isArray(saved)
    ? saved.filter((key): key is string => typeof key === "string")
    : [];
  if (savedKeys.length === 0) return defaults;

  const valid = savedKeys.filter((key) => defaults.includes(key));
  const missing = defaults.filter((key) => !valid.includes(key));
  return [...valid, ...missing];
}

/** Section keys hidden on the public site (still editable in CMS). */
export async function getPageHiddenSections(pageSlug: string): Promise<string[]> {
  noStore();
  const defaults = new Set(getDefaultSectionOrder(pageSlug));
  const saved = await getSiteSetting<unknown>(`page_hidden_${pageSlug}`, []);
  if (!Array.isArray(saved)) return [];
  return saved.filter((key): key is string => typeof key === "string" && defaults.has(key));
}

export function sortSectionsByOrder<T extends { key: string }>(sections: T[], order: string[]): T[] {
  const map = new Map(sections.map((s) => [s.key, s]));
  const sorted: T[] = [];
  for (const key of order) {
    const sec = map.get(key);
    if (sec) sorted.push(sec);
  }
  for (const sec of sections) {
    if (!order.includes(sec.key)) sorted.push(sec);
  }
  return sorted;
}

/** Public render: drop hidden keys while preserving order. */
export function filterVisibleSectionKeys(order: string[], hidden: string[]): string[] {
  const hide = new Set(hidden);
  return order.filter((key) => !hide.has(key));
}
