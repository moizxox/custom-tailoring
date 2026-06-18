"use client";

import Image from "next/image";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

const BADGE_ITEMS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    label: "Persönliche Begleitung",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    label: "Individuelle Beratung",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    label: "Hochwertige Umsetzung",
  },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function HeroSection() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Placeholder — wire to WP contact form or API route
    await new Promise((res) => setTimeout(res, 800));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section className="relative min-h-screen bg-cream overflow-hidden">
      {/* Decorative background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-lavender-lighter/40 blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full bg-mint-light/30 blur-3xl" />
      </div>

      {/* Costume character illustration strip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none select-none"
        aria-hidden
      >
        <Image
          src="/images/banner-characters.png"
          alt=""
          fill
          className="object-contain object-bottom opacity-20"
          priority={false}
          sizes="100vw"
        />
      </div>

      {/* Main Content */}
      <div className="container-site relative z-10 pt-36 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
          {/* Left — Hero copy */}
          <div className="flex flex-col">
            {/* Eyebrow */}
            <p className="section-label mb-5 animate-fade-up">
              Ihre Kostüme. Unser Handwerk.
            </p>

            {/* Headline */}
            <h1 className="font-serif text-5xl xl:text-6xl text-charcoal leading-[1.08] text-balance mb-6 animate-fade-up [animation-delay:100ms] opacity-0">
              Komplettlösungen,{" "}
              <br className="hidden sm:block" />
              die{" "}
              <span className="text-lavender italic">entlasten</span>{" "}
              und{" "}
              <br className="hidden sm:block" />
              <span className="text-lavender">begeistern.</span>
            </h1>

            {/* Sub copy */}
            <p className="font-sans text-base text-charcoal/65 leading-relaxed max-w-lg mb-10 animate-fade-up [animation-delay:200ms] opacity-0">
              Wir begleiten{" "}
              <strong className="font-semibold text-charcoal">Guggenmusiken</strong>,{" "}
              <strong className="font-semibold text-charcoal">Cliquen</strong> und{" "}
              <strong className="font-semibold text-charcoal">Einzelpersonen</strong>{" "}
              von der Idee bis zur letzten Naht – mit Herz, Erfahrung und einem
              Rundum-Service, der Ihnen Zeit schenkt und Ergebnisse, die Eindruck
              hinterlassen.
            </p>

            {/* Badge row */}
            <div className="flex flex-wrap gap-4 animate-fade-up [animation-delay:300ms] opacity-0">
              {BADGE_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 bg-white/70 border border-cream-deep rounded-xl px-4 py-3 text-center"
                >
                  <span className="text-lavender">{item.icon}</span>
                  <span className="font-sans text-xs font-medium text-charcoal leading-tight max-w-[90px]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Scroll hint */}
            <div className="hidden lg:flex items-center gap-3 mt-16 text-charcoal/30">
              <div className="flex flex-col gap-1 items-center">
                <div className="w-px h-10 bg-charcoal/20" />
                <svg className="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <span className="text-xs font-sans tracking-[0.15em] uppercase rotate-0">
                Mehr entdecken
              </span>
            </div>
          </div>

          {/* Right — Contact form glass card */}
          <div className="animate-fade-up [animation-delay:200ms] opacity-0">
            <GlassCard variant="white" padding="lg">
              {submitted ? (
                <div className="flex flex-col items-center text-center py-8 gap-4">
                  <div className="w-16 h-16 rounded-full bg-lavender-lighter flex items-center justify-center">
                    <svg className="w-8 h-8 text-lavender" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl text-charcoal">
                    Danke für Ihre Anfrage!
                  </h3>
                  <p className="text-sm text-charcoal/60 max-w-xs">
                    Wir melden uns persönlich und zeitnah bei Ihnen.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                  >
                    Neue Anfrage
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl text-charcoal leading-snug">
                      Lassen Sie uns Ihr{" "}
                      <span className="text-lavender italic">Projekt</span>{" "}
                      besprechen
                    </h2>
                    <p className="font-sans text-sm text-charcoal/55 mt-2">
                      Wir melden uns persönlich und zeitnah bei Ihnen.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="name" className="sr-only">
                        Ihr Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Ihr Name"
                        required
                        className="input-field"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="sr-only">
                        E-Mail Adresse
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="E-Mail Adresse"
                        required
                        className="input-field"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="sr-only">
                        Telefonnummer
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Telefonnummer (optional)"
                        className="input-field"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="sr-only">
                        Nachricht
                      </label>
                      <textarea
                        id="message"
                        placeholder="Nachricht – Beschreiben Sie kurz Ihr Projekt"
                        rows={4}
                        className="input-field resize-none"
                        value={form.message}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, message: e.target.value }))
                        }
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full justify-center mt-1"
                      disabled={submitting}
                      icon={
                        submitting ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )
                      }
                    >
                      {submitting ? "Wird gesendet…" : "Anfrage senden"}
                    </Button>

                    <p className="text-xs text-charcoal/35 text-center mt-1">
                      Mit dem Absenden stimmen Sie unserer{" "}
                      <a href="/datenschutz" className="underline hover:text-charcoal/60">
                        Datenschutzerklärung
                      </a>{" "}
                      zu.
                    </p>
                  </form>
                </>
              )}
            </GlassCard>

            {/* Trust indicators below card */}
            <div className="flex items-center justify-center gap-6 mt-5">
              {[
                { value: "20+", label: "Jahre Erfahrung" },
                { value: "500+", label: "Kostüme gefertigt" },
                { value: "100%", label: "Massanfertigung" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-2xl text-lavender font-semibold">
                    {stat.value}
                  </p>
                  <p className="font-sans text-[11px] text-charcoal/50 mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
