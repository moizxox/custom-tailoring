import { PageHero } from "@/components/layout/PageHero";
import { ContentSection } from "@/components/sections/ContentSection";
import { PeriwinkleCtaSection } from "@/components/sections/PeriwinkleCtaSection";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { mapContentBlock } from "@/lib/cms/section-helpers";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kostümveredelung",
  description: "Stickerei, Stoffdruck und textile Veredelung für Ihre Fasnachtskostüme.",
};

export default async function KostuemveredelungPage() {
  const [heroContent, mainContent, servicesContent] = await Promise.all([
    getCmsContent("kostuemveredelung", "hero", {}),
    getCmsContent("kostuemveredelung", "main", {}),
    getCmsContent("kostuemveredelung", "services", {}),
  ]);
  const hero = mapPageHeroContent(heroContent, {
    label: "Veredelung",
    title: "Kostümveredelung",
    titleAccent: "Veredelung",
    subtitle: "Stickerei, Stoffdruck und individuelle Details — damit Ihr Kostüm einzigartig wird.",
    headingTag: "h1",
  });
  const main = mapContentBlock({ ...getDefaultSectionContent("kostuemveredelung", "main"), ...mainContent });
  const servicesData = { ...getDefaultSectionContent("kostuemveredelung", "services"), ...servicesContent } as {
    heading?: string;
    items?: { label: string }[];
    ctaLabel?: string;
    ctaUrl?: string;
  };

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
        breadcrumbs={[{ label: "Kostümveredelung", href: "/kostuemveredelung" }]}
      />

      {main.imageSrc && (
        <ContentSection
          label={main.label}
          heading={main.heading}
          headingAccent={main.headingAccent}
          imageSrc={main.imageSrc}
          imageAlt={main.imageAlt}
          imagePosition={main.imagePosition}
          paragraphs={main.paragraphs}
          ctaLabel={main.ctaLabel}
          ctaHref={main.ctaHref}
        />
      )}

      <section className="py-20 section-bg-lavender">
        <div className="container-site max-w-3xl">
          <h2 className="font-serif text-3xl text-charcoal mb-6 text-center">{servicesData.heading}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(servicesData.items ?? []).map((item) => (
              <li key={item.label} className="flex items-center gap-3 bg-white/70 rounded-xl border border-white px-5 py-4 font-sans text-sm text-charcoal-light">
                <span className="w-2 h-2 rounded-full bg-periwinkle shrink-0" />
                {item.label}
              </li>
            ))}
          </ul>
          {servicesData.ctaLabel && servicesData.ctaUrl && (
            <p className="text-center mt-8">
              <Link href={servicesData.ctaUrl} className="btn-primary inline-flex">{servicesData.ctaLabel}</Link>
            </p>
          )}
        </div>
      </section>

      <PeriwinkleCtaSection />
    </>
  );
}
