import { PageHero } from "@/components/layout/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Widerrufsrecht",
};

export default function WiderrufPage() {
  return (
    <>
      <PageHero label="Rechtliches" title="Widerrufsrecht" breadcrumbs={[{ label: "Widerruf", href: "/widerruf" }]} />
      <section className="py-20 section-bg-white">
        <div className="container-site max-w-3xl space-y-6">
          <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">
            Platzhaltertext — bitte durch Ihre rechtlich geprüften Widerrufsbelehrung ersetzen (CMS).
          </p>
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">Massanfertigungen</h2>
            <p className="font-sans text-sm text-charcoal-light leading-relaxed">
              Bei individuell nach Kundenspezifikation angefertigten Kostümen kann das Widerrufsrecht eingeschränkt oder ausgeschlossen sein.
              Bitte klären Sie Details vor Bestellung mit uns.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">Lagerware</h2>
            <p className="font-sans text-sm text-charcoal-light leading-relaxed">
              Für vorproduzierte Artikel ab Lager gelten die gesetzlichen Bestimmungen, sofern anwendbar. Zustand und Fristen werden bei Bestellung mitgeteilt.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
