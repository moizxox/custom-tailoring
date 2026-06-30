import { PageHero } from "@/components/layout/PageHero";
import { CmsDocumentSections } from "@/components/sections/CmsDocumentSections";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { getCmsDocumentSections } from "@/lib/cms/section-helpers";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum" };

export default async function ImpressumPage() {
  const [heroContent, companyContent, doc] = await Promise.all([
    getCmsContent("impressum", "hero", {}),
    getCmsContent("impressum", "company", {}),
    getCmsDocumentSections("impressum", "sections"),
  ]);
  const hero = mapPageHeroContent(heroContent, {
    label: "",
    title: "Impressum",
    titleAccent: "",
    subtitle: "",
    headingTag: "h1",
  });
  const defaults = getDefaultSectionContent("impressum", "company");
  const company = { ...defaults, ...companyContent } as Record<string, string>;

  return (
    <>
      <PageHero title={hero.title} headingTag={hero.headingTag} breadcrumbs={[{ label: "Impressum", href: "/impressum" }]} />
      <section className="py-20 section-bg-white">
        <div className="container-site max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-stone-light p-8 flex flex-col gap-6 font-sans text-sm text-charcoal-light leading-relaxed">
            <div>
              <h2 className="font-serif text-xl text-charcoal mb-3">Angaben gemäss OR Art. 944</h2>
              <p><strong className="text-charcoal">Eingetragener Firmenname:</strong> {company.name}</p>
              <p><strong className="text-charcoal">Inhaberin:</strong> {company.owner}</p>
              <p className="mt-3">
                <strong className="text-charcoal">Hauptstandort:</strong>
                <br />
                {company.address}
                <br />
                {company.city}, {company.country}
              </p>
              <p className="mt-2"><strong className="text-charcoal">Weiterer Standort:</strong> {company.secondLocation}</p>
              <p className="mt-3">
                <strong className="text-charcoal">Telefon:</strong>{" "}
                <a href={company.phoneHref} className="text-periwinkle-dark hover:underline">{company.phone}</a>
              </p>
              <p>
                <strong className="text-charcoal">E-Mail:</strong>{" "}
                <a href={`mailto:${company.email}`} className="text-periwinkle-dark hover:underline">{company.email}</a>
              </p>
              <p className="mt-3"><strong className="text-charcoal">Firmennummer:</strong> {company.companyId}</p>
              <p><strong className="text-charcoal">MwSt.-Nummer:</strong> {company.vatId}</p>
              <p className="mt-3"><strong className="text-charcoal">Firmenzweck:</strong> {company.purpose}</p>
            </div>
            <CmsDocumentSections sections={doc.sections} />
          </div>
        </div>
      </section>
    </>
  );
}
