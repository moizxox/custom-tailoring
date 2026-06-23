"use client";

import Image from "next/image";
import Link from "next/link";
import type { AcfHero } from "@/types";
import { BackgroundDecor } from "@/components/decor/BackgroundDecor";

const DEFAULT_DATA: AcfHero = {
  acf_fc_layout: "hero",
  eyebrow_text: "Kostümschneiderei Basel",
  heading: "Ihre Kostüme.\nUnser Handwerk.",
  heading_accent: "Handwerk.",
  subtext:
    "Wir begleiten Guggenmusiken, Cliquen und Einzelpersonen von der Idee bis zur letzten Naht – persönlich, präzise und mit Leidenschaft.",
  cta_primary_label: "Beratung buchen",
  cta_primary_url: "/termin",
  cta_secondary_label: "Leistungen entdecken",
  cta_secondary_url: "/leistungen",
  show_contact_form: true,
  badges: [
    { icon_slug: "tailor-dummy-fashion-sewing-tailoring.svg", label: "Massanfertigung" },
    { icon_slug: "tape-measure-sewing-tailoring-size.svg", label: "Massnehmen" },
    { icon_slug: "scissor-cut-fabric-sewing.svg", label: "Handarbeit" },
  ],
};

const STATS = [
  { value: "20+", label: "Jahre Erfahrung" },
  { value: "500+", label: "Kostüme gefertigt" },
  { value: "100%", label: "Massarbeit" },
  { value: "Basel", label: "Seit 2003" },
];

interface HeroSectionProps { acf?: Partial<AcfHero> }

export function HeroSection({ acf }: HeroSectionProps) {
  const data = { ...DEFAULT_DATA, ...acf };

  const renderHeading = () => {
    const lines = data.heading.split("\n");
    return lines.map((line, li) => {
      if (data.heading_accent && line.includes(data.heading_accent)) {
        const parts = line.split(data.heading_accent);
        return (
          <span key={li} className="block">
            {parts[0]}
            <em className="not-italic italic text-periwinkle-dark">{data.heading_accent}</em>
            {parts[1]}
          </span>
        );
      }
      return <span key={li} className="block">{line}</span>;
    });
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col overflow-hidden bg-gradient-to-br from-offwhite via-offwhite-warm to-sand-light/25">
      <BackgroundDecor variant="hero" />

      {/* ── Visual hero — full width, room for figure decor ───────────────── */}
      <div className="container-site relative z-10 flex-1 flex flex-col justify-center pt-28 pb-12 lg:pt-40 lg:pb-20">
        <div className="max-w-2xl lg:max-w-3xl">
          <div className="inline-flex items-center gap-2.5 bg-white border border-gold-muted ring-1 ring-gold-muted/40 px-4 py-1.5 rounded-full mb-8 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-muted shrink-0" />
            <span className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-gold-deeper">
              {data.eyebrow_text}
            </span>
          </div>

          <h1 className="font-serif text-[3rem] sm:text-[3.8rem] lg:text-[4.5rem] xl:text-[5.5rem] text-charcoal leading-[1.02] mb-7 animate-fade-up [animation-delay:60ms] opacity-0">
            {renderHeading()}
          </h1>

          <div className="flex items-center gap-3 mb-7 animate-fade-up [animation-delay:100ms] opacity-0">
            <div className="line-gold-dashed w-12 shrink-0 opacity-90" />
            <Image src="/icons/sewing/needle-threader-fashion-design-sewing-tailoring.svg" alt="" width={22} height={22} className="icon-gold" />
            <div className="line-gold-dashed flex-1 max-w-[100px] opacity-75" />
          </div>

          <p className="font-sans text-base sm:text-[17px] text-charcoal-light leading-[1.75] max-w-[520px] mb-10 animate-fade-up [animation-delay:140ms] opacity-0">
            {data.subtext}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-10 animate-fade-up [animation-delay:180ms] opacity-0">
            <Link
              href={data.cta_primary_url}
              className="inline-flex items-center gap-2 bg-periwinkle hover:bg-periwinkle-dark text-charcoal hover:text-white font-sans font-medium text-sm px-6 py-3 rounded-full transition-all duration-200 shadow-soft hover:shadow-periwinkle"
            >
              {data.cta_primary_label}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            {data.cta_secondary_label && (
              <Link href={data.cta_secondary_url ?? "#"} className="btn-secondary px-6 py-3">
                {data.cta_secondary_label}
              </Link>
            )}
          </div>

          {data.badges.length > 0 && (
            <div className="flex flex-wrap gap-2.5 animate-fade-up [animation-delay:220ms] opacity-0">
              {data.badges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 bg-white/80 border border-stone-light/80 ring-1 ring-gold-muted/10 rounded-full pl-2 pr-4 py-1.5"
                >
                  <div className="w-9 h-9 rounded-full bg-gold-lighter/60 flex items-center justify-center">
                    <Image src={`/icons/sewing/${badge.icon_slug}`} alt="" width={18} height={18} className="icon-gold" />
                  </div>
                  <span className="font-sans text-[11px] font-medium text-charcoal-light">{badge.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 border-t border-dashed border-gold-muted/60 bg-white/50 backdrop-blur-sm mt-auto">
        <div className="container-site py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-stone-light">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-2 px-4 text-center">
                <span className="font-serif text-2xl text-periwinkle-dark font-semibold">{stat.value}</span>
                <span className="font-sans text-[11px] text-charcoal-lighter mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
