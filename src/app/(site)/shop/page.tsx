import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { PeriwinkleCtaSection } from "@/components/sections/PeriwinkleCtaSection";
import { SHOP_CATEGORIES, SHOP_PRODUCTS, SHOP_QUALITY_TIERS } from "@/lib/site-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Basler Fasnachtskostüme, Stammkostüme und Sujetkostüme — in den Qualitätsstufen Einfach, Standard und Premium.",
};

export default function ShopPage() {
  return (
    <>
      <PageHero
        label="Online Shop"
        title="Fasnachtskostüme"
        titleAccent="Kostüme"
        subtitle="Stammkostüme, Sujetkostüme und Basler Fasnachtskostüme — in Einfach, Standard oder Premium."
        breadcrumbs={[{ label: "Shop", href: "/shop" }]}
      />

      {/* Quality tiers */}
      <section className="py-20 section-bg-lavender">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Für jedes Budget</p>
            <h2 className="section-heading mb-4">Qualitätsstufen im Überblick</h2>
            <p className="section-subtext max-w-2xl mx-auto">
              Drei Stufen — unterschiedlich in Material, Verarbeitung und Ausstattung. So erhalten Sie genau die Qualität, die zu Ihrem Projekt passt.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SHOP_QUALITY_TIERS.map((tier, i) => (
              <article key={tier.id} className="rounded-3xl card-gradient border border-periwinkle-light/40 p-7 flex flex-col">
                <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-periwinkle-dark mb-2">
                  {i === 0 ? "Einstieg" : i === 1 ? "Beliebt" : "Premium"}
                </span>
                <h3 className="font-serif text-2xl text-charcoal mb-2">{tier.name}</h3>
                <p className="font-sans text-sm text-charcoal-light mb-5">{tier.tagline}</p>
                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {tier.features.map((f) => (
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

      {/* Categories */}
      <section className="py-20 section-bg-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-4">Unsere Angebote</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            {SHOP_CATEGORIES.map((cat) => (
              <div key={cat.id} className="rounded-2xl border border-stone-light p-6 hover:border-periwinkle-light hover:shadow-soft transition-all">
                <h3 className="font-serif text-xl text-charcoal mb-2">{cat.name}</h3>
                <p className="font-sans text-sm text-charcoal-light leading-relaxed">{cat.description}</p>
              </div>
            ))}
          </div>

          {/* Starter products — client can add more via CMS */}
          <div className="text-center mb-10">
            <p className="section-label mb-3">Auswahl</p>
            <h3 className="font-serif text-2xl text-charcoal">Beispielprodukte</h3>
            <p className="font-sans text-sm text-charcoal-lighter mt-2 max-w-lg mx-auto">
              Diese Produkte können Sie später im CMS selbst pflegen. Preise sind Richtwerte — verbindlich wird die Bestellung erst nach Bestätigung.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SHOP_PRODUCTS.map((product) => {
              const tier = SHOP_QUALITY_TIERS.find((t) => t.id === product.qualityTier);
              return (
                <article key={product.id} className="rounded-2xl border border-stone-light overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 bg-white">
                  <div className="relative h-44 bg-sand-light/30">
                    {product.imageSrc && (
                      <Image src={product.imageSrc} alt={product.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 25vw" />
                    )}
                    {tier && (
                      <span className="absolute top-3 left-3 text-[10px] font-sans font-semibold tracking-wide uppercase bg-white/90 text-periwinkle-dark px-2.5 py-1 rounded-full">
                        {tier.name}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="font-serif text-lg text-charcoal mb-1">{product.name}</h4>
                    <p className="font-sans text-xs text-charcoal-lighter mb-3 leading-relaxed">{product.shortDescription}</p>
                    <p className="font-sans text-sm font-semibold text-periwinkle-dark mb-4">{product.priceFrom}</p>
                    <Link href="/kontakt" className="btn-outline-dark w-full justify-center text-xs">
                      Anfrage senden
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom-made notice */}
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
