"use client";

import Image from "next/image";
import Link from "next/link";
import { createElement } from "react";
import { HeroConfettiBackground } from "@/components/decor/HeroConfettiBackground";
import { AccentHeadingText } from "@/components/ui/AccentHeadingText";
import type { HeadingTag } from "@/lib/cms/helpers";

interface AcfHero {
  acf_fc_layout: "hero";
  eyebrow_text: string;
  heading: string;
  heading_accent: string;
  subtext: string;
  cta_primary_label: string;
  cta_primary_url: string;
  cta_secondary_label?: string;
  cta_secondary_url?: string;
  show_contact_form: boolean;
  badges: { icon_slug: string; label: string }[];
  intro_points?: { text: string }[];
}

const DEFAULT_DATA: AcfHero = {
  acf_fc_layout: "hero",
  eyebrow_text: "Kostümschneiderei Basel",
  heading: "Ihre Kostüme.\nUnser Handwerk.",
  heading_accent: "Handwerk.",
  subtext:
    "Wir sind Ihre Kostümschneiderei in Basel – spezialisiert auf massgeschneiderte Kostüme für Guggenmusiken, Cliquen und Einzelpersonen. Von der ersten Skizze über Massnehmen und Stoffauswahl bis zur finalen Anprobe begleiten wir Sie persönlich, präzise und mit echter Leidenschaft fürs Handwerk.",
  cta_primary_label: "Termin buchen",
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

const DEFAULT_INTRO_POINTS = [
  "Kostüme für Fasnacht, Bühne und besondere Anlässe",
  "Beratung, Schnitt und Anfertigung aus einer Hand",
  "Persönlicher Service – von der Idee bis zur letzten Naht",
];

interface HeroSectionProps {
  acf?: Partial<AcfHero>;
  headingTag?: HeadingTag;
}

export function HeroSection({ acf, headingTag = "h1" }: HeroSectionProps) {
  const data = {
    ...DEFAULT_DATA,
    ...acf,
    badges: Array.isArray(acf?.badges) && acf.badges.length > 0
      ? acf.badges as typeof DEFAULT_DATA.badges
      : DEFAULT_DATA.badges,
  };
  const introPoints: string[] = Array.isArray(acf?.intro_points) && (acf.intro_points as unknown[]).length > 0
    ? (acf.intro_points as { text: string }[]).map((p) => p.text)
    : DEFAULT_INTRO_POINTS;

  const renderHeading = () => {
    const normalizedHeading = data.heading
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/\r\n/g, "\n");
    const lines = normalizedHeading.split("\n");
    return lines.map((line, li) => {
      if (data.heading_accent && line.includes(data.heading_accent)) {
        return (
          <span key={li} className="block">
            <AccentHeadingText heading={line} accent={data.heading_accent} />
          </span>
        );
      }
      return (
        <span key={li} className="block">
          {line}
        </span>
      );
    });
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col overflow-hidden bg-offwhite">
      <HeroConfettiBackground className="z-0" />

      <div className="relative z-10 flex-1 flex flex-col justify-center w-full px-5 sm:px-8 lg:px-12 xl:px-16 pt-28 pb-16 lg:pt-36 lg:pb-24 ">
        <div className="w-full container-site text-center">
          <div className="inline-flex items-center gap-2.5 bg-white/90 border border-periwinkle-light/50 ring-1 ring-gold-muted/30 px-4 py-1.5 rounded-full mb-8 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-muted shrink-0" />
            <span className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-gold-deeper">{data.eyebrow_text}</span>
          </div>

          {createElement(
            headingTag,
            {
              className:
                "font-sans font-semibold tracking-tight text-[2.75rem] sm:text-[3.6rem] lg:text-[4.25rem] xl:text-[5rem] text-charcoal leading-[1.04] mb-6 animate-fade-up [animation-delay:60ms] opacity-0",
            },
            renderHeading()
          )}

          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-up [animation-delay:100ms] opacity-0">
            <div className="line-gold-dashed w-12 shrink-0 opacity-90" />
            <Image src="/icons/sewing/needle-threader-fashion-design-sewing-tailoring.svg" alt="" width={22} height={22} className="icon-gold" />
            <div className="line-gold-dashed flex-1 max-w-[120px] opacity-75" />
          </div>

          <p className="font-sans text-base sm:text-[17px] lg:text-lg text-charcoal-light leading-[1.75] max-w-4xl mx-auto mb-6 animate-fade-up [animation-delay:140ms] opacity-0">
            {data.subtext}
          </p>

          <ul className="inline-flex flex-col items-start gap-2.5 mb-8 max-w-2xl text-left animate-fade-up [animation-delay:160ms] opacity-0">
            {introPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5 font-sans text-sm sm:text-[15px] text-charcoal-light">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-periwinkle shrink-0" />
                {point}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-fade-up [animation-delay:180ms] opacity-0">
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
            <div className="flex flex-wrap justify-center gap-2.5 animate-fade-up [animation-delay:220ms] opacity-0">
              {data.badges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 bg-white/85 border border-periwinkle-light/40 ring-1 ring-gold-muted/15 rounded-full pl-2 pr-4 py-1.5">
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
    </section>
  );
}
