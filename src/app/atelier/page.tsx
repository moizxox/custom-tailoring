import { PageHero } from "@/components/layout/PageHero";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atelier",
  description: "Unser Atelier in Basel – der Ort, wo Kostüme entstehen.",
};

export default function AtelierPage() {
  return (
    <>
      <PageHero
        label="Unser Standort"
        title="Das Atelier"
        titleAccent="Atelier"
        subtitle="In der Greifengasse 20, mitten in Basel, befindet sich unser Atelier – der Ort, wo Ideen zu Kostümen werden."
        iconSlug="sewing-shop-fashion-sewing-tailoring.svg"
        breadcrumbs={[{ label: "Atelier", href: "/atelier" }]}
      />

      <section className="py-20 bg-offwhite-warm">
        <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-label mb-4">Handwerk vor Ort</p>
            <h2 className="font-serif text-3xl text-charcoal mb-5 leading-snug">
              Wo Traditon und<br />
              <em className="not-italic italic text-periwinkle-dark">Kreativität</em> aufeinandertreffen
            </h2>
            <p className="font-sans text-sm text-charcoal-light leading-relaxed mb-4">
              Unser Atelier ist mehr als ein Arbeitsplatz. Hier riecht es nach Stoff, klingt es nach Nähmaschinen, und jede Ecke erzählt eine Geschichte von Handwerk und Leidenschaft.
            </p>
            <p className="font-sans text-sm text-charcoal-light leading-relaxed mb-7">
              Besuchen Sie uns – ob für eine Beratung, eine Anprobe oder einfach um die Atmosphäre zu erleben. Wir heissen Sie herzlich willkommen.
            </p>
            <div className="flex flex-col gap-2 text-sm font-sans text-charcoal-light mb-7">
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-periwinkle" />Greifengasse 20, 4052 Basel</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-periwinkle" />Mo–Fr: 08:30 – 17:30 Uhr</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-periwinkle" />Sa nach Vereinbarung</span>
            </div>
            <Link href="/termin" className="btn-primary inline-flex">Besuch vereinbaren</Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {["sewing-machine-sewing-tailoring-cloth.svg", "fabric-cloth-sewing-tailoring.svg", "scissor-cut-fabric-sewing.svg", "spool-of-thread-sewing-tailoring-needle.svg"].map((icon, i) => (
              <div key={i} className={`rounded-2xl bg-gradient-to-br ${i % 2 === 0 ? "from-periwinkle-lighter to-sand-light" : "from-sand-light to-offwhite-warm"} flex items-center justify-center ${i === 0 ? "aspect-square" : "aspect-[4/3]"} border border-stone-light`}>
                <Image src={`/icons/sewing/${icon}`} alt="" width={48} height={48} className="icon-periwinkle" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
