import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/layout/PageHero";
import { PeriwinkleCtaSection } from "@/components/sections/PeriwinkleCtaSection";
import { ShopProductGrid } from "@/components/shop/ShopProductGrid";
import { CmsSectionShell } from "@/components/cms/CmsSectionShell";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import { parseSectionAppearance } from "@/lib/cms/section-appearance";
import { getPageSectionOrder } from "@/lib/cms/section-order";
import { getShopProducts } from "@/lib/products";
import { splitLines } from "@/lib/cms/section-helpers";
import { TIER_KEYS, TIER_STYLES } from "@/lib/product-tiers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog",
  description:
    "Basler Fasnachtskostüme, Stammkostüme und Sujetkostüme — in den Qualitätsstufen Einfach, Standard und Premium.",
};

const DEFAULT_HERO = {
  label: "Katalog",
  title: "Fasnachtskostüme",
  titleAccent: "Kostüme",
  subtitle:
    "Stammkostüme, Sujetkostüme und Basler Fasnachtskostüme — in Einfach, Standard oder Premium.",
  headingTag: "h1" as const,
};

interface TierItem {
  name: string;
  badge: string;
  price?: string;
  priceNote?: string;
  tagline: string;
  features: string;
  recommendation: string;
  linkUrl?: string;
}

interface CategoryItem {
  name: string;
  description: string;
  slug: string;
}

type ShopSectionKey = "hero" | "tiers" | "categories" | "infoBand" | "bottomCta";

function tierAnchorId(name: string, index: number) {
  const key = TIER_KEYS[index];
  if (key) return `stufe-${key}`;
  return `stufe-${name.toLowerCase().replace(/\s+/g, "-")}`;
}

