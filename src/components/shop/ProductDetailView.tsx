"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  getEnabledTiers,
  mergeTierDefinitions,
  TIER_STYLES,
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
  contact?: {
    phone: string;
    phoneHref: string;
    whatsapp: string;
    email: string;
  };
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
  const style = TIER_STYLES[tier.key];
  return (
    <div
      className={cn(
        "border-b border-stone-light transition-colors",
        isSelected && "bg-sand-light/40",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-0 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", style.dot)} />
          <span className="font-serif text-base text-charcoal">{tier.name}</span>
          {tier.tagline && (
            <span className="hidden sm:inline font-sans text-[11px] text-charcoal-lighter">
              — {tier.tagline}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {tier.price && (
            <span className={cn("font-sans text-sm font-semibold", style.accent)}>
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
                    <svg className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", style.accent)} fill="currentColor" viewBox="0 0 20 20">
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

function buildInquiryMessage(productName: string, quality?: string, price?: string) {
  const lines = [`Anfrage zum Produkt: ${productName}`];
  if (quality) lines.push(`Qualitätsstufe: ${quality}`);
  if (price) lines.push(`Richtpreis: ${price}`);
  lines.push("", "Meine Nachricht:", "");
  return lines.join("\n");
}

export function ProductDetailView({ product, tierDefinitions, contact }: ProductDetailViewProps) {
  const enabledTiers = getEnabledTiers(product.tierPricing);
  const availableTierCards = mergeTierDefinitions(tierDefinitions, product.tierPricing).filter((t) => t.available);
  const hasVariants = enabledTiers.length > 0;
  const defaultTier = enabledTiers[0]?.key ?? "standard";

  const [activeImage, setActiveImage] = useState(0);
  const [selectedTier, setSelectedTier] = useState<TierKey>(defaultTier);
  const [openAccordion, setOpenAccordion] = useState<TierKey | null>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [enquiry, setEnquiry] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const images =
    product.galleryUrls.length > 0
      ? product.galleryUrls
      : ["/icons/sewing/tailor-dummy-fashion-sewing-tailoring.svg"];

  const selectedPrice =
    product.tierPricing[selectedTier]?.price ?? enabledTiers[0]?.option.price ?? "";
  const selectedQuality = hasVariants
    ? availableTierCards.find((t) => t.key === selectedTier)?.name ?? "Standard"
    : undefined;

  const inquiryHref = useMemo(() => {
    const p = new URLSearchParams({ produkt: product.name });
    if (hasVariants) {
      if (selectedQuality) p.set("qualitaet", selectedQuality);
      if (selectedPrice) p.set("preis", selectedPrice);
    }
    return `/kontakt?${p.toString()}`;
  }, [product.name, selectedQuality, selectedPrice, hasVariants]);

  function syncMessageFromSelection() {
    setEnquiry((f) => ({
      ...f,
      message: buildInquiryMessage(product.name, selectedQuality, selectedPrice || undefined),
    }));
  }

  function openEnquiryForm() {
    syncMessageFromSelection();
    setSent(false);
    setSubmitError("");
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function handleEnquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          message: enquiry.message || buildInquiryMessage(product.name, selectedQuality, selectedPrice || undefined),
          costumeType: `Katalog: ${product.name}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Fehler beim Senden.");
        return;
      }
      setSent(true);
    } catch {
      setSubmitError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-10 xl:gap-16 items-start">
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px]">
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative shrink-0 w-[60px] aspect-[3/4] sm:w-[68px] rounded-xl overflow-hidden border-2 transition-all bg-sand-light/40",
                    activeImage === i
                      ? "border-periwinkle-dark shadow-soft opacity-100"
                      : "border-stone-light/60 hover:border-periwinkle-light opacity-70 hover:opacity-100",
                  )}
                >
                  <Image src={src} alt="" fill className="object-contain p-1" sizes="80px" />
                </button>
              ))}
            </div>
          )}

          <div className="relative flex-1 aspect-[4/3] max-h-[720px] rounded-[14px] overflow-hidden bg-white border border-stone-light/60">
            {images.map((src, i) => (
              <Image
                key={`main-${src}`}
                src={src}
                alt={product.name}
                fill
                priority={i === 0}
                className={cn(
                  "object-contain object-center transition-opacity duration-300 absolute inset-0",
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

        <div ref={stickyRef} className="lg:sticky lg:top-24 flex flex-col gap-7">
          <div>
            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-periwinkle-dark mb-2">
              {product.category}
            </p>
            <h1 className="font-serif text-[2rem] leading-tight text-charcoal mb-4">{product.name}</h1>
            {product.description && <DescriptionBlock text={product.description} />}
          </div>

          <div className="h-px bg-stone-light" />

          {hasVariants ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-charcoal/50">
                  Qualitätsstufe
                </p>
                <p className={cn("font-serif text-2xl", TIER_STYLES[selectedTier].accent)}>{selectedPrice}</p>
              </div>

              <div className="flex flex-col gap-2">
                {enabledTiers.map(({ key, label, option }) => {
                  const style = TIER_STYLES[key];
                  const isActive = selectedTier === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedTier(key);
                        setEnquiry((f) => {
                          const quality =
                            availableTierCards.find((t) => t.key === key)?.name ?? label;
                          const price = product.tierPricing[key]?.price ?? option.price ?? "";
                          if (!f.message.trim() || f.message.startsWith("Anfrage zum Produkt:")) {
                            return {
                              ...f,
                              message: buildInquiryMessage(product.name, quality, price || undefined),
                            };
                          }
                          return f;
                        });
                      }}
                      className={cn(
                        "flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-sans font-medium border-2 transition-all duration-150",
                        isActive ? style.pillSelected : style.pill,
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className={cn("w-2 h-2 rounded-full shrink-0", style.dot)} />
                        {label}
                      </span>
                      <span
                        className={cn(
                          "text-[12px] font-semibold",
                          isActive ? "text-charcoal/75" : "text-charcoal-lighter",
                        )}
                      >
                        {option.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-charcoal/50 mb-2">
                Preis auf Anfrage
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={openEnquiryForm}
              className="btn-primary w-full justify-center py-3.5 text-base rounded-xl"
            >
              Anfrage senden
            </button>
            {contact && (
              <div className="flex items-center justify-center gap-3">
                <a
                  href={contact.phoneHref}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-stone-light text-charcoal hover:border-periwinkle-dark hover:text-periwinkle-dark transition-colors"
                  aria-label={`Anrufen ${contact.phone}`}
                  title={contact.phone}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-stone-light text-charcoal hover:border-periwinkle-dark hover:text-periwinkle-dark transition-colors"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.139-1.633-.807-1.886-.9-.253-.093-.437-.139-.62.14-.184.278-.713.9-.873 1.085-.16.185-.32.208-.597.07-.277-.139-1.17-.43-2.227-1.372-.823-.734-1.379-1.64-1.54-1.917-.16-.278-.017-.428.122-.566.125-.124.278-.323.416-.485.139-.162.185-.278.278-.463.093-.185.047-.347-.023-.485-.07-.139-.62-1.497-.85-2.05-.224-.54-.45-.466-.62-.475l-.528-.01c-.185 0-.485.07-.739.347-.253.278-.967.945-.967 2.304s.99 2.673 1.127 2.85c.139.185 1.946 2.97 4.715 4.163.66.285 1.174.455 1.575.582.661.21 1.263.18 1.738.11.53-.079 1.633-.668 1.864-1.313.23-.645.23-1.197.16-1.313-.07-.116-.255-.185-.532-.324z" />
                    <path d="M12.004 2.003c-5.523 0-10 4.477-10 10 0 1.761.46 3.412 1.264 4.846L2.003 22l5.29-1.386A9.953 9.953 0 0012.004 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.15a8.13 8.13 0 01-4.14-1.14l-.297-.176-3.14.823.838-3.06-.193-.314a8.13 8.13 0 01-1.25-4.283c0-4.5 3.66-8.16 8.16-8.16s8.16 3.66 8.16 8.16-3.66 8.15-8.138 8.15z" />
                  </svg>
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-stone-light text-charcoal hover:border-periwinkle-dark hover:text-periwinkle-dark transition-colors"
                  aria-label={`E-Mail ${contact.email}`}
                  title={contact.email}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            )}
            <Link
              href="/shop"
              className="btn-outline-dark w-full justify-center py-3 rounded-xl text-sm"
            >
              ← Alle Angebote
            </Link>
            <Link href={inquiryHref} className="text-center font-sans text-[11px] text-charcoal/45 hover:text-periwinkle-dark">
              Oder über die Kontaktseite anfragen
            </Link>
          </div>

          <p className="font-sans text-[11px] text-charcoal/40 leading-relaxed border-t border-stone-light pt-4">
            Massanfertigung nach Mass — Preise sind Richtwerte. Verbindlich wird die Bestellung erst nach
            schriftlicher Bestätigung (Angebot oder Auftragsbestätigung).
          </p>
        </div>
      </div>

      <div ref={formRef} className="mt-16 pt-10 border-t border-stone-light scroll-mt-28">
        <div className="max-w-xl">
          <p className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-charcoal/40 mb-1">
            Unverbindliche Anfrage
          </p>
          <h2 className="font-serif text-2xl text-charcoal mb-2">Zu diesem Kostüm anfragen</h2>
          <p className="font-sans text-sm text-charcoal-lighter mb-6">
            Produkt und gewählte Qualitätsstufe sind vorausgefüllt. Wir melden uns in der Regel innerhalb von 1–2 Werktagen.
          </p>

          {sent ? (
            <div className="rounded-2xl border border-stone-light bg-white p-8 text-center">
              <h3 className="font-serif text-xl text-charcoal mb-2">Vielen Dank!</h3>
              <p className="font-sans text-sm text-charcoal-light mb-4">
                Ihre Anfrage zu «{product.name}» ist bei uns eingegangen.
              </p>
              <button type="button" onClick={() => setSent(false)} className="btn-outline-dark text-xs">
                Neue Anfrage
              </button>
            </div>
          ) : (
            <form onSubmit={handleEnquirySubmit} className="rounded-2xl border border-stone-light bg-white p-6 sm:p-8 flex flex-col gap-4 shadow-soft">
              <label className="flex flex-col gap-1.5">
                <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-warmgrey">
                  Name *
                </span>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={enquiry.name}
                  onChange={(e) => setEnquiry((f) => ({ ...f, name: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-warmgrey">
                  E-Mail *
                </span>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={enquiry.email}
                  onChange={(e) => setEnquiry((f) => ({ ...f, email: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-warmgrey">
                  Telefon
                </span>
                <input
                  type="tel"
                  className="input-field"
                  value={enquiry.phone}
                  onChange={(e) => setEnquiry((f) => ({ ...f, phone: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-warmgrey">
                  Nachricht *
                </span>
                <textarea
                  required
                  rows={6}
                  className="input-field resize-y min-h-[140px]"
                  value={enquiry.message || buildInquiryMessage(product.name, selectedQuality, selectedPrice || undefined)}
                  onChange={(e) => setEnquiry((f) => ({ ...f, message: e.target.value }))}
                  onFocus={() => {
                    if (!enquiry.message.trim()) syncMessageFromSelection();
                  }}
                />
              </label>
              {submitError && <p className="font-sans text-sm text-red-600">{submitError}</p>}
              <button type="submit" disabled={sending} className="btn-primary w-full justify-center py-3 rounded-xl disabled:opacity-60">
                {sending ? "Wird gesendet…" : "Anfrage absenden"}
              </button>
            </form>
          )}
        </div>
      </div>

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
