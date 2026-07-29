import { PageHero } from "@/components/layout/PageHero";
import { AtelierTimetable } from "@/components/sections/AtelierTimetable";
import { getAtelierLocations } from "@/lib/cms/site-locations";
import { getMeasurementTimetables } from "@/lib/cms/timetables";
import { getCmsContent } from "@/lib/cms/content";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Massen ohne Termin",
  description:
    "Feste Masszeiten ohne Voranmeldung während der Fasnachts-Hochsaison in Pratteln und Therwil.",
};

/**
 * Dedicated page for walk-in measurement times so the client can link it in the
 * header nav (or as a submenu under Service) and remove it outside high season.
 */
export default async function MassenOhneTerminPage() {
  const [heroContent, locations, timetables] = await Promise.all([
    getCmsContent("termin", "timetables", {}),
    getAtelierLocations(),
    getMeasurementTimetables(),
  ]);
  const heroContentRecord = heroContent as Record<string, unknown>;

  const heading =
    typeof heroContentRecord.heading === "string" && heroContentRecord.heading.trim()
      ? heroContentRecord.heading
      : "Massen ohne Termin — Hochsaison";
  const subtext =
    typeof heroContentRecord.subtext === "string" && heroContentRecord.subtext.trim()
      ? heroContentRecord.subtext
      : "Feste Zeiten pro Standort während der Fasnachts-Saison";

  const hero = mapPageHeroContent(heroContentRecord, {
    label: "Massnehmen",
    title: heading,
    titleAccent: "Hochsaison",
    subtitle: subtext,
    headingTag: "h1",
  });

  return (
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
        breadcrumbs={[{ label: "Massen ohne Termin", href: "/massen-ohne-termin" }]}
      />

      <section className="py-16 section-bg-lavender border-y border-periwinkle-light/30">
        <div className="container-site max-w-5xl">
          <AtelierTimetable timetables={timetables} locations={locations} />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/termin" className="btn-primary">
              Individuellen Termin buchen
            </Link>
            <Link href="/kontakt" className="btn-outline-dark">
              Kontakt
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