export default async function ShopPage() {
  const [
    order,
    heroContent,
    tiersContent,
    categoriesContent,
    infoBandContent,
    bottomCtaContent,
    shopData,
  ] = await Promise.all([
    getPageSectionOrder("shop"),
    getCmsContent("shop", "hero", {}),
    getCmsContent("shop", "tiers", {}),
    getCmsContent("shop", "categories", {}),
    getCmsContent("shop", "infoBand", {}),
    getCmsContent("shop", "bottomCta", {}),
    getShopProducts(),
  ]);

  const hero = mapPageHeroContent(heroContent, DEFAULT_HERO);
  const tiersDefaults = getDefaultSectionContent("shop", "tiers");
  const categoriesDefaults = getDefaultSectionContent("shop", "categories");
  const infoBandDefaults = getDefaultSectionContent("shop", "infoBand");
  const bottomCtaDefaults = getDefaultSectionContent("shop", "bottomCta");

  const tiersData = { ...tiersDefaults, ...tiersContent } as {
    sectionLabel?: string;
    heading: string;
    subtext: string;
    navHint?: string;
    items: TierItem[];
  };
  const categoriesData = { ...categoriesDefaults, ...categoriesContent } as {
    heading: string;
    items: CategoryItem[];
    productsLabel?: string;
    productsHeading?: string;
    productsSubtext?: string;
  };
  const infoBand = { ...infoBandDefaults, ...infoBandContent } as {
    heading?: string;
    text?: string;
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
  };
  const bottomCta = { ...bottomCtaDefaults, ...bottomCtaContent } as {
    heading?: string;
    text?: string;
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
  };

  const { products, source } = shopData;
  const tiersAppearance = parseSectionAppearance({ gradientStyle: "lavender", ...tiersContent });
  const categoriesAppearance = parseSectionAppearance(categoriesContent);
  const infoBandAppearance = parseSectionAppearance(infoBandContent);
  const bottomCtaAppearance = parseSectionAppearance(bottomCtaContent);
  const tierItems = tiersData.items ?? [];

  const productsHeading =
    categoriesData.productsHeading?.trim() ||
    (source === "database" ? "Unsere Produkte" : "Beispielprodukte");
  const productsSubtext =
    categoriesData.productsSubtext?.trim() ||
    (source === "database"
      ? "Klicken Sie auf ein Produkt für Fotos, Qualitätsstufen und Preise. Alle Kostüme werden massgeschneidert — Anfragen sind unverbindlich."
      : "Legen Sie Produkte im Admin unter Produkte an, um sie hier anzuzeigen.");

  const renderers: Record<ShopSectionKey, () => React.ReactNode> = {
    hero: () => (
      <PageHero
        label={hero.label}
        title={hero.title}
        titleAccent={hero.titleAccent}
        subtitle={hero.subtitle}
        headingTag={hero.headingTag}
        textColor={hero.textColor}
        accentColor={hero.accentColor}
        appearance={hero.appearance}
        breadcrumbs={[{ label: "Katalog", href: "/shop" }]}
      />
    ),
    tiers: () => {
      if (!tiersData.heading?.trim() && tierItems.length === 0) return null;
      return (
        <CmsSectionShell appearance={tiersAppearance} defaultClassName="section-bg-lavender" className="py-20">
          <div className="container-site">
            <div className="text-center mb-10">
              {tiersData.sectionLabel && <p className="section-label mb-3">{tiersData.sectionLabel}</p>}
              <h2 className="section-heading mb-4">{tiersData.heading}</h2>
              <p className="section-subtext max-w-2xl mx-auto">{tiersData.subtext}</p>
            </div>

            <nav aria-label="Preise nach Qualitätsstufe" className="mb-12">
              {tiersData.navHint && (
                <p className="text-center font-sans text-xs text-charcoal-lighter mb-4">{tiersData.navHint}</p>
              )}
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto">
                {tierItems.map((tier, index) => {
                  const tierKey = TIER_KEYS[index] ?? "standard";
                  const style = TIER_STYLES[tierKey];
                  const href = tier.linkUrl?.trim() || `#${tierAnchorId(tier.name, index)}`;
                  return (
                    <li key={`${tier.name}-nav`}>
                      <Link
                        href={href}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 rounded-2xl border-2 bg-white/80 px-4 py-4 text-center transition-all hover:shadow-soft hover:-translate-y-0.5",
                          style.border,
                        )}
                      >
                        <span className={cn("font-sans text-[10px] font-semibold tracking-[0.18em] uppercase", style.accent)}>
                          {tier.badge || tier.name}
                        </span>
                        <span className="font-serif text-xl text-charcoal leading-tight">{tier.name}</span>
                        {tier.price?.trim() && (
                          <span className="font-sans text-sm font-semibold text-charcoal mt-1">{tier.price}</span>
                        )}
                        {tier.priceNote?.trim() && (
                          <span className="font-sans text-[11px] text-charcoal-lighter">{tier.priceNote}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tierItems.map((tier, index) => {
                const tierKey = TIER_KEYS[index] ?? "standard";
                const style = TIER_STYLES[tierKey];
                const anchorId = tierAnchorId(tier.name, index);
                return (
                  <article
                    key={tier.name}
                    id={anchorId}
                    className={cn("scroll-mt-28 rounded-3xl card-gradient border-2 p-7 flex flex-col", style.border)}
                  >
                    <span className={cn("font-sans text-[10px] font-semibold tracking-[0.2em] uppercase mb-2", style.accent)}>
                      {tier.badge}
                    </span>
                    <h3 className="font-serif text-2xl text-charcoal mb-2">{tier.name}</h3>
                    {tier.price?.trim() && (
                      <p className="font-sans text-lg font-semibold text-charcoal mb-1">{tier.price}</p>
                    )}
                    {tier.priceNote?.trim() && (
                      <p className="font-sans text-[11px] text-charcoal-lighter mb-3">{tier.priceNote}</p>
                    )}
                    <p className="font-sans text-sm text-charcoal-light mb-5">{tier.tagline}</p>
                    <ul className="flex flex-col gap-2 mb-6 flex-1">
                      {splitLines(tier.features).map((f) => (
                        <li key={f} className="flex items-start gap-2 font-sans text-sm text-charcoal-light">
                          <span className="text-periwinkle-dark mt-0.5">✔</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <p className="font-sans text-[12px] text-charcoal-lighter leading-relaxed border-t border-periwinkle-light/30 pt-4">
                      {tier.recommendation}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </CmsSectionShell>
      );
    },
    categories: () => (
      <CmsSectionShell appearance={categoriesAppearance} className="py-20">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-4">{categoriesData.heading}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            {(categoriesData.items ?? []).map((cat) => (
              <div
                key={cat.name}
                className="rounded-2xl border border-stone-light p-6 hover:border-periwinkle-light hover:shadow-soft transition-all"
              >
                <h3 className="font-serif text-xl text-charcoal mb-2">{cat.name}</h3>
                <p className="font-sans text-sm text-charcoal-light leading-relaxed">{cat.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-10">
            {categoriesData.productsLabel?.trim() && (
              <p className="section-label mb-3">{categoriesData.productsLabel}</p>
            )}
            <h3 className="font-serif text-2xl text-charcoal">{productsHeading}</h3>
            <p className="font-sans text-sm text-charcoal-lighter mt-2 max-w-lg mx-auto">{productsSubtext}</p>
          </div>
          <ShopProductGrid products={products} />
        </div>
      </CmsSectionShell>
    ),
    infoBand: () => {
      if (!infoBand.heading?.trim() && !infoBand.text?.trim()) return null;
      return (
        <CmsSectionShell
          appearance={infoBandAppearance}
          defaultClassName="section-bg-sky"
          className="py-16 border-y border-periwinkle-light/30"
        >
          <div className="container-site max-w-3xl text-center">
            {infoBand.heading?.trim() && (
              <h2 className="font-serif text-2xl text-charcoal mb-4">{infoBand.heading}</h2>
            )}
            {infoBand.text?.trim() && (
              <p className="font-sans text-sm text-charcoal-light leading-relaxed mb-4 whitespace-pre-line">
                {infoBand.text}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-3">
              {infoBand.primaryLabel?.trim() && infoBand.primaryUrl?.trim() && (
                <Link href={infoBand.primaryUrl} className="btn-secondary">
                  {infoBand.primaryLabel}
                </Link>
              )}
              {infoBand.secondaryLabel?.trim() && infoBand.secondaryUrl?.trim() && (
                <Link href={infoBand.secondaryUrl} className="btn-outline-dark">
                  {infoBand.secondaryLabel}
                </Link>
              )}
            </div>
          </div>
        </CmsSectionShell>
      );
    },
    bottomCta: () => {
      if (!bottomCta.heading?.trim() && !bottomCta.text?.trim()) return null;
      return (
        <PeriwinkleCtaSection
          heading={bottomCta.heading}
          text={bottomCta.text}
          primaryLabel={bottomCta.primaryLabel}
          primaryHref={bottomCta.primaryUrl}
          secondaryLabel={bottomCta.secondaryLabel}
          secondaryHref={bottomCta.secondaryUrl}
          appearance={bottomCtaAppearance}
        />
      );
    },
  };

  return (
    <>
      {order
        .filter((key): key is ShopSectionKey => key in renderers)
        .map((key) => (
          <div key={key}>{renderers[key]()}</div>
        ))}
    </>
  );
}
