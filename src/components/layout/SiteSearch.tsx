"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SEARCH_TYPE_LABELS, searchSite, type SearchResult } from "@/lib/search-index";

interface SiteSearchProps {
  className?: string;
  /** Compact: icon-only until expanded (mobile) */
  variant?: "bar" | "compact";
  onNavigate?: () => void;
}

export function SiteSearch({ className, variant = "bar", onNavigate }: SiteSearchProps) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(variant === "bar");
  const [results, setResults] = useState<SearchResult[]>([]);

  const runSearch = useCallback((value: string) => {
    setQuery(value);
    const next = searchSite(value);
    setResults(next);
    setOpen(value.trim().length >= 2);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        if (variant === "compact") setExpanded(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [variant]);

  const goToFullSearch = () => {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    onNavigate?.();
    router.push(`/suche?q=${encodeURIComponent(q)}`);
  };

  const pickResult = (href: string) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    if (variant === "compact") setExpanded(false);
    onNavigate?.();
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      if (variant === "compact") setExpanded(false);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (results.length > 0) pickResult(results[0].href);
      else goToFullSearch();
    }
  };

  if (variant === "compact" && !expanded) {
    return (
      <button
        type="button"
        onClick={() => {
          setExpanded(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full",
          "border border-periwinkle-light/50 bg-white/70 text-charcoal/60 hover:text-periwinkle-dark hover:border-periwinkle-light transition-colors",
          className,
        )}
        aria-label="Suche öffnen"
      >
        <SearchIcon className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          goToFullSearch();
        }}
        className="relative"
      >
        <label htmlFor={`site-search-${listId}`} className="sr-only">
          Website durchsuchen
        </label>
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none" />
        <input
          ref={inputRef}
          id={`site-search-${listId}`}
          type="search"
          value={query}
          onChange={(e) => runSearch(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Suchen"
          autoComplete="off"
          className={cn(
            "w-full font-sans text-[13px] text-charcoal placeholder:text-charcoal/40",
            "bg-white/75 border border-periwinkle-light/45 rounded-full",
            "pl-10 pr-4 py-2 outline-none transition-all duration-200",
            "focus:border-periwinkle focus:bg-white focus:shadow-soft",
            variant === "bar" ? "w-[min(42vw,200px)] xl:w-[220px]" : "w-full",
          )}
        />
      </form>

      {open && (
        <div
          className={cn(
            "absolute top-[calc(100%+8px)] right-0 z-[60] w-[min(calc(100vw-2rem),320px)]",
            "rounded-2xl border border-stone-light bg-white/98 backdrop-blur-md shadow-card overflow-hidden",
          )}
        >
          {results.length > 0 ? (
            <ul role="listbox" aria-label="Suchergebnisse" className="max-h-[min(60vh,320px)] overflow-y-auto py-1">
              {results.map((result) => (
                <li key={`${result.href}-${result.title}`}>
                  <button
                    type="button"
                    role="option"
                    onClick={() => pickResult(result.href)}
                    className="w-full text-left px-4 py-3 hover:bg-periwinkle-lighter/50 transition-colors border-b border-stone-light/40 last:border-0"
                  >
                    <span className="block font-sans text-[10px] font-semibold tracking-[0.14em] uppercase text-periwinkle-dark mb-0.5">
                      {SEARCH_TYPE_LABELS[result.type]}
                    </span>
                    <span className="block font-sans text-sm font-medium text-charcoal">{result.title}</span>
                    {result.description && (
                      <span className="block font-sans text-[11px] text-charcoal-lighter mt-0.5 line-clamp-2">{result.description}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-5 font-sans text-sm text-charcoal-lighter text-center">Keine Treffer — Enter für Volltextsuche</p>
          )}
          <button
            type="button"
            onClick={goToFullSearch}
            className="w-full px-4 py-2.5 text-center font-sans text-[12px] text-periwinkle-dark hover:bg-periwinkle-lighter/40 border-t border-stone-light/50 transition-colors"
          >
            Alle Ergebnisse für «{query}» →
          </button>
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}
