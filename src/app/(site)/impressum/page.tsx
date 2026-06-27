import { PageHero } from "@/components/layout/PageHero";
import { IMPRESSUM } from "@/content/legal";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <>
      <PageHero title="Impressum" breadcrumbs={[{ label: "Impressum", href: "/impressum" }]} />
      <section className="py-20 section-bg-white">
        <div className="container-site max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-stone-light p-8 flex flex-col gap-6 font-sans text-sm text-charcoal-light leading-relaxed">
            <div>
              <h2 className="font-serif text-xl text-charcoal mb-3">Angaben gemäss OR Art. 944</h2>
              <p>
                <strong className="text-charcoal">Eingetragener Firmenname:</strong> {IMPRESSUM.companyName}
              </p>
              <p>
                <strong className="text-charcoal">Inhaberin:</strong> {IMPRESSUM.owner}
              </p>
              <p className="mt-3">
                <strong className="text-charcoal">Hauptstandort:</strong>
                <br />
                {IMPRESSUM.address}
                <br />
                {IMPRESSUM.city}, {IMPRESSUM.country}
              </p>
              <p className="mt-2">
                <strong className="text-charcoal">Weiterer Standort:</strong> {IMPRESSUM.secondLocation}
              </p>
              <p className="mt-3">
                <strong className="text-charcoal">Telefon:</strong>{" "}
                <a href={IMPRESSUM.phoneHref} className="text-periwinkle-dark hover:underline">
                  {IMPRESSUM.phone}
                </a>
              </p>
              <p>
                <strong className="text-charcoal">E-Mail:</strong>{" "}
                <a href={`mailto:${IMPRESSUM.email}`} className="text-periwinkle-dark hover:underline">
                  {IMPRESSUM.email}
                </a>
              </p>
              <p className="mt-3">
                <strong className="text-charcoal">Firmennummer:</strong> {IMPRESSUM.companyId}
              </p>
              <p>
                <strong className="text-charcoal">MwSt.-Nummer:</strong> {IMPRESSUM.vatId}
              </p>
              <p className="mt-3">
                <strong className="text-charcoal">Firmenzweck:</strong> {IMPRESSUM.purpose}
              </p>
            </div>
            <div>
              <h2 className="font-serif text-xl text-charcoal mb-3">Haftungsausschluss</h2>
              <p>
                Die Inhalte dieser Website wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann keine Gewähr übernommen werden. Externe Links wurden zum Zeitpunkt der Verlinkung geprüft.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-xl text-charcoal mb-3">Urheberrecht</h2>
              <p>
                Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem schweizerischen Urheberrecht.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
