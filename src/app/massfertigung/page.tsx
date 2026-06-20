import { PageHero } from "@/components/layout/PageHero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Massfertigung",
  description: "Individuelle Kostüme nach Mass – von der Beratung bis zur Übergabe.",
};

const STEPS_DETAIL = [
  { icon: "tailor-dummy-ruler-sewing-tailoring.svg", title: "Mass nehmen", text: "Wir nehmen alle relevanten Masse präzise auf. Dazu gehören Brust, Taille, Hüfte, Schulterbreite, Armlänge und weitere, je nach Kostümtyp." },
  { icon: "pencil-sewing-tailoring-drawing.svg", title: "Schnittmuster", text: "Auf Basis Ihrer Masse erstellen wir ein individuelles Schnittmuster. Kein Kostüm von der Stange – jedes wird neu konstruiert." },
  { icon: "fabric-cloth-sewing-tailoring.svg", title: "Stoffauswahl", text: "Gemeinsam wählen wir die passenden Materialien aus. Wir helfen Ihnen, das Richtige zu finden – nach Budget und Wunsch." },
  { icon: "sewing-machine-sewing-tailoring-cloth.svg", title: "Anfertigung", text: "Jeder Schritt der Produktion erfolgt in unserem Basler Atelier, von Hand und mit grösster Sorgfalt." },
];

export default function MassfertigungPage() {
  return (
    <>
      <PageHero
        label="Massgeschneidert für Sie"
        title="Massfertigung"
        titleAccent="Massfertigung"
        subtitle="Kein Kostüm von der Stange. Jedes Stück wird für Sie persönlich entworfen, gemessen und in Handarbeit gefertigt."
        iconSlug="tape-measure-sewing-tailoring-size.svg"
        breadcrumbs={[{ label: "Massfertigung", href: "/massfertigung" }]}
      />

      {/* Process detail */}
      <section className="py-20 bg-offwhite-warm">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Der Prozess</p>
            <h2 className="section-heading">So entsteht Ihr <em className="not-italic italic text-periwinkle-dark">Kostüm</em></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS_DETAIL.map((s, i) => (
              <div key={s.title} className="bg-white rounded-2xl border border-stone-light p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-periwinkle-lighter flex items-center justify-center shrink-0">
                    <Image src={`/icons/sewing/${s.icon}`} alt="" width={22} height={22} className="icon-periwinkle" />
                  </div>
                  <span className="font-serif text-3xl text-periwinkle-light font-bold">0{i + 1}</span>
                </div>
                <h3 className="font-serif text-lg text-charcoal">{s.title}</h3>
                <p className="font-sans text-sm text-charcoal-lighter leading-relaxed flex-1">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection />

      <section className="py-16 bg-periwinkle-lighter text-center">
        <div className="container-site max-w-xl mx-auto">
          <Image src="/icons/sewing/tailor-dummy-fashion-sewing-tailoring.svg" alt="" width={48} height={48} className="icon-periwinkle mx-auto mb-5" />
          <h2 className="font-serif text-3xl text-charcoal mb-3">Bereit für Ihr Kostüm?</h2>
          <p className="font-sans text-sm text-charcoal-light mb-7">Buchen Sie Ihr kostenloses Erstgespräch. Wir freuen uns auf Sie.</p>
          <Link href="/termin" className="btn-primary inline-flex">Termin buchen</Link>
        </div>
      </section>
    </>
  );
}
