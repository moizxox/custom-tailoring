import { PageHero } from "@/components/layout/PageHero";
import { ContentSection } from "@/components/sections/ContentSection";
import { PeriwinkleCtaSection } from "@/components/sections/PeriwinkleCtaSection";
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
        breadcrumbs={[{ label: "Atelier", href: "/atelier" }]}
      />

      <section className="py-20 section-bg-white">
        <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-label mb-4">Handwerk vor Ort</p>
            <h2 className="font-serif text-3xl text-charcoal mb-5 leading-snug">
              Wo Tradition und<br />
              <em className="not-italic italic text-periwinkle-dark">Kreativität</em> aufeinandertreffen
            </h2>
            <p className="font-sans text-sm text-charcoal-light leading-relaxed mb-4">
              Unser Atelier ist mehr als ein Arbeitsplatz. Hier riecht es nach Stoff, klingt es nach Nähmaschinen, und jede Ecke erzählt eine Geschichte von Handwerk und Leidenschaft.
            </p>
            <p className="font-sans text-sm text-charcoal-light leading-relaxed mb-7">
              Besuchen Sie uns – ob für eine Beratung, eine Anprobe oder einfach um die Atmosphäre zu erleben. Wir heissen Sie herzlich willkommen.
            </p>
            <div className="flex flex-col gap-2 text-sm font-sans text-charcoal-light mb-7">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-periwinkle" />
                Greifengasse 20, 4052 Basel
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-periwinkle" />
                Mo–Fr: 08:30 – 17:30 Uhr
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-periwinkle" />
                Sa nach Vereinbarung
              </span>
            </div>
            <Link href="/termin" className="btn-primary inline-flex">
              Besuch vereinbaren
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { src: "/images/atelier/atelier-1.png", alt: "Atelier Ansicht" },
              { src: "/images/atelier/atelier-2.jpg", alt: "Handarbeit im Atelier" },
              { src: "/images/atelier/atelier-3.jpg", alt: "Stoffe und Materialien" },
              { src: "/images/gallery/schloesslischraenzer-major.jpeg", alt: "Fertiges Kostüm – Schlösslischränzer Major" },
            ].map((photo) => (
              <div key={photo.src} className="relative aspect-square rounded-2xl overflow-hidden border border-stone-light shadow-soft">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContentSection
        label="Unsere Werkstatt"
        heading="Wo jedes Kostüm Gestalt annimmt"
        headingAccent="Gestalt"
        imageSrc="/images/atelier/atelier-2.jpg"
        imageAlt="Näharbeit im Atelier"
        imagePosition="left"
        paragraphs={[
          "In unserer Werkstatt arbeiten wir mit modernen Nähmaschinen und klassischen Handwerkstechniken. Jeder Schnitt wird geprüft, jede Naht sitzt – damit Ihr Kostüm nicht nur schön aussieht, sondern auch beim Tragen überzeugt.",
          "Von der ersten Skizze an der Arbeitstafel bis zur letzten Knopfloch-Naht begleiten wir jedes Projekt persönlich. So entstehen Kostüme, die zu Ihnen passen – in Form, Stoff und Charakter.",
        ]}
        ctaLabel="Atelier besuchen"
        ctaHref="/termin"
      />

      <ContentSection
        label="Stoffe & Materialien"
        heading="Die richtige Auswahl für Ihr Projekt"
        headingAccent="Auswahl"
        imageSrc="/images/atelier/atelier-3.jpg"
        imageAlt="Stoffauswahl im Atelier"
        imagePosition="right"
        className="section-bg-white"
        paragraphs={[
          "In unserem Atelier finden Sie eine sorgfältig zusammengestellte Auswahl an Stoffen – von robusten Wollstoffen für die Fasnacht bis zu edlen Materialien für besondere Anlässe.",
          "Wir beraten Sie ehrlich: welcher Stoff hält, was er kostet und wie er sich im Alltag trägt. Gemeinsam finden wir die Lösung, die zu Ihrem Budget und Ihrem Wunschkostüm passt.",
        ]}
        ctaLabel="Stoffe entdecken"
        ctaHref="/stoffe"
      />

      <PeriwinkleCtaSection />
    </>
  );
}
