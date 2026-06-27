import { HeroSection } from "@/components/sections/HeroSection";
import { HeroContactSection } from "@/components/sections/HeroContactSection";
import { PhotoMarquee } from "@/components/sections/PhotoMarquee";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { AboutBand } from "@/components/sections/AboutBand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kostümschneiderei Basel – Ihre Kostüme. Unser Handwerk.",
  description: "Massgeschneiderte Kostüme für Guggenmusiken, Cliquen und Einzelpersonen in Basel. Individuelle Beratung, hochwertige Materialien und persönlicher Service.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — explanation + trust card */}
      <HeroSection />

      {/* 2. Services — 12-card grid with sewing icons */}
      <ServicesGrid />

      {/* 3. Process — 4-step customer journey */}
      <ProcessSection />

      {/* 4. Gallery — editorial 3-col photo grid */}
      <GalleryPreview />

      {/* 5. Text breather — separates photo blocks so the page doesn't feel overloaded */}
      <AboutBand />

      {/* 6. Atelier impressions — second photo moment, after copy */}
      <PhotoMarquee />

      {/* 7. Contact form — end of page */}
      <HeroContactSection />
    </>
  );
}
