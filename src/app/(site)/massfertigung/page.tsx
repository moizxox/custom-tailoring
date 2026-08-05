import { PageHero } from "@/components/layout/PageHero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { MassblattDownload } from "@/components/sections/MassblattDownload";
import { CmsSectionShell } from "@/components/cms/CmsSectionShell";
import { getCmsContent } from "@/lib/cms/content";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import { parseSectionAppearance } from "@/lib/cms/section-appearance";
import { MASSFERTIGUNG_SECTION_DEFAULTS } from "@/lib/cms/default-content";
import { renderOrderedPageSections } from "@/lib/cms/render-ordered-sections";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Massfertigung",
  description: "Individuelle Kostüme nach Mass – von der Beratung bis zur Übergabe.",
};

interface StepDetail { icon: string; title: string; text: string; }
interface MassCtaData { heading: string; subtext: string; buttonLabel: string; buttonUrl: string; }

export default async function MassfertigungPage() {
  const [heroContent, stepsContent, ctaContent] = await Promise.all([
    getCmsContent("massfertigung", "hero", {}),
    getCmsContent("massfertigung", "steps", {}),
    getCmsContent("massfertigung", "cta", {}),
  ]);
  const hero = mapPageHeroContent(heroContent, {
    label: "Massgeschneidert für Sie",
    title: "Massfertigung",
    titleAccent: "Massfertigung",
    subtitle: "Kein Kostüm von der Stange. Jedes Stück wird für Sie persönlich entworfen, gemessen und in Handarbeit gefertigt.",
    headingTag: "h1",
  });

  const stepsData = { ...MASSFERTIGUNG_SECTION_DEFAULTS.steps, ...stepsContent } as { heading: string; items: StepDetail[] };
  const ctaData = { ...MASSFERTIGUNG_SECTION_DEFAULTS.cta, ...ctaContent } as MassCtaData;
  const stepsDetail: StepDetail[] = Array.isArray(stepsData.items) && stepsData.items.length > 0
    ? stepsData.items
    : (MASSFERTIGUNG_SECTION_DEFAULTS.steps.items as StepDetail[]);
  const stepsAppearance = parseSectionAppearance(stepsContent);
  const ctaAppearance = parseSectionAppearance(ctaContent);

  const renderers = {
    hero: () => (
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
        />

        <section className="relative py-16 section-bg-white overflow-hidden">
          <div className="container-site relative z-10 max-w-3xl mx-auto text-center">
            <p className="section-label mb-3">MASSAUFNAHME</p>
            <h2 className="section-heading text-3xl mb-4">
              Ihre Massangaben{" "}
              <span className="text-periwinkle-dark">sicher übermitteln</span>
            </h2>
            <p className="font-sans text-sm text-charcoal-light leading-relaxed mb-8">
              Nach der Auftragsbestätigung erhalten Sie Zugang zu Ihrem persönlichen Kundenbereich.
              Dort können Sie die benötigten Masse erfassen, Fotos hochladen und Ihre Angaben sicher
              übermitteln.
            </p>
            <div className="glass-card p-8 flex flex-col items-center gap-4">
              <Image
                src="/icons/sewing/tape-measure-sewing-tailoring-size.svg"
                alt=""
                width={40}
                height={40}
                className="icon-periwinkle"
              />
              <p className="font-sans text-sm text-charcoal-light max-w-md">
                Masse digital erfassen, Fotos hochladen und sicher übermitteln — nur für
                Kundinnen und Kunden mit laufendem Auftrag.
              </p>
              <Link href="/kundenbereich/login" className="btn-primary">
                Zum Kundenbereich
              </Link>
              <MassblattDownload
                available={false}
                showDownloads={false}
                className="mt-2 text-center"
              />
            </div>
          </div>
        </section>
      </>
    ),
    steps: () => (
      <>
        <CmsSectionShell appearance={stepsAppearance} className="py-20">
          <div className="container-site">
            <div className="text-center mb-12">
              <p className="section-label mb-3">Der Prozess</p>
              <h2 className="section-heading">{stepsData.heading}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stepsDetail.map((s, i) => (
                <div key={s.title} className="bg-white rounded-2xl border border-stone-light p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-periwinkle-lighter flex items-center justify-center shrink-0">
                      <Image src={`/icons/sewing/${s.icon}`} alt="" width={22} height={22} className="icon-periwinkle" />
                    </div>
                    <span className="font-serif text-3xl text-periwinkle-light font-bold">0{i + 1}</span>
                  </div>
                  <h3 className="font-serif text-lg text-charcoal">{s.title}</h3>
                  <p className="font-sans text-sm text-charcoal-lighter leading-relaxed flex-1">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </CmsSectionShell>

        <ProcessSection />
      </>
    ),
    cta: () => (
      <CmsSectionShell appearance={ctaAppearance} defaultClassName="bg-periwinkle-lighter" className="py-16 text-center">
        <div className="container-site max-w-xl mx-auto">
          <Image src="/icons/sewing/tailor-dummy-fashion-sewing-tailoring.svg" alt="" width={48} height={48} className="icon-periwinkle mx-auto mb-5" />
          <h2 className="font-serif text-3xl text-charcoal mb-3">{ctaData.heading}</h2>
          <p className="font-sans text-sm text-charcoal-light mb-7">{ctaData.subtext}</p>
          <Link href={ctaData.buttonUrl} className="btn-primary inline-flex">{ctaData.buttonLabel}</Link>
        </div>
      </CmsSectionShell>
    ),
  };

  return <>{await renderOrderedPageSections("massfertigung", renderers)}</>;
}
