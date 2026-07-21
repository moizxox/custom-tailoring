import { PageHero } from "@/components/layout/PageHero";
import { AboutBand } from "@/components/sections/AboutBand";
import { ContentSection } from "@/components/sections/ContentSection";
import { CmsSectionShell } from "@/components/cms/CmsSectionShell";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { mapContentBlock, splitParagraphs } from "@/lib/cms/section-helpers";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import { parseSectionAppearance } from "@/lib/cms/section-appearance";
import { AccentHeadingText } from "@/components/ui/AccentHeadingText";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns",
  description: "Lernen Sie das Team der Kostümschneiderei Basel kennen.",
};

interface TeamMember {
  name: string;
  role: string;
  icon_slug: string;
  bio: string;
}

interface ValueItem {
  icon_slug: string;
  title: string;
  text: string;
}

export default async function UeberUnsPage() {
  const [heroContent, storyContent, workContent, valuesContent, teamContent] = await Promise.all([
    getCmsContent("ueber-uns", "hero", {}),
    getCmsContent("ueber-uns", "story", {}),
    getCmsContent("ueber-uns", "work", {}),
    getCmsContent("ueber-uns", "values", {}),
    getCmsContent("ueber-uns", "team", {}),
  ]);
  const hero = mapPageHeroContent(heroContent, {
    label: "Wer wir sind",
    title: "Leidenschaft für das Handwerk",
    titleAccent: "Handwerk",
    subtitle: "Seit über 20 Jahren schaffen wir in Basel Kostüme, die begeistern – für Fasnacht, Bühne und besondere Anlässe.",
    headingTag: "h1",
  });
  const story = { ...getDefaultSectionContent("ueber-uns", "story"), ...storyContent } as Record<string, string>;
  const work = mapContentBlock({ ...getDefaultSectionContent("ueber-uns", "work"), ...workContent });
  const valuesData = { ...getDefaultSectionContent("ueber-uns", "values"), ...valuesContent } as {
    sectionLabel?: string;
    heading?: string;
    items?: ValueItem[];
  };
  const teamData = { ...getDefaultSectionContent("ueber-uns", "team"), ...teamContent } as { items?: TeamMember[] };
  const TEAM = teamData.items ?? [];
  const storyAppearance = parseSectionAppearance(story);
  const valuesAppearance = parseSectionAppearance(valuesData as Record<string, unknown>);
  const teamAppearance = parseSectionAppearance(teamData as Record<string, unknown>);

  return (
    <>
      <PageHero
        label={hero.label}
        title={hero.title}
        titleAccent={hero.titleAccent}
        subtitle={hero.subtitle}
        headingTag={hero.headingTag}
        breadcrumbs={[{ label: "Über uns", href: "/ueber-uns" }]}
        textColor={hero.textColor}
        accentColor={hero.accentColor}
        appearance={hero.appearance}
      />

      <CmsSectionShell appearance={storyAppearance} className="py-20">
        <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            {story.label && <p className="section-label mb-4">{story.label}</p>}
            <h2 className="font-serif text-3xl text-charcoal mb-5 leading-snug">
              <AccentHeadingText heading={story.heading ?? ""} accent={story.headingAccent} />
            </h2>
            <div className="flex flex-col gap-4 font-sans text-sm text-charcoal-light leading-relaxed">
              {splitParagraphs(story.paragraphs ?? "").map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
            {story.ctaLabel && story.ctaUrl && (
              <Link href={story.ctaUrl} className="btn-primary mt-7 inline-flex">{story.ctaLabel}</Link>
            )}
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-periwinkle-lighter via-sand-light to-offwhite-warm border border-periwinkle-light/40 p-10 flex flex-col items-center text-center gap-5">
            <Image src="/icons/sewing/sewing-machine-sewing-tailoring-cloth.svg" alt="" width={64} height={64} className="icon-periwinkle" />
            <div>
              <p className="font-serif text-5xl text-charcoal font-semibold">20+</p>
              <p className="font-sans text-sm text-charcoal-light mt-1">Jahre Erfahrung in Basel</p>
            </div>
            <div className="flex gap-8">
              {[["500+", "Kostüme"], ["100%", "Handarbeit"], ["3", "Anproben"]].map(([val, lbl]) => (
                <div key={lbl} className="text-center">
                  <p className="font-serif text-2xl text-periwinkle-dark font-semibold">{val}</p>
                  <p className="font-sans text-xs text-charcoal-lighter mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CmsSectionShell>

      {work.imageSrc && (
        <ContentSection
          label={work.label}
          heading={work.heading}
          headingAccent={work.headingAccent}
          imageSrc={work.imageSrc}
          imageAlt={work.imageAlt}
          imagePosition={work.imagePosition}
          className="section-bg-white"
          paragraphs={work.paragraphs}
          appearance={work.appearance}
          ctaLabel={work.ctaLabel}
          ctaHref={work.ctaHref}
        />
      )}

      <CmsSectionShell appearance={valuesAppearance} className="py-16">
        <div className="container-site">
          <div className="text-center mb-12">
            {valuesData.sectionLabel && <p className="section-label mb-3">{valuesData.sectionLabel}</p>}
            <h2 className="section-heading">{valuesData.heading}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(valuesData.items ?? []).map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-stone-light p-7 text-center flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-periwinkle-lighter flex items-center justify-center">
                  <Image src={`/icons/sewing/${v.icon_slug}`} alt="" width={28} height={28} className="icon-periwinkle" />
                </div>
                <h3 className="font-serif text-xl text-charcoal">{v.title}</h3>
                <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </CmsSectionShell>

      <CmsSectionShell id="team" appearance={teamAppearance} className="py-16 scroll-mt-28">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Unser Team</p>
            <h2 className="section-heading">Menschen hinter den <span className="text-periwinkle-dark">Kostümen</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM.map((m) => (
              <div key={m.name} className="bg-white rounded-2xl border border-stone-light p-7 flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-periwinkle-lighter to-sand-light flex items-center justify-center">
                  <Image src={`/icons/sewing/${m.icon_slug}`} alt="" width={36} height={36} className="icon-periwinkle" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-charcoal">{m.name}</h3>
                  <p className="font-sans text-xs text-periwinkle-dark font-medium tracking-wide mt-0.5">{m.role}</p>
                </div>
                <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </CmsSectionShell>

      <AboutBand />
    </>
  );
}
