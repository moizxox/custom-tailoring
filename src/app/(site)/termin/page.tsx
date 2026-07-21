import { PageHero } from "@/components/layout/PageHero";
import { TerminBooking } from "@/components/termin/TerminBooking";
import { getAtelierLocations } from "@/lib/cms/site-locations";
import { getMeasurementTimetables } from "@/lib/cms/timetables";
import { getCmsContent } from "@/lib/cms/content";
import { mapBookingConfig, mapPageHeroContent } from "@/lib/cms/helpers";
import { parseSectionAppearance } from "@/lib/cms/section-appearance";
import { APPOINTMENT_TYPES } from "@/lib/site-content";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Termin buchen",
  description: "Vereinbaren Sie ein persönliches Gespräch in Pratteln oder Therwil.",
};

const DEFAULT_HERO = {
  label: "Terminbuchung",
  title: "Termin buchen",
  titleAccent: "buchen",
  subtitle: "Vereinbaren Sie ein persönliches Gespräch — mit Standortwahl für Pratteln oder Therwil.",
  headingTag: "h1" as const,
};

const DEFAULT_BOOKING = {
  timeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  daysAhead: 5,
  appointmentTypes: [...APPOINTMENT_TYPES],
  walkInTitle: "Massen ohne Termin — feste Zeiten",
  walkInDescription:
    "In der Fasnachts-Hochsaison sind wir zu festen Zeiten im Atelier. Für individuelle Beratungen und Anfertigungen buchen Sie bitte einen Termin nach Vereinbarung.",
  namePlaceholder: "Ihr Name *",
  emailPlaceholder: "E-Mail *",
  phonePlaceholder: "Telefon",
  notesPlaceholder: "Anmerkungen (optional)",
};

export default async function TerminPage() {
  const [heroContent, bookingContent, timetablesContent, locations, timetables] = await Promise.all([
    getCmsContent("termin", "hero", {}),
    getCmsContent("termin", "booking", {}),
    getCmsContent("termin", "timetables", {}),
    getAtelierLocations(),
    getMeasurementTimetables(),
  ]);
  const hero = mapPageHeroContent(heroContent, DEFAULT_HERO);
  const booking = mapBookingConfig(bookingContent, DEFAULT_BOOKING);
  const timetablesAppearance = parseSectionAppearance({ gradientStyle: "lavender", ...timetablesContent });
  const bookingAppearance = parseSectionAppearance(bookingContent);

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
        breadcrumbs={[{ label: "Termin buchen", href: "/termin" }]}
      />
      <Suspense fallback={<div className="py-20 text-center text-charcoal-lighter">Laden…</div>}>
        <TerminBooking
          config={booking}
          locations={locations}
          timetables={timetables}
          timetablesAppearance={timetablesAppearance}
          bookingAppearance={bookingAppearance}
        />
      </Suspense>
    </>
  );
}
