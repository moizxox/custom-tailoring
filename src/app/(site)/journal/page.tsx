import { PageHero } from "@/components/layout/PageHero";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description: "Einblicke in das Kostümhandwerk – Tipps, Inspirationen und Neuigkeiten.",
};

const POSTS = [
  {
    slug: "massanfertigung-vs-konfektionskostuem",
    category: "Ratgeber",
    date: "15. März 2025",
    title: "Massanfertigung oder Konfektionskostüm?",
    excerpt: "Was sind die Unterschiede – und wann lohnt sich die Investition in ein massgefertigtes Kostüm?",
    image: "/images/gallery/schloesslischraenzer-major.jpeg",
  },
  {
    slug: "fasnacht-2025-trends",
    category: "Trends",
    date: "8. Januar 2025",
    title: "Fasnacht 2025: Die Kostüm-Trends",
    excerpt: "Welche Farben, Schnitte und Materialien werden diese Fasnacht dominieren? Ein Blick auf aktuelle Tendenzen.",
    image: "/images/gallery/gwuerztraminer-2026.jpeg",
  },
  {
    slug: "pflege-von-kostuemen",
    category: "Pflege",
    date: "20. November 2024",
    title: "Kostüme richtig pflegen und lagern",
    excerpt: "Mit der richtigen Pflege halten Kostüme viele Jahre. Unsere Tipps für Reinigung, Lagerung und Reparatur.",
    image: "/images/gallery/wiler-zipfel.jpeg",
  },
  {
    slug: "stoffe-fuer-guggenmusik",
    category: "Material",
    date: "3. September 2024",
    title: "Die besten Stoffe für Guggenmusik-Kostüme",
    excerpt: "Haltbarkeit, Komfort und Optik – welche Materialien sich für Gruppenausstattungen am besten eignen.",
    image: "/images/gallery/baenkli-clique.jpeg",
  },
  {
    slug: "massnehmen-tipps",
    category: "Ratgeber",
    date: "12. Juli 2024",
    title: "So nehmen Sie Masse korrekt ab",
    excerpt: "Eine Schritt-für-Schritt-Anleitung, bevor Sie zu uns kommen – für ein noch genaueres Ergebnis.",
    image: "/images/figures/woman-measurement.png",
  },
  {
    slug: "atelier-einblick",
    category: "Atelier",
    date: "5. Mai 2024",
    title: "Einblick in unser Basler Atelier",
    excerpt: "Wo Ideen entstehen und Kostüme Realität werden – ein Blick hinter die Kulissen.",
    image: "/images/atelier/atelier-2.jpg",
  },
];

export default function JournalPage() {
  return (
    <>
      <PageHero
        label="Wissen & Inspiration"
        title="Journal"
        titleAccent="Journal"
        subtitle="Einblicke in das Kostümhandwerk – Tipps, Trends und Geschichten aus unserem Atelier."
        breadcrumbs={[{ label: "Journal", href: "/journal" }]}
      />

      <section className="py-20 section-bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POSTS.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl border border-stone-light hover:border-periwinkle-light hover:shadow-card-hover transition-all duration-300 group overflow-hidden flex flex-col"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-periwinkle-dark bg-periwinkle-lighter px-2.5 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-charcoal-lighter font-sans">{post.date}</span>
                  </div>
                  <h2 className="font-serif text-lg text-charcoal mb-2 leading-snug group-hover:text-periwinkle-dark transition-colors">
                    {post.title}
                  </h2>
                  <p className="font-sans text-sm text-charcoal-lighter leading-relaxed flex-1">{post.excerpt}</p>
                  <Link
                    href={`/journal/${post.slug}`}
                    className="mt-4 text-xs font-sans font-medium text-periwinkle-dark hover:underline inline-flex items-center gap-1"
                  >
                    Weiterlesen →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
