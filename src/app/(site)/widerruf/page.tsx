import { PageHero } from "@/components/layout/PageHero";
import { CmsDocumentSections } from "@/components/sections/CmsDocumentSections";
import { getCmsContent } from "@/lib/cms/content";
import { getCmsDocumentSections } from "@/lib/cms/section-helpers";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Widerrufsrecht" };

export default async function WiderrufPage() {
  const [heroContent, doc] = await Promise.all([
    getCmsContent("widerruf", "hero", {}),
    getCmsDocumentSections("widerruf", "sections"),
  ]);
  const hero = mapPageHeroContent(heroContent, {
    label: "Rechtliches",
    title: "Widerrufsrecht",
    titleAccent: "",
    subtitle: "",
    headingTag: "h1",
  });

  return (
    <>
      <PageHero
        label={hero.label}
        title={hero.title}
        headingTag={hero.headingTag}
        textColor={hero.textColor}
        accentColor={hero.accentColor}
        appearance={hero.appearance}
      />
      <section className="py-20 section-bg-white">
        <div className="container-site max-w-3xl space-y-6">
          {doc.intro && <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">{doc.intro}</p>}
          <CmsDocumentSections sections={doc.sections} />
        </div>
      </section>
    </>
  );
}
