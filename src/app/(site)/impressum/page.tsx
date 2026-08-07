import { PageHero } from "@/components/layout/PageHero";
import { CmsDocumentSections } from "@/components/sections/CmsDocumentSections";
import { CmsSectionShell } from "@/components/cms/CmsSectionShell";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { getCmsDocumentSections } from "@/lib/cms/section-helpers";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum" };

const LABEL_DEFAULTS = {
  nameLabel: "Firmenname",
  ownerLabel: "Geschäftsführung",
  locationLabel: "Hauptstandort",
  secondLocationLabel: "Weiterer Standort",
  phoneLabel: "Telefon",
  emailLabel: "E-Mail",
  companyIdLabel: "Firmennummer",
  vatIdLabel: "MwSt.-Nummer",
  purposeLabel: "Firmenzweck",
} as const;

function label(company: Record<string, string>, key: keyof typeof LABEL_DEFAULTS) {
  return (company[key] ?? "").trim() || LABEL_DEFAULTS[key];
}

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
  const sectionTitle = (company.sectionTitle ?? "").trim();

  return (
    <>
      <PageHero
        title={hero.title}
        headingTag={hero.headingTag}
        textColor={hero.textColor}
        accentColor={hero.accentColor}
        appearance={hero.appearance}
      />
      <CmsSectionShell appearance={doc.appearance} className="py-20">
        <div className="container-site max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-stone-light p-8 flex flex-col gap-6 font-sans text-sm text-charcoal-light leading-relaxed">
            <div>
              {sectionTitle ? (
                <h2 className="font-serif text-xl text-charcoal mb-3">{sectionTitle}</h2>
              ) : null}
              {company.name?.trim() && (
                <p>
                  <strong className="text-charcoal">{label(company, "nameLabel")}:</strong> {company.name}
                </p>
              )}
              {company.owner?.trim() && (
                <p>
                  <strong className="text-charcoal">{label(company, "ownerLabel")}:</strong> {company.owner}
                </p>
              )}
              {(company.address?.trim() || company.city?.trim()) && (
                <p className="mt-3">
                  <strong className="text-charcoal">{label(company, "locationLabel")}:</strong>
                  <br />
                  {company.address}
                  <br />
                  {company.city}
                  {company.country ? `, ${company.country}` : ""}
                </p>
              )}
              {company.secondLocation?.trim() && (
                <p className="mt-2">
                  <strong className="text-charcoal">{label(company, "secondLocationLabel")}:</strong>{" "}
                  {company.secondLocation}
                </p>
              )}
              {company.phone?.trim() && (
                <p className="mt-3">
                  <strong className="text-charcoal">{label(company, "phoneLabel")}:</strong>{" "}
                  <a href={company.phoneHref || `tel:${company.phone}`} className="text-periwinkle-dark hover:underline">
                    {company.phone}
                  </a>
                </p>
              )}
              {company.email?.trim() && (
                <p>
                  <strong className="text-charcoal">{label(company, "emailLabel")}:</strong>{" "}
                  <a href={`mailto:${company.email}`} className="text-periwinkle-dark hover:underline">
                    {company.email}
                  </a>
                </p>
              )}
              {company.companyId?.trim() && (
                <p className="mt-3">
                  <strong className="text-charcoal">{label(company, "companyIdLabel")}:</strong> {company.companyId}
                </p>
              )}
              {company.vatId?.trim() && (
                <p>
                  <strong className="text-charcoal">{label(company, "vatIdLabel")}:</strong> {company.vatId}
                </p>
              )}
              {company.purpose?.trim() && (
                <p className="mt-3">
                  <strong className="text-charcoal">{label(company, "purposeLabel")}:</strong> {company.purpose}
                </p>
              )}
            </div>
            <CmsDocumentSections sections={doc.sections} />
          </div>
        </div>
      </CmsSectionShell>
    </>
  );
}
