import { PageHero } from "@/components/layout/PageHero";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Entdecken Sie unsere Kostüme – Handwerk, Stoffe und fertige Unikate aus unserem Basler Atelier.",
};

const CATEGORIES = ["Alle", "Guggenmusik", "Clique", "Major", "Sujet"];

interface GalleryItem {
  src: string;
  category: string;
  title: string;
}

export default async function GaleriePage() {
  const [heroContent, galleryContent] = await Promise.all([
    getCmsContent("galerie", "hero", {}),
    getCmsContent("galerie", "gallery", {}),
  ]);
  const hero = mapPageHeroContent(heroContent, {
    label: "Unsere Arbeiten",
    title: "Galerie",
    titleAccent: "Galerie",
    subtitle: "Einblicke in unsere Handwerkskunst – Fasnachtskostüme für Cliquen, Guggenmusiken und Einzelpersonen.",
    headingTag: "h1",
  });
  const defaults = getDefaultSectionContent("galerie", "gallery");
  const galleryData = { ...defaults, ...galleryContent } as { items: GalleryItem[] };
  const items = galleryData.items ?? [];

  return (
    <>
      <PageHero
        label={hero.label}
        title={hero.title}
        titleAccent={hero.titleAccent}
        subtitle={hero.subtitle}
        headingTag={hero.headingTag}
        textColor={hero.textColor}
        accentColor={hero.accentColor}
        breadcrumbs={[{ label: "Galerie", href: "/galerie" }]}
      />

      <section className="py-20 section-bg-white">
        <div className="container-site">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <article
                key={item.src}
                className="group relative overflow-hidden rounded-2xl border border-stone-light bg-white hover:border-periwinkle-light hover:shadow-card-hover transition-all duration-300"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-flex text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full mb-2">
                      {item.category}
                    </span>
                    <p className="font-serif text-lg text-white">{item.title}</p>
                  </div>
                </div>
                <div className="p-4 sm:hidden">
                  <span className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-periwinkle-dark">
                    {item.category}
                  </span>
                  <p className="font-serif text-base text-charcoal mt-1">{item.title}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
