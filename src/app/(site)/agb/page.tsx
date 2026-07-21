import { PageHero } from "@/components/layout/PageHero";
import { CmsDocumentSections } from "@/components/sections/CmsDocumentSections";
import { CmsSectionShell } from "@/components/cms/CmsSectionShell";
import { getCmsContent } from "@/lib/cms/content";
import { getCmsDocumentSections } from "@/lib/cms/section-helpers";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Allgemeine Geschäftsbedingungen (AGB)" };

export default async function AgbPage() {
  const [heroContent, doc] = await Promise.all([
    getCmsContent("agb", "hero", {}),
    getCmsDocumentSections("agb", "sections"),
  ]);
  const hero = mapPageHeroContent(heroContent, {
    label: "Rechtliches",
    title: "AGB",
    titleAccent: "",
    subtitle: "Allgemeine Geschäftsbedingungen",
    headingTag: "h1",
  });

  return (
    <>
      <PageHero
        label={hero.label}
        title={hero.title}
        subtitle={hero.subtitle}
        headingTag={hero.headingTag}
        textColor={hero.textColor}
        accentColor={hero.accentColor}
        appearance={hero.appearance}
        breadcrumbs={[{ label: "AGB", href: "/agb" }]}
      />
      <CmsSectionShell appearance={doc.appearance} className="py-20">
        <div className="container-site max-w-3xl">
          {doc.intro && <p className="font-sans text-sm text-charcoal-lighter mb-10 leading-relaxed">{doc.intro}</p>}
          <CmsDocumentSections sections={doc.sections} />
        </div>
      </CmsSectionShell>
    </>
  );
}
