"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface FaqItemData {
  q: string;
  a: string;
  category?: string;
}

export const FAQ_CATEGORY_ORDER = [
  "Beratung und Planung",
  "Design und Prototyp",
  "Masse und Passform",
  "Gruppenbestellungen und Serienproduktion",
  "Stoffe und Individualisierung",
  "Preise und Zahlung",
  "Produktionszeiten und Fristen",
  "Lieferung und Abholung",
  "Änderungen und Reklamationen",
  "Pflege, Nachbestellungen und Kundenportal",
] as const;

const FALLBACK_CATEGORY = "Allgemein";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-stone-light rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-white hover:bg-offwhite-warm transition-colors text-left"
      >
        <span className="font-sans text-sm font-medium text-charcoal">{q}</span>
        <svg
          className={`w-4 h-4 text-periwinkle-dark shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 py-4 bg-offwhite-warm border-t border-stone-light">
          <p className="font-sans text-sm text-charcoal-light leading-relaxed whitespace-pre-wrap">{a}</p>
        </div>
      )}
    </div>
  );
}

function FaqCategory({
  title,
  items,
  defaultOpen = false,
}: {
  title: string;
  items: FaqItemData[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (items.length === 0) return null;

  return (
    <div className="border border-stone-light rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 bg-offwhite-warm hover:bg-periwinkle-lighter/40 transition-colors text-left"
      >
        <div>
          <p className="font-serif text-lg text-charcoal">{title}</p>
          <p className="font-sans text-xs text-charcoal-lighter mt-0.5">
            {items.length} {items.length === 1 ? "Frage" : "Fragen"}
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-periwinkle-dark shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="p-4 space-y-3 bg-white border-t border-stone-light">
          {items.map((faq, idx) => (
            <FaqItem key={`${faq.q}-${idx}`} q={faq.q} a={faq.a} />
          ))}
        </div>
      )}
    </div>
  );
}

export function groupFaqItems(items: FaqItemData[]) {
  const groups = new Map<string, FaqItemData[]>();
  for (const item of items) {
    const cat =
      typeof item.category === "string" && item.category.trim()
        ? item.category.trim()
        : FALLBACK_CATEGORY;
    const list = groups.get(cat) ?? [];
    list.push(item);
    groups.set(cat, list);
  }

  const ordered: { title: string; items: FaqItemData[] }[] = [];
  for (const title of FAQ_CATEGORY_ORDER) {
    const list = groups.get(title);
    if (list?.length) ordered.push({ title, items: list });
    groups.delete(title);
  }
  if (groups.has(FALLBACK_CATEGORY)) {
    ordered.push({ title: FALLBACK_CATEGORY, items: groups.get(FALLBACK_CATEGORY)! });
    groups.delete(FALLBACK_CATEGORY);
  }
  for (const [title, list] of groups) {
    ordered.push({ title, items: list });
  }
  return ordered;
}

export function FaqAccordion({
  items,
  ctaText,
  ctaButton,
}: {
  items: FaqItemData[];
  ctaText?: string;
  ctaButton?: string;
}) {
  const grouped = useMemo(() => groupFaqItems(items ?? []), [items]);
  const hasCategories = grouped.some(
    (g) => g.title !== FALLBACK_CATEGORY || grouped.length > 1
  );

  return (
    <>
      {hasCategories ? (
        <div className="flex flex-col gap-4">
          {grouped.map((group, idx) => (
            <FaqCategory
              key={group.title}
              title={group.title}
              items={group.items}
              defaultOpen={idx === 0}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {(items ?? []).map((faq, idx) => (
            <FaqItem key={`${faq.q}-${idx}`} q={faq.q} a={faq.a} />
          ))}
        </div>
      )}
      <div className="mt-12 text-center">
        <p className="font-sans text-sm text-charcoal-light mb-5">{ctaText}</p>
        <Link href="/kontakt" className="btn-primary inline-flex">
          {ctaButton}
        </Link>
      </div>
    </>
  );
}
