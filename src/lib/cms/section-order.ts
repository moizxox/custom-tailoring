import { getSiteSetting } from "@/lib/cms/content";
import { getPageSchema } from "@/lib/cms/page-schemas";

export function getDefaultSectionOrder(pageSlug: string): string[] {
  const schema = getPageSchema(pageSlug);
  return schema?.sections.map((s) => s.key) ?? [];
}

export async function getPageSectionOrder(pageSlug: string): Promise<string[]> {
  const defaults = getDefaultSectionOrder(pageSlug);
  const saved = await getSiteSetting<string[]>(`page_order_${pageSlug}`, []);
  if (!Array.isArray(saved) || saved.length === 0) return defaults;

  const valid = saved.filter((key) => defaults.includes(key));
  const missing = defaults.filter((key) => !valid.includes(key));
  return [...valid, ...missing];
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
