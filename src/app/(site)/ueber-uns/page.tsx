import { PageHero } from "@/components/layout/PageHero";
import { AboutBand } from "@/components/sections/AboutBand";
import { ContentSection } from "@/components/sections/ContentSection";
import { CmsSectionShell } from "@/components/cms/CmsSectionShell";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { mapContentBlock, splitParagraphs } from "@/lib/cms/section-helpers";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import { parseBool, parseSectionAppearance } from "@/lib/cms/section-appearance";
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
  icon_slug?: string;
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
    showIcons?: boolean | string;
    items?: ValueItem[];
  };
  const teamData = { ...getDefaultSectionContent("ueber-uns", "team"), ...teamContent } as { items?: TeamMember[] };
  const TEAM = teamData.items ?? [];
  const storyAppearance = parseSectionAppearance(story);
  const valuesAppearance = parseSectionAppearance(valuesData as Record<string, unknown>);
  const teamAppearance = parseSectionAppearance(teamData as Record<string, unknown>);
  const valuesShowIcons =
    Object.prototype.hasOwnProperty.call(valuesContent, "showIcons")
      ? parseBool((valuesContent as Record<string, unknown>).showIcons)
      : valuesData.showIcons !== false;

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
        <div className="container-site max-w-3xl">
          {story.label && <p className="section-label mb-4">{story.label}</p>}
          <h2 className="font-serif text-3xl text-charcoal mb-5 leading-snug">
            <AccentHeadingText heading={story.heading ?? ""} accent={story.headingAccent} />
          </h2>
          <div className="flex flex-col gap-4 font-sans text-sm text-charcoal-light leading-relaxed">
            {splitParagraphs(story.paragraphs ?? "").map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
          {story.ctaLabel?.trim() && story.ctaUrl?.trim() && (
            <Link href={story.ctaUrl} className="btn-primary mt-7 inline-flex">{story.ctaLabel}</Link>
          )}
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
            {(valuesData.items ?? []).map((v) => {
              const icon = v.icon_slug?.trim();
              return (
                <div key={v.title} className="bg-white rounded-2xl border border-stone-light p-7 text-center flex flex-col items-center gap-4 h-full">
                  {valuesShowIcons && icon ? (
                    <div className="w-14 h-14 rounded-full bg-periwinkle-lighter flex items-center justify-center">
                      <Image src={`/icons/sewing/${icon}`} alt="" width={28} height={28} className="icon-periwinkle" />
                    </div>
                  ) : null}
                  <h3 className="font-serif text-xl text-charcoal">{v.title}</h3>
                  <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">{v.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </CmsSectionShell>

      <CmsSectionShell id="team" appearance={teamAppearance} className="py-16 scroll-mt-28">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Unser Team</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM.map((m) => {
              const icon = m.icon_slug?.trim();
              const showIcon = Boolean(icon && icon !== "none" && icon !== "null");
              return (
              <div key={m.name} className="bg-white rounded-2xl border border-stone-light p-7 flex flex-col items-center text-center gap-4">
                {showIcon ? (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-periwinkle-lighter to-sand-light flex items-center justify-center">
                    <Image src={`/icons/sewing/${icon}`} alt="" width={36} height={36} className="icon-periwinkle" />
                  </div>
                ) : null}
                <div>
                  <h3 className="font-serif text-lg text-charcoal">{m.name}</h3>
                  <p className="font-sans text-xs text-periwinkle-dark font-medium tracking-wide mt-0.5">{m.role}</p>
                </div>
                <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">{m.bio}</p>
              </div>
            );})}
          </div>
        </div>
      </CmsSectionShell>

      <AboutBand />
    </>
  );
}
