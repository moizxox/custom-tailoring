"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
interface FormState { name: string; email: string; phone: string; message: string }

export function HeroSection({ acf }: HeroSectionProps) {
  const data = { ...DEFAULT_DATA, ...acf };
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted(true);
  };

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
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-offwhite">
      <BackgroundDecor variant="hero" />

      {/* Right content panel — soft glass tint */}
      <div
        className="absolute inset-y-0 right-0 w-full lg:w-[44%] bg-white/30 backdrop-blur-[2px] pointer-events-none"
        aria-hidden
      />

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <div className="container-site relative z-10 flex-1 flex flex-col justify-center pt-28 pb-10 lg:pt-36 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-10 xl:gap-16 items-center">

          {/* ── LEFT: Copy ──────────────────────────────────────────────────── */}
          <div className="flex flex-col">

            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2.5 self-start bg-white border border-gold-muted ring-1 ring-gold-dark/20 px-4 py-1.5 rounded-full mb-8 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark shrink-0" />
              <span className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-periwinkle-dark">
                {data.eyebrow_text}
              </span>
            </div>

            {/* H1 — large, two-line serif */}
            <h1 className="font-serif text-[3rem] sm:text-[3.8rem] lg:text-[4.2rem] xl:text-[5rem] text-charcoal leading-[1.04] mb-7 animate-fade-up [animation-delay:60ms] opacity-0">
              {renderHeading()}
            </h1>

            {/* Ornamental divider */}
            <div className="flex items-center gap-3 mb-7 animate-fade-up [animation-delay:100ms] opacity-0">
              <div className="line-gold-dashed w-10 shrink-0 opacity-90" />
              <Image src="/icons/sewing/needle-threader-fashion-design-sewing-tailoring.svg" alt="" width={16} height={16} className="icon-periwinkle" />
              <div className="line-gold-dashed flex-1 max-w-[72px] opacity-75" />
            </div>

            {/* Sub copy */}
            <p className="font-sans text-[15px] text-charcoal-light leading-[1.75] max-w-[480px] mb-10 animate-fade-up [animation-delay:140ms] opacity-0">
              {data.subtext}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-12 animate-fade-up [animation-delay:180ms] opacity-0">
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

            {/* Service badges */}
            {data.badges.length > 0 && (
              <div className="flex flex-wrap gap-2.5 animate-fade-up [animation-delay:220ms] opacity-0">
                {data.badges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 bg-white/80 border border-stone-light/80 ring-1 ring-gold-muted/10 rounded-full pl-2 pr-4 py-1.5"
                  >
                    <div className="w-6 h-6 rounded-full bg-periwinkle-lighter flex items-center justify-center">
                      <Image src={`/icons/sewing/${badge.icon_slug}`} alt="" width={13} height={13} className="icon-periwinkle" />
                    </div>
                    <span className="font-sans text-[11px] font-medium text-charcoal-light">{badge.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Contact form card ─────────────────────────────────────── */}
          {data.show_contact_form && (
            <div className="animate-fade-up [animation-delay:100ms] opacity-0 w-full">
              {/* Sewing machine watermark behind card */}
              <div className="relative">
                <div className="absolute -bottom-6 -right-4 w-36 h-36 pointer-events-none select-none opacity-[0.07]" aria-hidden>
                  <Image src="/icons/sewing/sewing-machine-sewing-tailoring-cloth.svg" alt="" fill className="object-contain icon-charcoal" />
                </div>

                {/* Card */}
                <div className="relative bg-white rounded-3xl shadow-card border border-stone-light ring-1 ring-gold-muted/15 overflow-hidden">
                  {/* Card top accent bar */}
                  <div className="h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-light" />

                  <div className="p-7">
                    {submitted ? (
                      <div className="flex flex-col items-center text-center py-10 gap-4">
                        <div className="w-16 h-16 rounded-full bg-periwinkle-lighter flex items-center justify-center">
                          <svg className="w-7 h-7 text-periwinkle-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="font-serif text-2xl text-charcoal">Vielen Dank!</h3>
                        <p className="font-sans text-sm text-charcoal-light max-w-[200px] leading-relaxed">
                          Wir melden uns persönlich und zeitnah bei Ihnen.
                        </p>
                        <button onClick={() => setSubmitted(false)} className="text-xs font-sans text-periwinkle-dark hover:underline mt-1">
                          Neue Anfrage senden
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Card header */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-10 h-10 rounded-xl bg-periwinkle-lighter flex items-center justify-center shrink-0">
                            <Image src="/icons/sewing/pencil-sewing-tailoring-drawing.svg" alt="" width={20} height={20} className="icon-periwinkle" />
                          </div>
                          <div>
                            <h2 className="font-serif text-lg text-charcoal leading-tight">Anfrage senden</h2>
                            <p className="font-sans text-[11px] text-charcoal-lighter">Wir antworten persönlich und zeitnah.</p>
                          </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block font-sans text-[10px] font-semibold tracking-[0.12em] uppercase text-charcoal-lighter mb-1.5">Name *</label>
                              <input type="text" required placeholder="Ihr Name" className="input-field text-[13px] py-2.5" value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} />
                            </div>
                            <div>
                              <label className="block font-sans text-[10px] font-semibold tracking-[0.12em] uppercase text-charcoal-lighter mb-1.5">Telefon</label>
                              <input type="tel" placeholder="+41 ..." className="input-field text-[13px] py-2.5" value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))} />
                            </div>
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] font-semibold tracking-[0.12em] uppercase text-charcoal-lighter mb-1.5">E-Mail *</label>
                            <input type="email" required placeholder="ihre@email.ch" className="input-field text-[13px] py-2.5" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))} />
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] font-semibold tracking-[0.12em] uppercase text-charcoal-lighter mb-1.5">Nachricht</label>
                            <textarea rows={3} placeholder="Wie können wir Ihnen helfen?" className="input-field resize-none text-[13px]" value={form.message} onChange={(e) => setForm(f => ({...f, message: e.target.value}))} />
                          </div>

                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full mt-1 flex items-center justify-center gap-2 bg-periwinkle hover:bg-periwinkle-dark text-charcoal hover:text-white font-sans font-medium text-sm py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
                          >
                            {submitting ? (
                              <>
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Wird gesendet…
                              </>
                            ) : (
                              <>
                                Anfrage absenden
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                              </>
                            )}
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats bar ────────────────────────────────────────────────────────── */}
      <div className="relative z-10 border-t-2 border-dashed border-gold-dark/50 bg-white/60 backdrop-blur-sm">
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
