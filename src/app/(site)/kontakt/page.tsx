import { KontaktPageContent } from "@/app/(site)/kontakt/KontaktPageContent";
import { getCmsContent } from "@/lib/cms/content";
import { getAtelierLocations } from "@/lib/cms/site-locations";
import { getSiteContactInfo } from "@/lib/cms/site-contact";
import { getMeasurementTimetables } from "@/lib/cms/timetables";
import { mapContactFormConfig, mapPageHeroContent } from "@/lib/cms/helpers";
import { parseSectionAppearance } from "@/lib/cms/section-appearance";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktieren Sie die Kostümschneiderei Basel in Pratteln oder Therwil.",
};

const DEFAULT_HERO = {
  label: "Sprechen wir",
  title: "Kontakt",
  titleAccent: "Kontakt",
  subtitle: "Zwei Ateliers in Pratteln und Therwil — persönlich, per Telefon oder E-Mail.",
  headingTag: "h1" as const,
};

const DEFAULT_FORM = {
  title: "Nachricht senden",
  subtitle: "Wir antworten innerhalb von 24 Stunden.",
  namePlaceholder: "Name *",
  phonePlaceholder: "Telefon",
  emailPlaceholder: "E-Mail *",
  messagePlaceholder: "Ihre Nachricht *",
  submitLabel: "Nachricht senden",
  successTitle: "Vielen Dank!",
  successMessage: "Wir melden uns persönlich und zeitnah.",
};

export default async function KontaktPage() {
  const [heroContent, formContent, contact, locations, timetables] = await Promise.all([
    getCmsContent("kontakt", "hero", {}),
    getCmsContent("kontakt", "contactForm", {}),
    getSiteContactInfo(),
    getAtelierLocations(),
    getMeasurementTimetables(),
  ]);
  const hero = mapPageHeroContent(heroContent, DEFAULT_HERO);

  const form = mapContactFormConfig(formContent, DEFAULT_FORM);
  const formAppearance = parseSectionAppearance(formContent);

  return (
    <KontaktPageContent
      hero={hero}
      form={form}
      formAppearance={formAppearance}
      contact={contact}
      locations={locations}
      timetables={timetables}
    />
  );
}
