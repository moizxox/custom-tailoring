import { PageHero } from "@/components/layout/PageHero";
import { ContentSection } from "@/components/sections/ContentSection";
import { PeriwinkleCtaSection } from "@/components/sections/PeriwinkleCtaSection";
import { getCmsContent } from "@/lib/cms/content";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stoffe & Materialien",
  description: "Hochwertige Stoffe und Materialien für Ihre Kostüme – persönlich beraten.",
};

const FABRICS = [
  { name: "Seide & Satin", desc: "Für elegante, fliessende Kostüme mit edlem Glanz.", icon: "fabric-cloth-sewing-tailoring.svg", gradient: "from-periwinkle-lighter to-sand-light" },
  { name: "Wollstoffe", desc: "Robust, warm und zeitlos – ideal für Fasnachtskostüme.", icon: "wool-sewing-knitting-handcraft.svg", gradient: "from-sand-light to-stone-light" },
  { name: "Baumwolle & Leinen", desc: "Atmungsaktiv und angenehm zu tragen – für jede Saison.", icon: "fabric-cloth-sewing-tailoring.svg", gradient: "from-offwhite-warm to-periwinkle-lighter" },
  { name: "Samtgewebe", desc: "Luxuriöse Textur für besondere Auftritte.", icon: "box-threads-sewing-tailoring.svg", gradient: "from-periwinkle-lighter to-offwhite-warm" },
  { name: "Dekostoffe", desc: "Für auffällige Designs mit Charakter und Ausdruck.", icon: "sewing-pattern-sewing-tailoring-fashion-design.svg", gradient: "from-sand-light to-periwinkle-lighter" },
  { name: "Spezialgewebe", desc: "Stretchmaterialien, Lackstoffe und mehr auf Anfrage.", icon: "velcro-tape-sewing-tailoring.svg", gradient: "from-stone-light to-sand-light" },
];

export default async function StoffePage() {
  const hero = mapPageHeroContent(await getCmsContent("stoffe", "hero", {}), {
    label: "Materialien",
    title: "Stoffe & Materialien",
    titleAccent: "Stoffe",
    subtitle: "Wir führen eine grosse Auswahl hochwertiger Stoffe und beraten Sie persönlich bei der Wahl.",
    headingTag: "h1",
  });

  return (
    <>
      <PageHero
        label={hero.label}
        title={hero.title}
        titleAccent={hero.titleAccent}
        subtitle={hero.subtitle}
        headingTag={hero.headingTag}
        breadcrumbs={[{ label: "Stoffe & Materialien", href: "/stoffe" }]}
      />

      <section className="py-20 section-bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FABRICS.map((f) => (
              <div key={f.name} className="rounded-2xl overflow-hidden border border-stone-light hover:border-periwinkle-light hover:shadow-card-hover transition-all duration-300 group">
                <div className={`bg-gradient-to-br ${f.gradient} flex items-center justify-center h-40`}>
                  <Image src={`/icons/sewing/${f.icon}`} alt="" width={56} height={56} className="icon-stone group-hover:icon-periwinkle transition-all duration-300" />
                </div>
                <div className="bg-white p-5">
                  <h3 className="font-serif text-lg text-charcoal mb-1.5">{f.name}</h3>
                  <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="font-sans text-sm text-charcoal-light mb-5">Möchten Sie Muster sehen oder haben Sie spezielle Anforderungen?</p>
            <Link href="/termin" className="btn-primary inline-flex">Termin buchen</Link>
          </div>
        </div>
      </section>

      <ContentSection
        label="Persönliche Beratung"
        heading="Gemeinsam den passenden Stoff finden"
        headingAccent="Stoff"
        imageSrc="https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei/atelier/atelier-3.jpg"
        imageAlt="Stoffberatung im Atelier"
        imagePosition="right"
        className="section-bg-white"
        paragraphs={[
          "Die Wahl des richtigen Stoffes entscheidet über Tragekomfort, Haltbarkeit und Ausstrahlung Ihres Kostüms. Wir zeigen Ihnen Muster, erklären Eigenschaften und helfen bei der Entscheidung – ohne Druck.",
          "Für Gruppenausstattungen achten wir auf einheitliche Farben und gleichbleibende Qualität über alle Stücke hinweg. Spezialgewebe und Sonderwünsche beschaffen wir auf Anfrage.",
        ]}
        ctaLabel="Termin buchen"
        ctaHref="/termin"
      />

      <PeriwinkleCtaSection
        heading="Stoffmuster ansehen?"
        text="Vereinbaren Sie einen Termin und entdecken Sie unsere Auswahl persönlich im Atelier."
      />
    </>
  );
}
