import { PageHero } from "@/components/layout/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutz" };

export default function DatenschutzPage() {
  return (
    <>
      <PageHero
        title="Datenschutzerklärung"
        breadcrumbs={[{ label: "Datenschutz", href: "/datenschutz" }]}
      />
      <section className="py-20 section-bg-white">
        <div className="container-site max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-stone-light p-8 flex flex-col gap-6 font-sans text-sm text-charcoal-light leading-relaxed">
            {[
              {
                title: "Verantwortliche Stelle",
                text: "Kostümschneiderei Basel, Greifengasse 20, 4052 Basel. E-Mail: hallo@kostuemschneiderei-basel.ch",
              },
              {
                title: "Erhebung und Verarbeitung personenbezogener Daten",
                text: "Wir erheben personenbezogene Daten nur, soweit dies für die Erbringung unserer Dienstleistungen erforderlich ist. Bei Kontaktformularen werden Name, E-Mail-Adresse, Telefonnummer und die Nachricht gespeichert und zur Bearbeitung Ihrer Anfrage verwendet.",
              },
              {
                title: "Weitergabe von Daten",
                text: "Ihre Daten werden nicht an Dritte weitergegeben, ausser wenn dies zur Vertragserfüllung erforderlich ist oder Sie ausdrücklich zugestimmt haben.",
              },
              {
                title: "Cookies",
                text: "Unsere Website verwendet technisch notwendige Cookies für den Betrieb. Analyse-Cookies werden nur mit Ihrer Einwilligung gesetzt.",
              },
              {
                title: "Ihre Rechte",
                text: "Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Bitte kontaktieren Sie uns unter hallo@kostuemschneiderei-basel.ch.",
              },
              {
                title: "Änderungen",
                text: "Wir behalten uns vor, diese Datenschutzerklärung anzupassen. Die jeweils aktuelle Version ist auf dieser Seite abrufbar.",
              },
            ].map((s) => (
              <div key={s.title}>
                <h2 className="font-serif text-xl text-charcoal mb-2">{s.title}</h2>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
