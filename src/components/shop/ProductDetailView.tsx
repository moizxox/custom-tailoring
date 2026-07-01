"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  getEnabledTiers,
  mergeTierDefinitions,
  type ShopTierDefinition,
  type TierKey,
  type TierPricing,
} from "@/lib/product-tiers";

interface ProductDetailViewProps {
  product: {
    name: string;
    slug: string;
    category: string;
    description: string;
    galleryUrls: string[];
    tierPricing: TierPricing;
  };
  tierDefinitions: ShopTierDefinition[];
}

const DESC_CUTOFF = 220;

function DescriptionBlock({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > DESC_CUTOFF;
  return (
    <div>
      <p className="font-sans text-[14px] text-charcoal-light leading-[1.75] whitespace-pre-line">
        {long && !open ? `${text.slice(0, DESC_CUTOFF).trim()}…` : text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-2 font-sans text-[12px] font-semibold text-periwinkle-dark tracking-wide hover:underline"
        >
          {open ? "Weniger lesen ↑" : "Mehr lesen ↓"}
        </button>
      )}
    </div>
  );
}

function QualityAccordion({
  tier,
  isOpen,
  onToggle,
  isSelected,
}: {
  tier: ReturnType<typeof mergeTierDefinitions>[number];
  isOpen: boolean;
  onToggle: () => void;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        "border-b border-stone-light transition-colors",
        isSelected && "bg-periwinkle-lighter/10",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-0 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          {isSelected && (
            <span className="w-1.5 h-1.5 rounded-full bg-periwinkle-dark shrink-0" />
          )}
          <span className="font-serif text-base text-charcoal">{tier.name}</span>
          {tier.tagline && (
            <span className="hidden sm:inline font-sans text-[11px] text-charcoal-lighter">
              — {tier.tagline}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {tier.price && (
            <span className="font-sans text-sm font-semibold text-periwinkle-dark">
              {tier.price}
            </span>
          )}
          <svg
            className={cn("w-4 h-4 text-charcoal-lighter transition-transform", isOpen && "rotate-180")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="pb-5">
          {tier.productDescription ? (
            <p className="font-sans text-sm text-charcoal-light leading-relaxed">{tier.productDescription}</p>
          ) : (
            tier.features.length > 0 && (
              <ul className="space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-sans text-sm text-charcoal-light">
                    <svg className="w-3.5 h-3.5 text-periwinkle-dark mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      )}
    </div>
  );
}

export function ProductDetailView({ product, tierDefinitions }: ProductDetailViewProps) {
  const enabledTiers = getEnabledTiers(product.tierPricing);
  const availableTierCards = mergeTierDefinitions(tierDefinitions, product.tierPricing).filter((t) => t.available);
  const hasVariants = enabledTiers.length > 0;
  const defaultTier = enabledTiers[0]?.key ?? "standard";

  const [activeImage, setActiveImage] = useState(0);
  const [selectedTier, setSelectedTier] = useState<TierKey>(defaultTier);
  const [openAccordion, setOpenAccordion] = useState<TierKey | null>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const images =
    product.galleryUrls.length > 0
      ? product.galleryUrls
      : ["/icons/sewing/tailor-dummy-fashion-sewing-tailoring.svg"];

  const selectedPrice =
    product.tierPricing[selectedTier]?.price ?? enabledTiers[0]?.option.price ?? "";

  const inquiryHref = useMemo(() => {
    const p = new URLSearchParams({ produkt: product.name });
    if (hasVariants) {
      const label = availableTierCards.find((t) => t.key === selectedTier)?.name ?? "Standard";
      p.set("qualitaet", label);
      if (selectedPrice) p.set("preis", selectedPrice);
    }
    return `/kontakt?${p.toString()}`;
  }, [product.name, selectedTier, selectedPrice, availableTierCards, hasVariants]);

  return (
    <>
      {/* ── Two-column product section ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-10 xl:gap-16 items-start">

        {/* ── Left: image gallery ──────────────────────────────────── */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px]">
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative shrink-0 w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden border-2 transition-all",
                    activeImage === i
                      ? "border-periwinkle-dark shadow-soft"
                      : "border-stone-light/60 hover:border-periwinkle-light opacity-70 hover:opacity-100",
                  )}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="relative flex-1 aspect-[3/4] max-h-[680px] rounded-2xl overflow-hidden bg-sand-light/30">
            {images.map((src, i) => (
              <Image
                key={`main-${src}`}
                src={src}
                alt={product.name}
                fill
                priority={i === 0}
                className={cn(
                  "object-cover transition-opacity duration-300 absolute inset-0",
                  activeImage === i ? "opacity-100" : "opacity-0",
                )}
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            ))}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-charcoal/60 text-white text-[11px] font-sans font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm select-none">
                {activeImage + 1} / {images.length}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: sticky product info ───────────────────────────── */}
        <div ref={stickyRef} className="lg:sticky lg:top-24 flex flex-col gap-7">

          {/* Category + name */}
          <div>
            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-periwinkle-dark mb-2">
              {product.category}
            </p>
            <h1 className="font-serif text-[2rem] leading-tight text-charcoal mb-4">{product.name}</h1>
            {product.description && <DescriptionBlock text={product.description} />}
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-light" />

          {/* Tier picker */}
          {hasVariants ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-charcoal/50">
                  Qualitätsstufe
                </p>
                <p className="font-serif text-2xl text-charcoal">{selectedPrice}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {enabledTiers.map(({ key, label, option }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedTier(key)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-sans font-medium border transition-all duration-150",
                      selectedTier === key
                        ? "bg-charcoal text-white border-charcoal shadow-soft"
                        : "bg-white text-charcoal border-stone-light hover:border-charcoal/40",
                    )}
                  >
                    {label}
                    <span className={cn("ml-2 text-[11px]", selectedTier === key ? "text-white/70" : "text-charcoal-lighter")}>
                      {option.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-charcoal/50 mb-2">
                Preis auf Anfrage
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <Link
              href={inquiryHref}
              className="btn-primary w-full justify-center py-3.5 text-base rounded-xl"
            >
              Anfrage senden
            </Link>
            <Link
              href="/shop"
              className="btn-outline-dark w-full justify-center py-3 rounded-xl text-sm"
            >
              ← Alle Produkte
            </Link>
          </div>

          {/* Note */}
          <p className="font-sans text-[11px] text-charcoal/40 leading-relaxed border-t border-stone-light pt-4">
            Massanfertigung nach Mass — Preise sind Richtwerte. Verbindlich wird die Bestellung erst nach
            schriftlicher Bestätigung (Angebot oder Auftragsbestätigung).
          </p>
        </div>
      </div>

      {/* ── Full-width: quality details accordion ──────────────────── */}
      {hasVariants && availableTierCards.length > 0 && (
        <div className="mt-16 pt-10 border-t border-stone-light">
          <div className="max-w-3xl">
            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-charcoal/40 mb-1">
              Verarbeitung & Material
            </p>
            <h2 className="font-serif text-2xl text-charcoal mb-6">
              Stoffqualität im Detail
            </h2>
            <div>
              {availableTierCards.map((tier) => (
                <QualityAccordion
                  key={tier.key}
                  tier={tier}
                  isOpen={openAccordion === tier.key}
                  isSelected={selectedTier === tier.key}
                  onToggle={() =>
                    setOpenAccordion((prev) => (prev === tier.key ? null : tier.key))
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
