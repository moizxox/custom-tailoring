import { PageHero } from "@/components/layout/PageHero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ProcessSection } from "@/components/sections/ProcessSection";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leistungen",
  description: "Entdecken Sie unser vollständiges Angebot – von der Massanfertigung über Änderungen bis zur Gruppenausstattung.",
};

const DETAILS = [
  {
    id: "massanfertigung",
    title: "Massanfertigung",
    description:
      "Jedes Kostüm entsteht exklusiv für Sie – vom ersten Entwurf bis zur finalen Anprobe. Wir nehmen Ihre Masse, entwickeln ein individuelles Schnittmuster und fertigen alles von Hand in unserem Basler Atelier.",
    icon: "tailor-dummy-fashion-sewing-tailoring.svg",
    highlights: ["Persönliche Beratung", "Eigenes Schnittmuster", "Bis zu 3 Anproben"],
  },
  {
    id: "serienanfertigung",
    title: "Gruppenausstattung",
    description:
      "Für Guggenmusiken, Cliquen und Vereine fertigen wir einheitliche Kostüme in grossen Mengen – ohne Qualitätsverlust. Jedes Stück sitzt perfekt, auch wenn es 50 davon gibt.",
    icon: "sewing-machine-sewing-tailoring-cloth.svg",
    highlights: ["Ab 5 Personen", "Einheitliches Design", "Termingerechte Lieferung"],
  },
  {
    id: "aenderungen",
    title: "Änderungen & Anpassungen",
    description:
      "Ob zu eng, zu weit oder einfach nicht mehr aktuell – wir passen Ihre bestehenden Kostüme professionell an. Mit jahrelanger Erfahrung sitzen alle Änderungen präzise und unsichtbar.",
    icon: "seam-ripper-sewing-tool-tailoring.svg",
    highlights: ["Schnelle Ausführung", "Unsichtbare Nähte", "Für alle Materialien"],
  },
  {
    id: "reparaturen",
    title: "Reparaturen",
    description:
      "Gerissene Nähte, beschädigte Verschlüsse oder abgenutzte Verzierungen – wir reparieren Ihre Kostüme fachgerecht und geben ihnen neues Leben.",
    icon: "sewing-needles-sewing-tailoring-needle.svg",
    highlights: ["Alle Materialien", "Kurze Wartezeiten", "Faire Preise"],
  },
  {
    id: "stoffe",
    title: "Stoffauswahl & Beratung",
    description:
      "Wir begleiten Sie persönlich beim Auswählen der richtigen Materialien. Unser Sortiment umfasst hochwertige Stoffe in allen Farben, Mustern und Texturen.",
    icon: "fabric-cloth-sewing-tailoring.svg",
    highlights: ["Grosse Auswahl", "Persönliche Beratung", "Muster auf Anfrage"],
  },
  {
    id: "beratung",
    title: "Design & Beratung",
    description:
      "Sie haben eine Idee, aber noch kein konkretes Konzept? Wir helfen Ihnen, Ihre Vorstellung in ein tragbares Kostüm zu verwandeln – kreativ, realistisch und bezahlbar.",
    icon: "pencil-sewing-tailoring-drawing.svg",
    highlights: ["Skizzen & Entwürfe", "Referenzbilder willkommen", "Kostenloses Erstgespräch"],
  },
];

export default function LeistungenPage() {
  return (
    <>
      <PageHero
        label="Was wir anbieten"
        title="Leistungen"
        titleAccent="Leistungen"
        subtitle="Von der Beratung über die Massanfertigung bis zur Abholung – alles aus einer Hand, mit Liebe zum Handwerk."
        iconSlug="tailor-dummy-ruler-sewing-tailoring.svg"
        breadcrumbs={[{ label: "Leistungen", href: "/leistungen" }]}
      />

      {/* Detailed service cards */}
      <section className="py-20 bg-offwhite-warm">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DETAILS.map((s) => (
              <div
                key={s.id}
                id={s.id}
                className="bg-white rounded-2xl border border-stone-light p-7 flex flex-col gap-5 hover:border-periwinkle-light hover:shadow-card-hover transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-periwinkle-lighter flex items-center justify-center">
                  <Image src={`/icons/sewing/${s.icon}`} alt="" width={26} height={26} className="icon-periwinkle" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="font-serif text-xl text-charcoal mb-2">{s.title}</h2>
                  <p className="font-sans text-[13px] text-charcoal-light leading-relaxed mb-4">{s.description}</p>

                  {/* Highlights */}
                  <ul className="flex flex-col gap-1.5">
                    {s.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-[12px] font-sans text-charcoal-lighter">
                        <span className="w-1.5 h-1.5 rounded-full bg-periwinkle shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/termin" className="btn-outline-dark self-start text-xs">
                  Termin buchen →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServicesGrid />
      <ProcessSection />

      {/* CTA */}
      <section className="py-16 bg-periwinkle-lighter">
        <div className="container-site text-center">
          <h2 className="font-serif text-3xl text-charcoal mb-3">Haben Sie Fragen?</h2>
          <p className="font-sans text-sm text-charcoal-light mb-7 max-w-md mx-auto">
            Wir beraten Sie gerne persönlich. Buchen Sie ein kostenloses Erstgespräch.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/termin" className="btn-primary">Termin buchen</Link>
            <Link href="/kontakt" className="btn-outline-dark">Nachricht senden</Link>
          </div>
        </div>
      </section>
    </>
  );
}
