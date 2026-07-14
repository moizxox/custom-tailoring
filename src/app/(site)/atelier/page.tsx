import { PageHero } from "@/components/layout/PageHero";
import { ContentSection } from "@/components/sections/ContentSection";
import { PeriwinkleCtaSection } from "@/components/sections/PeriwinkleCtaSection";
import { PhotoSlider } from "@/components/ui/PhotoSlider";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { mapContentBlock, splitParagraphs } from "@/lib/cms/section-helpers";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import { AccentHeadingText } from "@/components/ui/AccentHeadingText";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atelier",
  description: "Unser Atelier in Basel – der Ort, wo Kostüme entstehen.",
};

export default async function AtelierPage() {
  const [heroContent, introContent, workshopContent, materialsContent] = await Promise.all([
    getCmsContent("atelier", "hero", {}),
    getCmsContent("atelier", "intro", {}),
    getCmsContent("atelier", "workshop", {}),
    getCmsContent("atelier", "materials", {}),
  ]);
  const hero = mapPageHeroContent(heroContent, {
    label: "Unser Standort",
    title: "Das Atelier",
    titleAccent: "Atelier",
    subtitle: "In der Greifengasse 20, mitten in Basel, befindet sich unser Atelier – der Ort, wo Ideen zu Kostümen werden.",
    headingTag: "h1",
  });
  const intro = { ...getDefaultSectionContent("atelier", "intro"), ...introContent } as Record<string, unknown>;
  const workshop = mapContentBlock({ ...getDefaultSectionContent("atelier", "workshop"), ...workshopContent });
  const materials = mapContentBlock({ ...getDefaultSectionContent("atelier", "materials"), ...materialsContent });
  const slides = (Array.isArray(intro.slides) ? intro.slides : []) as { src: string; alt: string }[];

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
        breadcrumbs={[{ label: "Atelier", href: "/atelier" }]}
      />

      <section className="py-20 section-bg-white">
        <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {typeof intro.label === "string" && <p className="section-label mb-4">{intro.label}</p>}
            <h2 className="font-serif text-3xl text-charcoal mb-5 leading-snug">
              <AccentHeadingText
                heading={typeof intro.heading === "string" ? intro.heading : ""}
                accent={typeof intro.headingAccent === "string" ? intro.headingAccent : undefined}
              />
            </h2>
            <div className="flex flex-col gap-4 font-sans text-sm text-charcoal-light leading-relaxed mb-7">
              {splitParagraphs(typeof intro.paragraphs === "string" ? intro.paragraphs : "").map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            <div className="flex flex-col gap-2 text-sm font-sans text-charcoal-light mb-7">
              {typeof intro.addressLine === "string" && (
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-periwinkle" />
                  {intro.addressLine}
                </span>
              )}
              {typeof intro.hoursWeekday === "string" && (
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-periwinkle" />
                  {intro.hoursWeekday}
                </span>
              )}
              {typeof intro.hoursSaturday === "string" && (
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-periwinkle" />
                  {intro.hoursSaturday}
                </span>
              )}
            </div>
            {typeof intro.ctaLabel === "string" && typeof intro.ctaUrl === "string" && (
              <Link href={intro.ctaUrl} className="btn-primary inline-flex">{intro.ctaLabel}</Link>
            )}
          </div>
          {slides.length > 0 && <PhotoSlider slides={slides} />}
        </div>
      </section>

      {workshop.imageSrc && (
        <ContentSection
          label={workshop.label}
          heading={workshop.heading}
          headingAccent={workshop.headingAccent}
          imageSrc={workshop.imageSrc}
          imageAlt={workshop.imageAlt}
          imagePosition={workshop.imagePosition}
          paragraphs={workshop.paragraphs}
          ctaLabel={workshop.ctaLabel}
          ctaHref={workshop.ctaHref}
          appearance={workshop.appearance}
        />
      )}

      {materials.imageSrc && (
        <ContentSection
          label={materials.label}
          heading={materials.heading}
          headingAccent={materials.headingAccent}
          imageSrc={materials.imageSrc}
          imageAlt={materials.imageAlt}
          imagePosition={materials.imagePosition}
          className="section-bg-white"
          paragraphs={materials.paragraphs}
          ctaLabel={materials.ctaLabel}
          ctaHref={materials.ctaHref}
          appearance={materials.appearance}
        />
      )}

      <PeriwinkleCtaSection />
    </>
  );
}
