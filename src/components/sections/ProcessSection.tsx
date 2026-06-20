import type { AcfProcess } from "@/types";

const DEFAULT_DATA: AcfProcess = {
  acf_fc_layout: "process",
  section_label: "So einfach geht's",
  heading: "Ihr Weg zum",
  heading_accent: "perfekten Kostüm",
  steps: [
    {
      number: "01",
      title: "Beratung",
      description: "Wir lernen Sie und Ihre Wünsche kennen. Persönlich, offen und ohne Druck.",
    },
    {
      number: "02",
      title: "Konzept & Design",
      description: "Wir entwerfen ein individuelles Konzept – von der Skizze bis zum Entwurf.",
    },
    {
      number: "03",
      title: "Anfertigung",
      description: "Mit Präzision und Liebe zum Detail entstehen Ihre Kostüme in unserem Atelier.",
    },
    {
      number: "04",
      title: "Anprobe & Übergabe",
      description: "Wir passen alles an und übergeben Ihr perfektes Kostüm – pünktlich und mit Sorgfalt.",
    },
  ],
};

interface ProcessSectionProps {
  acf?: Partial<AcfProcess>;
}

export function ProcessSection({ acf }: ProcessSectionProps) {
  const data = { ...DEFAULT_DATA, ...acf };

  return (
    <section className="py-24 bg-offwhite-warm">
      <div className="container-site">
        {/* Header */}
        <div className="text-center mb-16">
          {data.section_label && (
            <div className="divider-ornament justify-center mb-5">
              <span>{data.section_label}</span>
            </div>
          )}
          <h2 className="section-heading">
            {data.heading}{" "}
            {data.heading_accent && (
              <em className="not-italic italic text-periwinkle-dark">{data.heading_accent}</em>
            )}
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div
            className="absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-stone to-transparent hidden lg:block"
            aria-hidden
          />

          {data.steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center text-center relative">
              {/* Circle */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-white border-2 border-periwinkle-light flex items-center justify-center mb-5 shadow-soft">
                <span className="font-serif text-xl text-periwinkle-dark font-semibold">
                  {step.number}
                </span>
                {/* Arrow connector */}
                {index < data.steps.length - 1 && (
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden lg:block">
                    <svg className="w-3 h-3 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="font-serif text-lg text-charcoal mb-2.5">{step.title}</h3>
              <p className="font-sans text-[13px] text-charcoal-lighter leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
