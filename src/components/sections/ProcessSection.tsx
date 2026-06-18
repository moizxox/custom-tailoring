const STEPS = [
  {
    number: "01",
    title: "Beratung",
    description:
      "Wir lernen Sie und Ihre Wünsche kennen. In einem persönlichen Gespräch besprechen wir Ihr Projekt und die passenden Möglichkeiten.",
  },
  {
    number: "02",
    title: "Konzept & Design",
    description:
      "Wir entwerfen ein individuelles Konzept – von der Skizze bis zum fertigen Entwurf, immer abgestimmt auf Ihren Stil.",
  },
  {
    number: "03",
    title: "Anfertigung",
    description:
      "Mit Präzision und Liebe zum Detail entstehen Ihre Kostüme in unserem Basler Atelier – massgeschneidert.",
  },
  {
    number: "04",
    title: "Anprobe & Übergabe",
    description:
      "Wir passen alles an und übergeben Ihr perfektes Kostüm. Pünktlich und so, wie Sie es sich vorgestellt haben.",
  },
];

export function ProcessSection() {
  return (
    <section className="py-24 bg-cream">
      <div className="container-site">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="divider-ornament justify-center mb-6">
            <span>So einfach geht&apos;s</span>
          </div>
          <h2 className="font-serif text-4xl xl:text-5xl text-charcoal">
            Ihr Weg zum{" "}
            <span className="text-lavender italic">perfekten</span> Kostüm
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line on desktop */}
          <div
            className="absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-lavender-lighter via-lavender-light to-lavender-lighter hidden lg:block"
            aria-hidden
          />

          {STEPS.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center text-center relative">
              {/* Step circle */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-lavender-lighter border-2 border-lavender-light flex items-center justify-center mb-5">
                <span className="font-serif text-xl font-semibold text-lavender">
                  {step.number}
                </span>
                {/* Connector arrow (not last) */}
                {index < STEPS.length - 1 && (
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden lg:block">
                    <svg className="w-4 h-4 text-lavender/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="font-serif text-xl text-charcoal mb-3">{step.title}</h3>
              <p className="font-sans text-sm text-charcoal/55 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
