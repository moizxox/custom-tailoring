import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/layout/PageHero";
import { PeriwinkleCtaSection } from "@/components/sections/PeriwinkleCtaSection";
import { ShopProductGrid } from "@/components/shop/ShopProductGrid";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import { getShopProducts } from "@/lib/products";
import { splitLines } from "@/lib/cms/section-helpers";
import { TIER_KEYS, TIER_STYLES } from "@/lib/product-tiers";
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
        textColor={hero.textColor}
        accentColor={hero.accentColor}
        appearance={hero.appearance}
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
            {(tiersData.items ?? []).map((tier, index) => {
              const tierKey = TIER_KEYS[index] ?? "standard";
              const style = TIER_STYLES[tierKey];
              return (
              <article
                key={tier.name}
                className={cn("rounded-3xl card-gradient border-2 p-7 flex flex-col", style.border)}
              >
                <span className={cn("font-sans text-[10px] font-semibold tracking-[0.2em] uppercase mb-2", style.accent)}>
                  {tier.badge}
                </span>
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
              );
            })}
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
                ? "Klicken Sie auf ein Produkt für Fotos, Qualitätsstufen und Preise. Alle Kostüme werden massgeschneidert — Anfragen sind unverbindlich."
                : "Legen Sie Produkte im Admin unter Produkte an, um sie hier anzuzeigen."}
            </p>
          </div>
          <ShopProductGrid products={products} />
        </div>
      </section>

      <section className="py-16 section-bg-sky border-y border-periwinkle-light/30">
        <div className="container-site max-w-3xl text-center">
          <h2 className="font-serif text-2xl text-charcoal mb-4">Massanfertigung & verbindliche Bestellung</h2>
          <p className="font-sans text-sm text-charcoal-light leading-relaxed mb-4">
            Viele unserer Kostüme werden individuell nach Mass gefertigt. Eine verbindliche Bestellung entsteht erst nach schriftlicher Bestätigung (Angebot, Auftragsbestätigung
            oder Rechnung). Lieferzeiten, Preise und Lieferkosten werden transparent kommuniziert.
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
