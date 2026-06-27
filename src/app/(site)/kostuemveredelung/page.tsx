import { PageHero } from "@/components/layout/PageHero";
import { ContentSection } from "@/components/sections/ContentSection";
import { PeriwinkleCtaSection } from "@/components/sections/PeriwinkleCtaSection";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kostümveredelung",
  description: "Stickerei, Stoffdruck und textile Veredelung für Ihre Fasnachtskostüme.",
};

export default function KostuemveredelungPage() {
  return (
    <>
      <PageHero
        label="Veredelung"
        title="Kostümveredelung"
        titleAccent="Veredelung"
        subtitle="Stickerei, Stoffdruck und individuelle Details — damit Ihr Kostüm einzigartig wird."
        breadcrumbs={[{ label: "Kostümveredelung", href: "/kostuemveredelung" }]}
      />

      <ContentSection
        label="Textilveredelung"
        heading="Stickerei & Stoffdruck"
        headingAccent="Stickerei"
        imageSrc="/images/gallery/schloesslischraenzer-major.jpeg"
        imageAlt="Veredeltes Kostüm"
        imagePosition="right"
        paragraphs={[
          "Auf Wunsch veredeln wir Ihre Kostüme mit Stickerei, Applikationen oder Stoffdruck. Logos, Cliquen-Symbole, Namen oder dekorative Elemente werden präzise und langlebig umgesetzt.",
          "Gemeinsam klären wir Motiv, Grösse, Farbe und Platzierung — abgestimmt auf Stoff, Tragekomfort und Ihr Budget.",
        ]}
        ctaLabel="Beratung buchen"
        ctaHref="/termin"
      />

      <section className="py-20 section-bg-blush">
        <div className="container-site max-w-3xl">
          <h2 className="font-serif text-3xl text-charcoal mb-6 text-center">Unsere Veredelungsleistungen</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Stickerei (Maschine & Hand)",
              "Stoffdruck & Transfer",
              "Applikationen & Patches",
              "Cliquen-Logos & Schriftzüge",
              "Namensstickerei",
              "Dekorative Borten & Details",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 bg-white/70 rounded-xl border border-white px-5 py-4 font-sans text-sm text-charcoal-light">
                <span className="w-2 h-2 rounded-full bg-periwinkle shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-center mt-8">
            <Link href="/kontakt" className="btn-primary inline-flex">
              Anfrage senden
            </Link>
          </p>
        </div>
      </section>

      <PeriwinkleCtaSection />
    </>
  );
}
