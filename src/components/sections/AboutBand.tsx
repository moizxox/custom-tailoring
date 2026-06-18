import Link from "next/link";

const USPs = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
    label: "Persönlich & nah",
    description: "Wir sind für Sie da – mit Herz und Verstand.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    label: "Erfahren & engagiert",
    description: "Handwerk, das begeistert – seit vielen Jahren.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    label: "Für unvergessliche Momente",
    description: "Kostüme, die Geschichten erzählen.",
  },
];

export function AboutBand() {
  return (
    <section className="py-20 bg-lavender/8">
      <div className="container-site">
        <div className="bg-gradient-to-br from-lavender-lighter to-cream rounded-3xl p-10 lg:p-14 flex flex-col lg:flex-row items-center gap-10">
          {/* Left copy */}
          <div className="flex-1 text-center lg:text-left">
            <p className="section-label mb-4">Bereit für Ihr Projekt?</p>
            <h2 className="font-serif text-3xl xl:text-4xl text-charcoal leading-snug mb-5">
              Lassen Sie uns{" "}
              <span className="text-lavender italic">Grossartiges</span> schaffen.
            </h2>
            <p className="font-sans text-sm text-charcoal/60 leading-relaxed mb-7 max-w-md">
              Egal ob Fasnacht, Auftritt oder besonderer Anlass – wir stehen
              Ihnen von der ersten Idee bis zur fertigen Übergabe zur Seite.
            </p>
            <Link
              href="/kontakt"
              className="btn-primary inline-flex"
            >
              Jetzt unverbindlich anfragen
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {/* Right USPs */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-5">
            {USPs.map((usp) => (
              <div
                key={usp.label}
                className="bg-white/60 border border-white rounded-2xl p-5 flex flex-col gap-2"
              >
                <span className="text-lavender">{usp.icon}</span>
                <p className="font-serif text-base text-charcoal font-semibold leading-tight">
                  {usp.label}
                </p>
                <p className="font-sans text-xs text-charcoal/50 leading-relaxed">
                  {usp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
