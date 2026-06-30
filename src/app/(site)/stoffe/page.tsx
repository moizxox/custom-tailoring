import { PageHero } from "@/components/layout/PageHero";
import { ContentSection } from "@/components/sections/ContentSection";
import { PeriwinkleCtaSection } from "@/components/sections/PeriwinkleCtaSection";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { mapContentBlock } from "@/lib/cms/section-helpers";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stoffe & Materialien",
  description: "Hochwertige Stoffe und Materialien für Ihre Kostüme – persönlich beraten.",
};

interface FabricItem {
  name: string;
  desc: string;
  icon_slug: string;
  gradient: string;
}

export default async function StoffePage() {
  const [heroContent, fabricsContent, advisoryContent, bottomCtaContent] = await Promise.all([
    getCmsContent("stoffe", "hero", {}),
    getCmsContent("stoffe", "fabrics", {}),
    getCmsContent("stoffe", "advisory", {}),
    getCmsContent("stoffe", "bottomCta", {}),
  ]);
  const hero = mapPageHeroContent(heroContent, {
    label: "Materialien",
    title: "Stoffe & Materialien",
    titleAccent: "Stoffe",
    subtitle: "Wir führen eine grosse Auswahl hochwertiger Stoffe und beraten Sie persönlich bei der Wahl.",
    headingTag: "h1",
  });
  const fabricsData = { ...getDefaultSectionContent("stoffe", "fabrics"), ...fabricsContent } as {
    items: FabricItem[];
    ctaText?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  };
  const advisory = mapContentBlock({ ...getDefaultSectionContent("stoffe", "advisory"), ...advisoryContent });
  const bottomCta = { ...getDefaultSectionContent("stoffe", "bottomCta"), ...bottomCtaContent } as { heading?: string; text?: string };

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
            {(fabricsData.items ?? []).map((f) => (
              <div key={f.name} className="rounded-2xl overflow-hidden border border-stone-light hover:border-periwinkle-light hover:shadow-card-hover transition-all duration-300 group">
                <div className={`bg-gradient-to-br ${f.gradient} flex items-center justify-center h-40`}>
                  <Image src={`/icons/sewing/${f.icon_slug}`} alt="" width={56} height={56} className="icon-stone group-hover:icon-periwinkle transition-all duration-300" />
                </div>
                <div className="bg-white p-5">
                  <h3 className="font-serif text-lg text-charcoal mb-1.5">{f.name}</h3>
                  <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="font-sans text-sm text-charcoal-light mb-5">{fabricsData.ctaText}</p>
            {fabricsData.ctaLabel && fabricsData.ctaUrl && (
              <Link href={fabricsData.ctaUrl} className="btn-primary inline-flex">{fabricsData.ctaLabel}</Link>
            )}
          </div>
        </div>
      </section>

      {advisory.imageSrc && (
        <ContentSection
          label={advisory.label}
          heading={advisory.heading}
          headingAccent={advisory.headingAccent}
          imageSrc={advisory.imageSrc}
          imageAlt={advisory.imageAlt}
          imagePosition={advisory.imagePosition}
          className="section-bg-white"
          paragraphs={advisory.paragraphs}
          ctaLabel={advisory.ctaLabel}
          ctaHref={advisory.ctaHref}
        />
      )}

      <PeriwinkleCtaSection heading={bottomCta.heading} text={bottomCta.text} />
    </>
  );
}
