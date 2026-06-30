"use client";

import Link from "next/link";
import { useState } from "react";

export interface FaqItemData {
  q: string;
  a: string;
}

function FaqItem({ q, a }: FaqItemData) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-stone-light rounded-xl overflow-hidden">
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
          <p className="font-sans text-sm text-charcoal-light leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
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
  return (
    <>
      <div className="flex flex-col gap-3">
        {items.map((faq) => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>
      <div className="mt-12 text-center">
        <p className="font-sans text-sm text-charcoal-light mb-5">{ctaText}</p>
        <Link href="/kontakt" className="btn-primary inline-flex">
          {ctaButton}
        </Link>
      </div>
    </>
  );
}
