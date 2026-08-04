/**
 * Pure helpers for section order / visibility — safe to import from client components.
 * Keep Prisma / next/cache out of this file.
 */

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
