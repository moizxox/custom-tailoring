import { PageHero } from "@/components/layout/PageHero";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Häufig gestellte Fragen zur Kostümschneiderei.",
};

export default async function FaqsPage() {
  const [heroContent, faqContent] = await Promise.all([
    getCmsContent("faqs", "hero", {}),
    getCmsContent("faqs", "items", {}),
  ]);
  const defaults = getDefaultSectionContent("faqs", "hero");
  const faqDefaults = getDefaultSectionContent("faqs", "items");
  const hero = mapPageHeroContent(heroContent, {
    label: typeof defaults.label === "string" ? defaults.label : "Häufige Fragen",
    title: typeof defaults.heading === "string" ? defaults.heading : "FAQs",
    titleAccent: typeof defaults.headingAccent === "string" ? defaults.headingAccent : "FAQs",
    subtitle: typeof defaults.subtext === "string" ? defaults.subtext : "Antworten auf die häufigsten Fragen.",
    headingTag: "h1",
  });
  const faqsData = { ...faqDefaults, ...faqContent } as {
    items: { q: string; a: string }[];
    ctaText?: string;
    ctaButton?: string;
  };

  return (
    <>
      <PageHero
        label={hero.label}
        title={hero.title}
        titleAccent={hero.titleAccent}
        subtitle={hero.subtitle}
        headingTag={hero.headingTag}
        breadcrumbs={[{ label: "FAQs", href: "/faqs" }]}
      />

      <section className="py-20 section-bg-white">
        <div className="container-site max-w-3xl mx-auto">
          <FaqAccordion
            items={faqsData.items ?? []}
            ctaText={faqsData.ctaText}
            ctaButton={faqsData.ctaButton}
          />
        </div>
      </section>
    </>
  );
}
