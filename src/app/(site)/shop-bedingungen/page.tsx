import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { CmsDocumentSections } from "@/components/sections/CmsDocumentSections";
import { getCmsContent } from "@/lib/cms/content";
import { getCmsDocumentSections } from "@/lib/cms/section-helpers";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop-Bedingungen" };

export default async function ShopBedingungenPage() {
  const [heroContent, doc] = await Promise.all([
    getCmsContent("shop-bedingungen", "hero", {}),
    getCmsDocumentSections("shop-bedingungen", "sections"),
  ]);
  const hero = mapPageHeroContent(heroContent, {
    label: "Shop",
    title: "Shop-Bedingungen",
    titleAccent: "",
    subtitle: "Zahlung, Lieferung und verbindliche Bestellung im Online-Shop.",
    headingTag: "h1",
  });

  return (
    <>
      <PageHero
        label={hero.label}
        title={hero.title}
        subtitle={hero.subtitle}
        headingTag={hero.headingTag}
        labelColor={hero.labelColor}
        headingColor={hero.headingColor}
        accentColor={hero.accentColor}
        subtextColor={hero.subtextColor}
        breadcrumbs={[{ label: "Shop-Bedingungen", href: "/shop-bedingungen" }]}
      />
      <section className="py-20 section-bg-white">
        <div className="container-site max-w-3xl space-y-8">
          {doc.intro && <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">{doc.intro}</p>}
          <CmsDocumentSections sections={doc.sections} />
          <p className="pt-4">
            <Link href="/widerruf" className="text-periwinkle-dark hover:underline font-sans text-sm">
              Widerrufsrecht →
            </Link>
            {" · "}
            <Link href="/agb" className="text-periwinkle-dark hover:underline font-sans text-sm">
              AGB →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
