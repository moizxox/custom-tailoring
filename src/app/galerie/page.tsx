import { PageHero } from "@/components/layout/PageHero";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Entdecken Sie unsere Kostüme – Handwerk, Stoffe und fertige Unikate aus unserem Basler Atelier.",
};

const CATEGORIES = ["Alle", "Massanfertigung", "Guggenmusik", "Einzelperson", "Stoffe", "Atelier"];

const GALLERY_ITEMS = [
  { id: 1, category: "Massanfertigung", title: "Kostüm im Detail", icon: "tailor-dummy-dress-fashion-sewing.svg", gradient: "from-periwinkle-lighter to-sand-light", size: "tall" },
  { id: 2, category: "Stoffe", title: "Edle Materialien", icon: "fabric-cloth-sewing-tailoring.svg", gradient: "from-sand-light to-stone-light", size: "normal" },
  { id: 3, category: "Atelier", title: "Unser Atelier", icon: "sewing-machine-sewing-tailoring-cloth.svg", gradient: "from-offwhite-warm to-periwinkle-lighter", size: "normal" },
  { id: 4, category: "Guggenmusik", title: "Gruppenausstattung", icon: "hanger-sewing-fashion-cloth.svg", gradient: "from-periwinkle-lighter to-offwhite-warm", size: "tall" },
  { id: 5, category: "Einzelperson", title: "Massgeschneidert", icon: "tailor-dummy-fashion-sewing-tailoring.svg", gradient: "from-sand-light to-periwinkle-lighter", size: "normal" },
  { id: 6, category: "Stoffe", title: "Farben & Muster", icon: "box-threads-sewing-tailoring.svg", gradient: "from-stone-light to-sand-light", size: "normal" },
  { id: 7, category: "Massanfertigung", title: "Handarbeit", icon: "embroidery-sewing-needlework-handcraft.svg", gradient: "from-periwinkle-lighter to-sand", size: "normal" },
  { id: 8, category: "Guggenmusik", title: "Fasnachtskostüme", icon: "sewing-pattern-sewing-tailoring-fashion-design.svg", gradient: "from-sand-light to-periwinkle-lighter", size: "tall" },
  { id: 9, category: "Atelier", title: "Handwerk & Präzision", icon: "scissor-cut-fabric-sewing.svg", gradient: "from-offwhite-warm to-stone-light", size: "normal" },
];

export default function GaleriePage() {
  return (
    <>
      <PageHero
        label="Unsere Arbeiten"
        title="Galerie"
        titleAccent="Galerie"
        subtitle="Einblicke in unsere Handwerkskunst – von der ersten Skizze bis zum fertigen Kostüm."
        iconSlug="tailor-dummy-dress-fashion-sewing.svg"
        breadcrumbs={[{ label: "Galerie", href: "/galerie" }]}
      />

      <section className="py-20 bg-offwhite-warm">
        <div className="container-site">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <span
                key={cat}
                className={`px-4 py-1.5 rounded-full text-[12px] font-sans font-medium border cursor-pointer transition-all duration-200 ${
                  cat === "Alle"
                    ? "bg-periwinkle border-periwinkle text-charcoal"
                    : "bg-white border-stone-light text-charcoal-light hover:border-periwinkle-light"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Masonry-style grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {GALLERY_ITEMS.map((item) => (
              <div
                key={item.id}
                id={item.category.toLowerCase().replace(/\s/g, "-")}
                className="break-inside-avoid group relative overflow-hidden rounded-2xl border border-stone-light hover:border-periwinkle-light hover:shadow-card-hover transition-all duration-300"
              >
                <div
                  className={`bg-gradient-to-br ${item.gradient} flex flex-col items-center justify-center text-center p-8 gap-4 ${
                    item.size === "tall" ? "min-h-[360px]" : "min-h-[240px]"
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300">
                    <Image src={`/icons/sewing/${item.icon}`} alt="" width={32} height={32} className="icon-periwinkle" />
                  </div>
                  <span className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-periwinkle-dark bg-white/70 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  <p className="font-serif text-lg text-charcoal">{item.title}</p>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 text-periwinkle-dark text-xs font-sans">
                    <span>Ansehen</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center font-sans text-sm text-charcoal-lighter mt-12">
            Echte Fotos folgen bald. <a href="/kontakt" className="text-periwinkle-dark hover:underline">Kontaktieren Sie uns</a> für persönliche Einblicke.
          </p>
        </div>
      </section>
    </>
  );
}
