import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { AtelierTimetable } from "@/components/sections/AtelierTimetable";
import { PeriwinkleCtaSection } from "@/components/sections/PeriwinkleCtaSection";
import { ORDER_PROCESS_STEPS, SERVICE_FAQS, SERVICE_OFFERINGS } from "@/lib/site-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service",
  description: "Fasnachtsatelier — Mass und Budget im Einklang. Leistungen und Bestellprozess für Guggenmusik, Cliquen und Einzelpersonen.",
};

export default function ServicePage() {
  return (
    <>
      <PageHero
        label="Fasnachtsatelier"
        title="Mass und Budget im Einklang"
        titleAccent="Einklang"
        subtitle="Unsere Leistungen im Überblick — für Guggenmusik, Cliquen und Einzelmasken."
        breadcrumbs={[{ label: "Service", href: "/service" }]}
      />

      {/* Leistungen overview — from old /service */}
      <section className="py-20 section-bg-lavender">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-4">Unsere Leistungen im Überblick</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICE_OFFERINGS.map((item) => (
              <article key={item.title} className="rounded-2xl bg-white/80 border border-periwinkle-light/40 p-6 hover:shadow-soft transition-shadow">
                <h3 className="font-serif text-lg text-charcoal mb-2">{item.title}</h3>
                <p className="font-sans text-sm text-charcoal-light leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <Link href="/kontakt" className="btn-secondary">
              Kontakt aufnehmen
            </Link>
            <Link href="/termin" className="btn-primary">
              Termin buchen
            </Link>
          </div>
        </div>
      </section>

      {/* 6-step order process */}
      <section className="py-20 section-bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Bestellprozess</p>
            <h2 className="section-heading">
              So funktioniert der Bestellprozess für Ihr <em className="not-italic italic text-periwinkle-dark">Fasnachtskostüm</em>
            </h2>
          </div>
          <ol className="flex flex-col gap-8">
            {ORDER_PROCESS_STEPS.map((step) => (
              <li key={step.number} className="flex gap-5 sm:gap-6">
                <div className="w-12 h-12 rounded-full bg-periwinkle-lighter border-2 border-periwinkle-light flex items-center justify-center shrink-0">
                  <span className="font-serif text-lg text-periwinkle-dark font-semibold">{step.number}</span>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-serif text-xl text-charcoal mb-2">{step.title}</h3>
                  <p className="font-sans text-sm text-charcoal-light leading-relaxed mb-3">{step.description}</p>
                  {step.bullets.length > 0 && (
                    <ul className="flex flex-col gap-1.5">
                      {step.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 font-sans text-[13px] text-charcoal-lighter">
                          <span className="w-1.5 h-1.5 rounded-full bg-periwinkle shrink-0 mt-1.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Massen ohne Termin — links to timetable */}
      <section id="massen-ohne-termin" className="py-16 section-bg-white border-y border-periwinkle-light/30">
        <div className="container-site max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl text-charcoal mb-2">Massnehmen ohne Voranmeldung</h2>
            <p className="font-sans text-sm text-charcoal-light max-w-2xl mx-auto">
              Die aktuellen Zeitfenster für das Massnehmen veröffentlichen wir auf unserer Webseite — pro Standort Pratteln und Therwil.
            </p>
          </div>
          <AtelierTimetable />
        </div>
      </section>

      {/* FAQs from old service page */}
      <section className="py-20 section-bg-white">
        <div className="container-site max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="section-heading mb-2">Häufig gestellte Fragen</h2>
            <p className="font-sans text-sm text-charcoal-lighter">{SERVICE_FAQS[0]?.category}</p>
          </div>
          <div className="flex flex-col gap-3">
            {SERVICE_FAQS.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-stone-light bg-white overflow-hidden">
                <summary className="cursor-pointer px-6 py-4 font-sans text-sm font-medium text-charcoal hover:bg-offwhite-warm transition-colors list-none flex justify-between items-center gap-4">
                  {faq.q}
                  <span className="text-periwinkle-dark shrink-0 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-6 pb-4 border-t border-stone-light/60">
                  <p className="font-sans text-sm text-charcoal-light leading-relaxed pt-3">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
          <p className="text-center mt-8">
            <Link href="/faqs" className="text-sm text-periwinkle-dark hover:underline">
              Alle FAQs ansehen →
            </Link>
          </p>
        </div>
      </section>

      <PeriwinkleCtaSection />
    </>
  );
}
