import { PageHero } from "@/components/layout/PageHero";
import { AboutBand } from "@/components/sections/AboutBand";
import { ContentSection } from "@/components/sections/ContentSection";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns",
  description: "Lernen Sie das Team der Kostümschneiderei Basel kennen.",
};

const TEAM = [
  {
    name: "Lani Müller",
    role: "Inhaberin & Schneiderin",
    icon: "tailor-dummy-fashion-sewing-tailoring.svg",
    bio: "Seit über 20 Jahren lebe ich meine Leidenschaft für das Kostümhandwerk. Jedes Projekt ist für mich ein neues Abenteuer.",
  },
  {
    name: "Sarah Keller",
    role: "Designerin & Beraterin",
    icon: "pencil-sewing-tailoring-drawing.svg",
    bio: "Kreativität und Präzision vereinen sich in meiner Arbeit. Ich begleite Sie von der ersten Skizze bis zum fertigen Kostüm.",
  },
  {
    name: "Marco Brun",
    role: "Zuschneider",
    icon: "scissor-cut-fabric-sewing.svg",
    bio: "Ein perfekter Schnitt ist die Grundlage jedes guten Kostüms. Diese Überzeugung treibt mich täglich an.",
  },
];

const VALUES = [
  { icon: "tailor-dummy-ruler-sewing-tailoring.svg", title: "Qualität", text: "Wir verwenden nur hochwertige Materialien und verarbeiten sie mit grösster Sorgfalt." },
  { icon: "embroidery-sewing-needlework-handcraft.svg", title: "Handwerk", text: "Jedes Kostüm wird von Hand gefertigt – mit traditionellen Techniken und modernem Know-how." },
  { icon: "button-sewing-tailoring-handcraft.svg", title: "Persönlichkeit", text: "Wir nehmen uns Zeit für Sie. Ihre Wünsche stehen bei uns an erster Stelle." },
];

export default function UeberUnsPage() {
  return (
    <>
      <PageHero
        label="Wer wir sind"
        title="Leidenschaft für das Handwerk"
        titleAccent="Handwerk"
        subtitle="Seit über 20 Jahren schaffen wir in Basel Kostüme, die begeistern – für Fasnacht, Bühne und besondere Anlässe."
        breadcrumbs={[{ label: "Über uns", href: "/ueber-uns" }]}
      />

      {/* Story section */}
      <section className="py-20 section-bg-white">
        <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="section-label mb-4">Unsere Geschichte</p>
            <h2 className="font-serif text-3xl text-charcoal mb-5 leading-snug">
              Tradition in jedem Stich.<br />
              <em className="not-italic italic text-periwinkle-dark">Moderne in jeder Linie.</em>
            </h2>
            <div className="flex flex-col gap-4 font-sans text-sm text-charcoal-light leading-relaxed">
              <p>Was 2003 als kleines Atelier in Basel begann, ist heute ein geschätzter Treffpunkt für alle, die Wert auf massgeschneiderte Kostüme legen. Unsere Werkstatt liegt mitten in Basel und ist mehr als ein Arbeitsplatz – sie ist unser kreatives Zuhause.</p>
              <p>Ob für die Basler Fasnacht, einen Theaterauftritt oder eine private Feier – wir begleiten Sie von der ersten Idee bis zur finalen Anprobe. Persönlich, zuverlässig und mit einem Blick fürs Detail, der uns auszeichnet.</p>
              <p>Unsere Kundschaft reicht von Einzelpersonen über Cliquen bis hin zu grossen Guggenmusiken. Jedes Projekt ist einzigartig – und wird von uns so behandelt.</p>
            </div>
            <Link href="/termin" className="btn-primary mt-7 inline-flex">Uns kennenlernen →</Link>
          </div>

          {/* Visual card */}
          <div className="rounded-2xl bg-gradient-to-br from-periwinkle-lighter via-sand-light to-offwhite-warm border border-periwinkle-light/40 p-10 flex flex-col items-center text-center gap-5">
            <Image src="/icons/sewing/sewing-machine-sewing-tailoring-cloth.svg" alt="" width={64} height={64} className="icon-periwinkle" />
            <div>
              <p className="font-serif text-5xl text-charcoal font-semibold">20+</p>
              <p className="font-sans text-sm text-charcoal-light mt-1">Jahre Erfahrung in Basel</p>
            </div>
            <div className="flex gap-8">
              {[["500+", "Kostüme"], ["100%", "Handarbeit"], ["3", "Anproben"]].map(([val, lbl]) => (
                <div key={lbl} className="text-center">
                  <p className="font-serif text-2xl text-periwinkle-dark font-semibold">{val}</p>
                  <p className="font-sans text-xs text-charcoal-lighter mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContentSection
        label="Unsere Arbeit"
        heading="Kostüme für Fasnacht, Bühne und besondere Momente"
        headingAccent="Fasnacht"
        imageSrc="/images/gallery/gwuerztraminer-2026.jpeg"
        imageAlt="Gwürztraminer Waageclique – Gruppenausstattung"
        imagePosition="right"
        className="section-bg-white"
        paragraphs={[
          "Ob Einzelperson, Clique oder ganze Guggenmusik – wir kennen die Anforderungen der Basler Fasnacht. Haltbare Stoffe, einheitliche Gruppenoptik und Kostüme, die den ganzen Umzug überstehen.",
          "Neben der Fasnacht fertigen wir auch Bühnenkostüme und individuelle Aufträge. Jedes Projekt beginnt mit einem Gespräch – denn nur wer versteht, was Sie brauchen, kann das richtige Kostüm schaffen.",
        ]}
        ctaLabel="Zur Galerie"
        ctaHref="/galerie"
      />

      {/* Values */}
      <section className="py-16 section-bg-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Was uns antreibt</p>
            <h2 className="section-heading">Unsere Werte</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-stone-light p-7 text-center flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-periwinkle-lighter flex items-center justify-center">
                  <Image src={`/icons/sewing/${v.icon}`} alt="" width={28} height={28} className="icon-periwinkle" />
                </div>
                <h3 className="font-serif text-xl text-charcoal">{v.title}</h3>
                <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-16 section-bg-white scroll-mt-28">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Unser Team</p>
            <h2 className="section-heading">Menschen hinter den <em className="not-italic italic text-periwinkle-dark">Kostümen</em></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM.map((m) => (
              <div key={m.name} className="bg-white rounded-2xl border border-stone-light p-7 flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-periwinkle-lighter to-sand-light flex items-center justify-center">
                  <Image src={`/icons/sewing/${m.icon}`} alt="" width={36} height={36} className="icon-periwinkle" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-charcoal">{m.name}</h3>
                  <p className="font-sans text-xs text-periwinkle-dark font-medium tracking-wide mt-0.5">{m.role}</p>
                </div>
                <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AboutBand />
    </>
  );
}
