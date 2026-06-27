import { PageHero } from "@/components/layout/PageHero";
import { DATENSCHUTZ_SECTIONS } from "@/content/legal";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutz" };

export default function DatenschutzPage() {
  return (
    <>
      <PageHero
        title="Datenschutzerklärung"
        breadcrumbs={[{ label: "Datenschutz", href: "/datenschutz" }]}
      />
      <section className="py-20 section-bg-white">
        <div className="container-site max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-stone-light p-8 flex flex-col gap-8 font-sans text-sm text-charcoal-light leading-relaxed">
            <p className="text-[12px] text-charcoal-lighter">
              Quelle: bestehende Datenschutzerklärung von{" "}
              <a href="https://www.kostuemschneiderei.ch/datenschutz" className="text-periwinkle-dark hover:underline" target="_blank" rel="noopener noreferrer">
                kostuemschneiderei.ch
              </a>{" "}
              — strukturiert für die neue Website. Vollständige Fassung kann im CMS ergänzt werden.
            </p>
            {DATENSCHUTZ_SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="font-serif text-xl text-charcoal mb-3">{section.title}</h2>
                <div className="flex flex-col gap-2">
                  {section.paragraphs.map((p) => (
                    <p key={p.slice(0, 48)}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
