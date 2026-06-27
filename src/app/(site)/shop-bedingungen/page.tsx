import { PageHero } from "@/components/layout/PageHero";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop-Bedingungen",
};

export default function ShopBedingungenPage() {
  return (
    <>
      <PageHero
        label="Shop"
        title="Shop-Bedingungen"
        subtitle="Zahlung, Lieferung und verbindliche Bestellung im Online-Shop."
        breadcrumbs={[{ label: "Shop-Bedingungen", href: "/shop-bedingungen" }]}
      />
      <section className="py-20 section-bg-white">
        <div className="container-site max-w-3xl space-y-8">
          <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">
            Platzhaltertext — bitte im CMS mit Ihren finalen Shop-Bedingungen ersetzen.
          </p>
          {[
            {
              title: "Verbindliche Bestellung",
              body: "Eine Bestellung im Shop ist zunächst eine Anfrage. Verbindlich wird der Auftrag erst nach schriftlicher Bestätigung durch uns (Angebot, Auftragsbestätigung oder Rechnung).",
            },
            {
              title: "Preise",
              body: "Angezeigte Preise sind Richtwerte oder «ab»-Preise, sofern nicht anders gekennzeichnet. Der endgültige Preis hängt von Mass, Stoff, Qualitätsstufe (Einfach, Standard, Premium) und Veredelung ab.",
            },
            {
              title: "Lieferkosten",
              body: "Lieferkosten und Abholoptionen werden individuell mitgeteilt. Bei Massanfertigungen erfolgt die Übergabe in der Regel nach Terminvereinbarung im Atelier.",
            },
            {
              title: "Massanfertigung & Rückgabe",
              body: "Individuell angefertigte Kostüme sind vom Widerruf ausgeschlossen, sofern gesetzlich zulässig. Details siehe Widerrufsrecht.",
            },
            {
              title: "Zahlungsarten",
              body: "Akzeptierte Zahlungsarten werden bei Auftragsbestätigung mitgeteilt (z. B. Rechnung, TWINT, Banküberweisung — nach Vereinbarung).",
            },
          ].map((s) => (
            <div key={s.title}>
              <h2 className="font-serif text-xl text-charcoal mb-3">{s.title}</h2>
              <p className="font-sans text-sm text-charcoal-light leading-relaxed">{s.body}</p>
            </div>
          ))}
          <p className="pt-4">
            <Link href="/widerruf" className="text-periwinkle-dark hover:underline font-sans text-sm">
              Widerrufsrecht →
            </Link>
            {" · "}
            <Link href="/agb" className="text-periwinkle-dark hover:underline font-sans text-sm">
              AGB →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
