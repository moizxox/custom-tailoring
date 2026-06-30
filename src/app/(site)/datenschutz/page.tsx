import { PageHero } from "@/components/layout/PageHero";
import { CmsDocumentSections } from "@/components/sections/CmsDocumentSections";
import { getCmsContent } from "@/lib/cms/content";
import { getCmsDocumentSections } from "@/lib/cms/section-helpers";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutz" };

export default async function DatenschutzPage() {
  const [heroContent, doc] = await Promise.all([
    getCmsContent("datenschutz", "hero", {}),
    getCmsDocumentSections("datenschutz", "sections"),
  ]);
  const hero = mapPageHeroContent(heroContent, {
    label: "",
    title: "Datenschutzerklärung",
    titleAccent: "",
    subtitle: "",
    headingTag: "h1",
  });

  return (
    <>
      <PageHero title={hero.title} headingTag={hero.headingTag} breadcrumbs={[{ label: "Datenschutz", href: "/datenschutz" }]} />
      <section className="py-20 section-bg-white">
        <div className="container-site max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-stone-light p-8 flex flex-col gap-8 font-sans text-sm text-charcoal-light leading-relaxed">
            {doc.intro && (
              <p className="text-[12px] text-charcoal-lighter">
                {doc.intro}{" "}
                <a href="https://www.kostuemschneiderei.ch/datenschutz" className="text-periwinkle-dark hover:underline" target="_blank" rel="noopener noreferrer">
                  kostuemschneiderei.ch
                </a>
              </p>
            )}
            <CmsDocumentSections sections={doc.sections} />
          </div>
        </div>
      </section>
    </>
  );
}
