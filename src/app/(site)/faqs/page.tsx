"use client";

import { PageHero } from "@/components/layout/PageHero";
import { useState } from "react";
import Link from "next/link";

const FAQS = [
  { q: "Was kostet eine Massanfertigung?", a: "Die Kosten hängen vom Kostümtyp, den Materialien und dem Aufwand ab. Wir besprechen alles transparent im Erstgespräch und erstellen ein individuelles Angebot. Rüsten Sie sich – es lohnt sich!" },
  { q: "Wie lange dauert die Anfertigung?", a: "In der Regel benötigen wir 4–8 Wochen, je nach Komplexität und Auslastung. Bei Gruppenbestellungen kann es länger dauern. Kontaktieren Sie uns rechtzeitig, besonders vor der Fasnacht." },
  { q: "Wie viele Anproben sind im Preis inbegriffen?", a: "Bei einer Massanfertigung planen wir bis zu drei Anproben ein. Das stellt sicher, dass das Kostüm perfekt sitzt und Ihren Vorstellungen entspricht." },
  { q: "Kann ich auch Änderungen an bestehenden Kostümen vornehmen lassen?", a: "Ja, das ist einer unserer Kerndienste. Wir passen Kostüme an, reparieren Schäden und modernisieren ältere Stücke – schnell, sauber und zu fairen Preisen." },
  { q: "Fertigen Sie auch für ganze Gruppen oder Vereine?", a: "Ja! Wir haben viel Erfahrung mit Gruppenausstattungen für Guggenmusiken, Cliquen und Vereine. Kontaktieren Sie uns für ein Gruppenangebot." },
  { q: "Wie nehme ich Masse, bevor ich zu Ihnen komme?", a: "Sie müssen nichts vorbereiten – wir nehmen alle Masse bei Ihrer ersten Anprobe ab. Falls Sie vorab neugierig sind, finden Sie in unserem Journal eine Anleitung." },
  { q: "Welche Stoffe verwenden Sie?", a: "Wir führen eine grosse Auswahl an hochwertigen Stoffen: Seide, Wolle, Baumwolle, Samt, Dekostoffe und Spezialgewebe. Gerne beraten wir Sie persönlich." },
  { q: "Bieten Sie auch Stoffdruck an?", a: "Ja, auf Anfrage bieten wir Stoffdruck für individuelle Motive und Logos an. Bitte fragen Sie uns im Voraus." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-stone-light rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-white hover:bg-offwhite-warm transition-colors text-left"
      >
        <span className="font-sans text-sm font-medium text-charcoal">{q}</span>
        <svg
          className={`w-4 h-4 text-periwinkle-dark shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 py-4 bg-offwhite-warm border-t border-stone-light">
          <p className="font-sans text-sm text-charcoal-light leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqsPage() {
  return (
    <>
      <PageHero
        label="Häufige Fragen"
        title="FAQs"
        titleAccent="FAQs"
        subtitle="Antworten auf die häufigsten Fragen rund um unsere Leistungen."
        iconSlug="sewing-gauges-fashion-design-sewing-tailoring.svg"
        breadcrumbs={[{ label: "FAQs", href: "/faqs" }]}
      />

      <section className="py-20 bg-offwhite-warm">
        <div className="container-site max-w-3xl mx-auto">
          <div className="flex flex-col gap-3">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="font-sans text-sm text-charcoal-light mb-5">Noch eine Frage? Wir helfen gerne persönlich.</p>
            <Link href="/kontakt" className="btn-primary inline-flex">Frage stellen</Link>
          </div>
        </div>
      </section>
    </>
  );
}
