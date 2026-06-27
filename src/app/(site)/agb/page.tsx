import { PageHero } from "@/components/layout/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen (AGB)",
};

const SECTIONS = [
  {
    title: "1. Geltungsbereich",
    body: "Diese Allgemeinen Geschäftsbedingungen gelten für alle Leistungen der Kostümschneiderei, einschliesslich Beratung, Massanfertigung, Änderungen, Reparaturen und Veredelungen.",
  },
  {
    title: "2. Angebote und Vertragsschluss",
    body: "Angebote sind unverbindlich, sofern nicht ausdrücklich anders vermerkt. Ein Vertrag kommt erst mit schriftlicher Auftragsbestätigung oder Rechnungsstellung zustande.",
  },
  {
    title: "3. Massanfertigung",
    body: "Massgeschneiderte Kostüme werden individuell nach Kundenwunsch gefertigt. Der Kunde ist für die Richtigkeit der übermittelten Masse und Angaben verantwortlich. Anpassungen während der Anfertigung können Mehrkosten verursachen.",
  },
  {
    title: "4. Preise und Zahlung",
    body: "Alle Preise verstehen sich in Schweizer Franken (CHF), sofern nicht anders angegeben. Zahlungsmodalitäten werden im Angebot oder in der Auftragsbestätigung festgelegt.",
  },
  {
    title: "5. Lieferfristen",
    body: "Liefertermine werden nach Möglichkeit eingehalten. Bei höherer Gewalt oder unvorhergesehenen Umständen können sich Fristen angemessen verlängern.",
  },
  {
    title: "6. Gewährleistung",
    body: "Es gelten die gesetzlichen Gewährleistungsbestimmungen. Bei Mängeln kontaktieren Sie uns umgehend, damit wir eine faire Lösung finden können.",
  },
];

export default function AgbPage() {
  return (
    <>
      <PageHero label="Rechtliches" title="AGB" subtitle="Allgemeine Geschäftsbedingungen" breadcrumbs={[{ label: "AGB", href: "/agb" }]} />
      <section className="py-20 section-bg-white">
        <div className="container-site max-w-3xl prose-sm">
          <p className="font-sans text-sm text-charcoal-lighter mb-10 leading-relaxed">
            Platzhaltertext — bitte durch Ihre finalen AGB ersetzen (CMS). Struktur ist vorbereitet für spätere Bearbeitung.
          </p>
          {SECTIONS.map((s) => (
            <div key={s.title} className="mb-8">
              <h2 className="font-serif text-xl text-charcoal mb-3">{s.title}</h2>
              <p className="font-sans text-sm text-charcoal-light leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
