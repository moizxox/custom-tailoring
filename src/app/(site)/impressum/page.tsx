import { PageHero } from "@/components/layout/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <>
      <PageHero
        title="Impressum"
        breadcrumbs={[{ label: "Impressum", href: "/impressum" }]}
      />
      <section className="py-20 section-bg-white">
        <div className="container-site max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-stone-light p-8 flex flex-col gap-6 font-sans text-sm text-charcoal-light leading-relaxed">
            <div>
              <h2 className="font-serif text-xl text-charcoal mb-3">Angaben gemäss OR Art. 944</h2>
              <p><strong className="text-charcoal">Firmenname:</strong> Kostümschneiderei Basel</p>
              <p><strong className="text-charcoal">Inhaberin:</strong> Lani Müller</p>
              <p><strong className="text-charcoal">Adresse:</strong> Greifengasse 20, 4052 Basel, Schweiz</p>
              <p><strong className="text-charcoal">Telefon:</strong> +41 31 312 45 67</p>
              <p><strong className="text-charcoal">E-Mail:</strong> hallo@kostuemschneiderei-basel.ch</p>
              <p><strong className="text-charcoal">Website:</strong> www.kostuemschneiderei-basel.ch</p>
            </div>
            <div>
              <h2 className="font-serif text-xl text-charcoal mb-3">Haftungsausschluss</h2>
              <p>Die Inhalte dieser Website wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann keine Gewähr übernommen werden. Externe Links wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstösse überprüft. Sollten rechtliche Verstösse bekannt werden, werden die entsprechenden Links umgehend entfernt.</p>
            </div>
            <div>
              <h2 className="font-serif text-xl text-charcoal mb-3">Urheberrecht</h2>
              <p>Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem schweizerischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb des Urheberrechtes bedürfen der schriftlichen Zustimmung der Inhaberin.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
