import { HeroSection } from "@/components/sections/HeroSection";
import { HeroContactSection } from "@/components/sections/HeroContactSection";
import { PhotoMarquee } from "@/components/sections/PhotoMarquee";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { AboutBand } from "@/components/sections/AboutBand";
import { getCmsContent } from "@/lib/cms/content";
import { mapHomeHeroContent, parseHeadingTag } from "@/lib/cms/helpers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kostümschneiderei Basel – Ihre Kostüme. Unser Handwerk.",
  description:
    "Massgeschneiderte Kostüme für Guggenmusiken, Cliquen und Einzelpersonen in Basel. Individuelle Beratung, hochwertige Materialien und persönlicher Service.",
};

export default async function HomePage() {
  const heroContent = await getCmsContent<Record<string, unknown>>("home", "hero", {});
  const heroAcf = mapHomeHeroContent(heroContent);
  const headingTag = parseHeadingTag(heroContent.headingTag, "h1");

  return (
    <>
      <HeroSection acf={heroAcf} headingTag={headingTag} />
      <ServicesGrid />
      <ProcessSection />
      <GalleryPreview />
      <AboutBand />
      <PhotoMarquee />
      <HeroContactSection />
    </>
  );
}
