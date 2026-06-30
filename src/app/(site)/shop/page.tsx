import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { PeriwinkleCtaSection } from "@/components/sections/PeriwinkleCtaSection";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import { getShopProducts } from "@/lib/products";
import { splitLines } from "@/lib/cms/section-helpers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Basler Fasnachtskostüme, Stammkostüme und Sujetkostüme — in den Qualitätsstufen Einfach, Standard und Premium.",
};

const DEFAULT_HERO = {
  label: "Online Shop",
  title: "Fasnachtskostüme",
  titleAccent: "Kostüme",
  subtitle: "Stammkostüme, Sujetkostüme und Basler Fasnachtskostüme — in Einfach, Standard oder Premium.",
  headingTag: "h1" as const,
};

interface TierItem {
  name: string;
  badge: string;
  tagline: string;
  features: string;
  recommendation: string;
}

interface CategoryItem {
  name: string;
  description: string;
  slug: string;
}

export default async function ShopPage() {
  const [heroContent, tiersContent, categoriesContent, shopData] = await Promise.all([
    getCmsContent("shop", "hero", {}),
    getCmsContent("shop", "tiers", {}),
    getCmsContent("shop", "categories", {}),
    getShopProducts(),
  ]);
  const hero = mapPageHeroContent(heroContent, DEFAULT_HERO);
  const tiersDefaults = getDefaultSectionContent("shop", "tiers");
  const categoriesDefaults = getDefaultSectionContent("shop", "categories");
  const tiersData = { ...tiersDefaults, ...tiersContent } as { heading: string; subtext: string; items: TierItem[] };
  const categoriesData = { ...categoriesDefaults, ...categoriesContent } as { heading: string; items: CategoryItem[] };
  const { products, source } = shopData;

  return (
    <>
      <PageHero
        label={hero.label}
        title={hero.title}
        titleAccent={hero.titleAccent}
        subtitle={hero.subtitle}
        headingTag={hero.headingTag}
        breadcrumbs={[{ label: "Shop", href: "/shop" }]}
      />

      <section className="py-20 section-bg-lavender">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Für jedes Budget</p>
            <h2 className="section-heading mb-4">{tiersData.heading}</h2>
            <p className="section-subtext max-w-2xl mx-auto">{tiersData.subtext}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(tiersData.items ?? []).map((tier) => (
              <article key={tier.name} className="rounded-3xl card-gradient border border-periwinkle-light/40 p-7 flex flex-col">
                <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-periwinkle-dark mb-2">{tier.badge}</span>
                <h3 className="font-serif text-2xl text-charcoal mb-2">{tier.name}</h3>
                <p className="font-sans text-sm text-charcoal-light mb-5">{tier.tagline}</p>
                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {splitLines(tier.features).map((f) => (
                    <li key={f} className="flex items-start gap-2 font-sans text-sm text-charcoal-light">
                      <span className="text-periwinkle-dark mt-0.5">✔</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="font-sans text-[12px] text-charcoal-lighter leading-relaxed border-t border-periwinkle-light/30 pt-4">{tier.recommendation}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 section-bg-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-4">{categoriesData.heading}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            {(categoriesData.items ?? []).map((cat) => (
              <div key={cat.name} className="rounded-2xl border border-stone-light p-6 hover:border-periwinkle-light hover:shadow-soft transition-all">
                <h3 className="font-serif text-xl text-charcoal mb-2">{cat.name}</h3>
                <p className="font-sans text-sm text-charcoal-light leading-relaxed">{cat.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-10">
            <p className="section-label mb-3">Auswahl</p>
            <h3 className="font-serif text-2xl text-charcoal">{source === "database" ? "Unsere Produkte" : "Beispielprodukte"}</h3>
            <p className="font-sans text-sm text-charcoal-lighter mt-2 max-w-lg mx-auto">
              {source === "database"
                ? "Produkte werden im Admin unter Produkte gepflegt. Preise sind Richtwerte — verbindlich wird die Bestellung erst nach Bestätigung."
                : "Legen Sie Produkte im Admin unter Produkte an, um sie hier anzuzeigen."}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <article key={product.id} className="rounded-2xl border border-stone-light overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 bg-white">
                <div className="relative h-44 bg-sand-light/30">
                  {product.imageUrl && (
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 25vw" />
                  )}
                  {product.tier && (
                    <span className="absolute top-3 left-3 text-[10px] font-sans font-semibold tracking-wide uppercase bg-white/90 text-periwinkle-dark px-2.5 py-1 rounded-full">
                      {product.tier}
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="absolute top-3 right-3 text-[10px] font-sans font-semibold tracking-wide uppercase bg-charcoal/80 text-white px-2.5 py-1 rounded-full">
                      Ausverkauft
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="font-sans text-[10px] font-semibold tracking-[0.14em] uppercase text-warmgrey mb-1">{product.category}</p>
                  <h4 className="font-serif text-lg text-charcoal mb-1">{product.name}</h4>
                  <p className="font-sans text-xs text-charcoal-lighter mb-3 leading-relaxed line-clamp-3">{product.description}</p>
                  <p className="font-sans text-sm font-semibold text-periwinkle-dark mb-4">{product.price}</p>
                  <Link href={`/kontakt?produkt=${encodeURIComponent(product.name)}`} className="btn-outline-dark w-full justify-center text-xs">
                    Anfrage senden
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 section-bg-sky border-y border-periwinkle-light/30">
        <div className="container-site max-w-3xl text-center">
          <h2 className="font-serif text-2xl text-charcoal mb-4">Massanfertigung & verbindliche Bestellung</h2>
          <p className="font-sans text-sm text-charcoal-light leading-relaxed mb-4">
            Viele unserer Kostüme werden individuell nach Mass gefertigt. Eine verbindliche Bestellung entsteht erst nach schriftlicher Bestätigung
            (Angebot, Auftragsbestätigung oder Rechnung). Lieferzeiten, Preise und Lieferkosten werden transparent kommuniziert.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/shop-bedingungen" className="btn-secondary">
              Shop-Bedingungen
            </Link>
            <Link href="/agb" className="btn-outline-dark">
              AGB
            </Link>
          </div>
        </div>
      </section>

      <PeriwinkleCtaSection />
    </>
  );
}
