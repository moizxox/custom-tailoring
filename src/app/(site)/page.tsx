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
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kostümschneiderei Basel – Ihre Kostüme. Unser Handwerk.",
  description:
    "Massgeschneiderte Kostüme für Guggenmusiken, Cliquen und Einzelpersonen in Basel. Individuelle Beratung, hochwertige Materialien und persönlicher Service.",
};

export default async function HomePage() {
  const heroContent = await getCmsContent<Record<string, unknown>>("home", "hero", HOME_SECTION_DEFAULTS.hero);
  const heroAcf = mapHomeHeroContent(heroContent);
  const headingTag = parseHeadingTag(heroContent.headingTag, "h1");
  const servicesGridContent = await getCmsContent<Record<string, unknown>>("home", "servicesGrid", HOME_SECTION_DEFAULTS.servicesGrid);
  const processContent = await getCmsContent<Record<string, unknown>>("home", "process", HOME_SECTION_DEFAULTS.process);
  const galleryPreviewContent = await getCmsContent<Record<string, unknown>>("home", "galleryPreview", HOME_SECTION_DEFAULTS.galleryPreview);
  const aboutBandContent = await getCmsContent<Record<string, unknown>>("home", "aboutBand", HOME_SECTION_DEFAULTS.aboutBand);
  const photoMarqueeContent = await getCmsContent<Record<string, unknown>>("home", "photoMarquee", HOME_SECTION_DEFAULTS.photoMarquee);
  const contactSectionContent = await getCmsContent<Record<string, unknown>>("home", "contactSection", HOME_SECTION_DEFAULTS.contactSection);

  return (
    <>
      <HeroSection acf={heroAcf} headingTag={headingTag} />
      <ServicesGrid acf={servicesGridContent as any} />
      <ProcessSection acf={processContent as any} />
      <GalleryPreview acf={galleryPreviewContent as any} />
      <AboutBand acf={aboutBandContent as any} />
      <PhotoMarquee acf={photoMarqueeContent as any} />
      <HeroContactSection acf={contactSectionContent as any} />
    </>
  );
}
