"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { SEARCH_TYPE_LABELS, searchSite } from "@/lib/search-index";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";
  const results = q ? searchSite(q, 24) : [];

  return (
    <section className="py-16 section-bg-white">
      <div className="container-site max-w-2xl">
        {!q ? (
          <p className="font-sans text-sm text-charcoal-light text-center">Bitte geben Sie einen Suchbegriff ein.</p>
        ) : results.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-serif text-xl text-charcoal mb-2">Keine Ergebnisse für «{q}»</p>
            <p className="font-sans text-sm text-charcoal-lighter mb-6">Versuchen Sie andere Begriffe wie «Termin», «Shop» oder «Mass».</p>
            <Link href="/kontakt" className="btn-primary inline-flex">
              Kontakt aufnehmen
            </Link>
          </div>
        ) : (
          <>
            <p className="font-sans text-sm text-charcoal-lighter mb-6">
              {results.length} Treffer für «{q}»
            </p>
            <ul className="flex flex-col gap-3">
              {results.map((result) => (
                <li key={`${result.href}-${result.title}`}>
                  <Link
                    href={result.href}
                    className="block rounded-2xl border border-stone-light px-5 py-4 hover:border-periwinkle-light hover:shadow-soft transition-all"
                  >
                    <span className="font-sans text-[10px] font-semibold tracking-[0.14em] uppercase text-periwinkle-dark">
                      {SEARCH_TYPE_LABELS[result.type]}
                    </span>
                    <span className="block font-serif text-lg text-charcoal mt-1">{result.title}</span>
                    {result.description && (
                      <span className="block font-sans text-sm text-charcoal-light mt-1">{result.description}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}

export default function SuchePage() {
  return (
    <>
      <PageHero label="Suche" title="Suchen" subtitle="Seiten, Leistungen und Shop-Angebote finden." breadcrumbs={[{ label: "Suche", href: "/suche" }]} />
      <Suspense fallback={<div className="py-16 text-center text-charcoal-lighter">Laden…</div>}>
        <SearchResults />
      </Suspense>
    </>
  );
}
