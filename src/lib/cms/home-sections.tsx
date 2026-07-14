import { HeroSection } from "@/components/sections/HeroSection";
import { HeroContactSection } from "@/components/sections/HeroContactSection";
import { PhotoMarquee } from "@/components/sections/PhotoMarquee";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { AboutBand } from "@/components/sections/AboutBand";
import { getCmsContent } from "@/lib/cms/content";
import { HOME_SECTION_DEFAULTS } from "@/lib/cms/default-content";
import { mapHomeHeroContent, parseHeadingTag } from "@/lib/cms/helpers";
import { getPageSectionOrder } from "@/lib/cms/section-order";
import type { ComponentProps } from "react";

type HomeSectionKey =
  | "hero"
  | "servicesGrid"
  | "process"
  | "galleryPreview"
  | "aboutBand"
  | "photoMarquee"
  | "contactSection";

export async function renderHomePageSections() {
  const order = await getPageSectionOrder("home");

  const [
    heroContent,
    servicesGridContent,
    processContent,
    galleryPreviewContent,
    aboutBandContent,
    photoMarqueeContent,
    contactSectionContent,
  ] = await Promise.all([
    getCmsContent("home", "hero", HOME_SECTION_DEFAULTS.hero),
    getCmsContent("home", "servicesGrid", HOME_SECTION_DEFAULTS.servicesGrid),
    getCmsContent("home", "process", HOME_SECTION_DEFAULTS.process),
    getCmsContent("home", "galleryPreview", HOME_SECTION_DEFAULTS.galleryPreview),
    getCmsContent("home", "aboutBand", HOME_SECTION_DEFAULTS.aboutBand),
    getCmsContent("home", "photoMarquee", HOME_SECTION_DEFAULTS.photoMarquee),
    getCmsContent("home", "contactSection", HOME_SECTION_DEFAULTS.contactSection),
  ]);

  const heroAcf = { ...heroContent, ...mapHomeHeroContent(heroContent) };
  // Preserve historic home-hero confetti until CMS toggle is saved.
  if (!("showKonfetti" in heroContent)) {
    (heroAcf as Record<string, unknown>).showKonfetti = true;
  }
  const headingTag = parseHeadingTag(heroContent.headingTag, "h1");

  const renderers: Record<HomeSectionKey, () => React.ReactNode> = {
    hero: () => <HeroSection acf={heroAcf} headingTag={headingTag} />,
    servicesGrid: () => (
      <ServicesGrid acf={servicesGridContent as ComponentProps<typeof ServicesGrid>["acf"]} />
    ),
    process: () => (
      <ProcessSection acf={processContent as ComponentProps<typeof ProcessSection>["acf"]} />
    ),
    galleryPreview: () => (
      <GalleryPreview acf={galleryPreviewContent as ComponentProps<typeof GalleryPreview>["acf"]} />
    ),
    aboutBand: () => (
      <AboutBand acf={aboutBandContent as ComponentProps<typeof AboutBand>["acf"]} />
    ),
    photoMarquee: () => (
      <PhotoMarquee acf={photoMarqueeContent as ComponentProps<typeof PhotoMarquee>["acf"]} />
    ),
    contactSection: () => (
      <HeroContactSection acf={contactSectionContent as ComponentProps<typeof HeroContactSection>["acf"]} />
    ),
  };

  return order
    .filter((key): key is HomeSectionKey => key in renderers)
    .map((key) => <div key={key}>{renderers[key]()}</div>);
}
