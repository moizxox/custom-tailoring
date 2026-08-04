import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getPageSchema } from "@/lib/cms/page-schemas";
import { getDefaultHiddenSectionKeys } from "@/lib/cms/modular-sections";

export function getDefaultSectionOrder(pageSlug: string): string[] {
  const schema = getPageSchema(pageSlug);
  return schema?.sections.map((s) => s.key) ?? [];
}

export async function getPageSectionOrder(pageSlug: string): Promise<string[]> {
  noStore();

  const defaults = getDefaultSectionOrder(pageSlug);
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key: `page_order_${pageSlug}` } });
    const saved = row?.value;
    const savedKeys = Array.isArray(saved)
      ? saved.filter((key): key is string => typeof key === "string")
      : [];
    if (savedKeys.length === 0) return defaults;

    const valid = savedKeys.filter((key) => defaults.includes(key));
    const missing = defaults.filter((key) => !valid.includes(key));
    return [...valid, ...missing];
  } catch {
    return defaults;
  }
}

/** Section keys hidden on the public site (still editable in CMS). */
export async function getPageHiddenSections(pageSlug: string): Promise<string[]> {
  noStore();
  const schema = getPageSchema(pageSlug);
  const schemaKeys = new Set(schema?.sections.map((s) => s.key) ?? []);
  const defaultHidden = getDefaultHiddenSectionKeys(schema?.sections ?? []).filter((k) =>
    schemaKeys.has(k),
  );

  try {
    const [hiddenRow, orderRow] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { key: `page_hidden_${pageSlug}` } }),
      prisma.siteSettings.findUnique({ where: { key: `page_order_${pageSlug}` } }),
    ]);

    if (!hiddenRow) return defaultHidden;

    const explicit = Array.isArray(hiddenRow.value)
      ? hiddenRow.value.filter((key): key is string => typeof key === "string" && schemaKeys.has(key))
      : [];

    const hidden = new Set(explicit);
    const orderSaved = Array.isArray(orderRow?.value)
      ? orderRow!.value.filter((key): key is string => typeof key === "string")
      : null;

    // Modular / defaultHidden keys that didn't exist in the last saved order
    // are treated as new → stay hidden until the editor saves with them enabled.
    for (const key of defaultHidden) {
      if (!orderSaved || !orderSaved.includes(key)) {
        hidden.add(key);
      }
    }

    return [...hidden].filter((k) => schemaKeys.has(k));
  } catch {
    return defaultHidden;
  }
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
