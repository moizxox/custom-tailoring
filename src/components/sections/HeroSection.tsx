"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { AcfHero } from "@/types";

// ─── Default ACF data (replaced by WordPress props at runtime) ────────────────
const DEFAULT_DATA: AcfHero = {
  acf_fc_layout: "hero",
  eyebrow_text: "Kostüme mit Charakter",
  heading: "Kleidung,\ndie Persönlichkeit\nformt.",
  heading_accent: "Persönlichkeit",
  subtext:
    "Massgeschneiderte Kostüme. Zeitlos. Individuell. In Handarbeit.",
  cta_primary_label: "Beratung buchen",
  cta_primary_url: "/termin",
  cta_secondary_label: "Unser Angebot",
  cta_secondary_url: "/leistungen",
  show_contact_form: true,
  badges: [
    { icon_slug: "tailor-dummy-fashion-sewing-tailoring.svg", label: "Massanfertigung" },
    { icon_slug: "tape-measure-sewing-tailoring-size.svg", label: "Massnehmen" },
    { icon_slug: "scissor-cut-fabric-sewing.svg", label: "Handarbeit" },
  ],
};

interface HeroSectionProps {
  acf?: Partial<AcfHero>;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

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

  // Render heading with accent word in periwinkle italic
  const renderHeading = (text: string, accent?: string) => {
    if (!accent) return <>{text}</>;
    const parts = text.split(new RegExp(`(${accent})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === accent.toLowerCase() ? (
            <em key={i} className="not-italic text-periwinkle-dark italic">
              {part}
            </em>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <section className="relative min-h-screen bg-offwhite overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <div className="absolute top-0 right-0 w-[55%] h-full bg-sand-light/50" />
        <div className="absolute -top-40 right-[30%] w-[500px] h-[500px] rounded-full bg-periwinkle-lighter/60 blur-3xl" />
      </div>

      {/* Decorative tailor-dummy illustration — top right corner */}
      <div
        className="absolute top-16 right-0 w-[420px] h-[480px] pointer-events-none select-none hidden xl:block"
        aria-hidden
      >
        <Image
          src="/images/illustrations/tailor-dummy.png"
          alt=""
          fill
          className="object-contain object-right-top opacity-30"
          sizes="420px"
          priority={false}
        />
      </div>

      {/* Floating sewing icon accents */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
        {[
          { src: "/icons/sewing/spool-of-thread-sewing-tailoring-needle.svg", x: "8%", y: "20%", size: 28, rotate: -12 },
          { src: "/icons/sewing/pin-cushion-handcraft-sewing-tailoring.svg", x: "6%", y: "60%", size: 24, rotate: 8 },
          { src: "/icons/sewing/button-sewing-tailoring-handcraft.svg", x: "92%", y: "72%", size: 22, rotate: 20 },
        ].map((icon, i) => (
          <div
            key={i}
            className="absolute opacity-[0.12]"
            style={{ left: icon.x, top: icon.y, transform: `rotate(${icon.rotate}deg)` }}
          >
            <Image src={icon.src} alt="" width={icon.size} height={icon.size} className="icon-charcoal" />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="container-site relative z-10 pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 xl:gap-16 items-start">

          {/* ── Left: Hero copy ─────────────────────────────────────────────── */}
          <div className="flex flex-col">
            {/* Eyebrow */}
            <p className="section-label mb-6 animate-fade-up">
              {data.eyebrow_text}
            </p>

            {/* Headline — large serif, multi-line */}
            <h1 className="font-serif text-[3.2rem] lg:text-[4rem] xl:text-[4.5rem] text-charcoal leading-[1.06] text-balance mb-7 animate-fade-up [animation-delay:80ms] opacity-0">
              {renderHeading(data.heading.replace(/\n/g, " "), data.heading_accent)}
            </h1>

            {/* Sub copy */}
            <p className="font-sans text-base text-charcoal-light leading-relaxed max-w-sm mb-10 animate-fade-up [animation-delay:160ms] opacity-0">
              {data.subtext}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-12 animate-fade-up [animation-delay:220ms] opacity-0">
              <Link href={data.cta_primary_url} className="btn-primary">
                {data.cta_primary_label}
              </Link>
              {data.cta_secondary_label && (
                <Link href={data.cta_secondary_url ?? "#"} className="btn-outline-dark">
                  {data.cta_secondary_label}
                </Link>
              )}
            </div>

            {/* Badges row */}
            {data.badges.length > 0 && (
              <div className="flex flex-wrap gap-3 animate-fade-up [animation-delay:300ms] opacity-0">
                {data.badges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2.5 bg-white/70 border border-stone-light rounded-full px-4 py-2"
                  >
                    <Image
                      src={`/icons/sewing/${badge.icon_slug}`}
                      alt=""
                      width={18}
                      height={18}
                      className="icon-periwinkle shrink-0"
                    />
                    <span className="font-sans text-xs font-medium text-charcoal-light">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Contact form card ─────────────────────────────────────── */}
          {data.show_contact_form && (
            <div className="animate-fade-up [animation-delay:160ms] opacity-0">
              <div className="glass-card p-7">
                {submitted ? (
                  <div className="flex flex-col items-center text-center py-8 gap-4">
                    <div className="w-14 h-14 rounded-full bg-periwinkle-lighter flex items-center justify-center">
                      <Image
                        src="/icons/sewing/sewing-machine-sewing-tailoring-cloth.svg"
                        alt=""
                        width={28}
                        height={28}
                        className="icon-periwinkle"
                      />
                    </div>
                    <h3 className="font-serif text-2xl text-charcoal">Vielen Dank!</h3>
                    <p className="font-sans text-sm text-charcoal-light max-w-[220px]">
                      Wir melden uns persönlich und zeitnah bei Ihnen.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-outline-dark text-xs mt-1"
                    >
                      Neue Anfrage
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="section-label mb-1">Kontakt</p>
                    <h2 className="font-serif text-xl text-charcoal mb-1">
                      Anfrage senden
                    </h2>
                    <p className="font-sans text-xs text-charcoal-lighter mb-5">
                      Wir antworten persönlich und zeitnah.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="Name"
                        required
                        className="input-field"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      />
                      <input
                        type="email"
                        placeholder="E-Mail"
                        required
                        className="input-field"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      />
                      <input
                        type="tel"
                        placeholder="Telefon"
                        className="input-field"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      />
                      <textarea
                        placeholder="Nachricht"
                        rows={3}
                        className="input-field resize-none"
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary justify-center mt-1"
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
                          "Anfragen"
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
