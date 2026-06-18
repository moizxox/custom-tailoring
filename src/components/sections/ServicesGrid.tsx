import Link from "next/link";
import { cn } from "@/lib/utils";

// Fine-line SVG icons matching the client's illustration style
const services = [
  {
    id: "massanfertigung",
    title: "Massanfertigung",
    description: "Individuell & passgenau für Ihren Auftritt",
    href: "/leistungen#massanfertigung",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.2">
        <path d="M16 8 C12 8 10 12 10 16 L10 40 L38 40 L38 16 C38 12 36 8 32 8" />
        <path d="M16 8 L16 18 L24 14 L32 18 L32 8" />
        <line x1="24" y1="14" x2="24" y2="40" />
        <path d="M14 24 L10 24 M34 24 L38 24" />
        <circle cx="24" cy="6" r="3" />
      </svg>
    ),
  },
  {
    id: "designberatung",
    title: "Designberatung",
    description: "Konzept & Entwurf für Ihr Kostüm",
    href: "/leistungen#designberatung",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.2">
        <rect x="8" y="6" width="28" height="36" rx="2" />
        <path d="M14 6 L14 42" />
        <line x1="20" y1="14" x2="32" y2="14" />
        <line x1="20" y1="20" x2="32" y2="20" />
        <line x1="20" y1="26" x2="28" y2="26" />
        <path d="M30 30 L36 36 M33 27 L39 33 L36 36 L30 30" />
      </svg>
    ),
  },
  {
    id: "stoffauswahl",
    title: "Stoffauswahl",
    description: "Feines für höchsten Tragekomfort",
    href: "/leistungen#stoffe",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.2">
        <rect x="8" y="10" width="20" height="26" rx="1" />
        <rect x="14" y="14" width="20" height="26" rx="1" />
        <path d="M10 10 C10 8 12 6 14 6 L28 6 C30 6 32 8 32 10" />
        <path d="M16 14 C16 12 18 10 20 10 L34 10 C36 10 38 12 38 14" />
        <path d="M12 22 L20 22 M12 26 L22 26 M12 30 L18 30" />
      </svg>
    ),
  },
  {
    id: "massnehmen",
    title: "Massnehmen",
    description: "Präzise Masse für perfekte Passform",
    href: "/massblatt",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.2">
        <path d="M12 8 L12 40" />
        <path d="M12 8 C12 8 20 12 24 24 C28 36 36 40 36 40" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="8" y1="18" x2="14" y2="18" />
        <line x1="8" y1="24" x2="16" y2="24" />
        <line x1="8" y1="30" x2="14" y2="30" />
        <line x1="8" y1="36" x2="16" y2="36" />
        <path d="M24 20 C26 20 28 22 28 24 C28 26 26 28 24 28 C22 28 20 26 20 24 C20 22 22 20 24 20" />
      </svg>
    ),
  },
  {
    id: "schnittmuster",
    title: "Schnittmuster",
    description: "Traditionelles Handwerk trifft Präzision",
    href: "/leistungen#schnittmuster",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.2">
        <polygon points="8,40 24,8 40,40" />
        <line x1="14" y1="30" x2="34" y2="30" />
        <line x1="18" y1="22" x2="30" y2="22" />
        <path d="M36 24 C38 20 42 18 42 14 C42 10 38 8 36 10 C34 8 30 10 30 14 C30 18 34 20 36 24" />
        <line x1="36" y1="24" x2="36" y2="32" />
        <line x1="32" y1="32" x2="40" y2="32" />
      </svg>
    ),
  },
  {
    id: "anfertigung",
    title: "Anfertigung",
    description: "Handwerk & Qualität bis zur letzten Naht",
    href: "/leistungen#anfertigung",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.2">
        <rect x="10" y="14" width="28" height="20" rx="3" />
        <path d="M16 14 L16 10 M32 14 L32 10" />
        <circle cx="24" cy="10" r="3" />
        <line x1="10" y1="22" x2="38" y2="22" />
        <path d="M16 26 C16 26 20 30 24 26 C28 22 32 26 32 26" />
        <path d="M10 34 L10 40 M38 34 L38 40" />
        <line x1="6" y1="40" x2="42" y2="40" />
      </svg>
    ),
  },
  {
    id: "aenderungen",
    title: "Änderungen",
    description: "Anpassungen mit Sorgfalt & Erfahrung",
    href: "/leistungen#aenderungen",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.2">
        <circle cx="16" cy="16" r="6" />
        <circle cx="16" cy="16" r="2" />
        <path d="M22 16 L38 16" />
        <line x1="16" y1="22" x2="16" y2="40" />
        <path d="M12 36 C12 36 16 32 20 36 C24 40 28 36 32 36 L38 36" />
        <path d="M6 16 L10 16" />
        <path d="M16 6 L16 10" />
      </svg>
    ),
  },
  {
    id: "reparaturen",
    title: "Reparaturen",
    description: "Dem Kostüm neues Leben schenken",
    href: "/leistungen#reparaturen",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.2">
        <path d="M20 8 L20 28 L28 28 L28 8" />
        <path d="M16 8 L32 8" />
        <path d="M24 8 L24 4" />
        <circle cx="24" cy="3" r="2" />
        <path d="M20 28 C20 28 14 32 14 38 C14 42 18 44 22 44 L26 44 C30 44 34 42 34 38 C34 32 28 28 28 28" />
        <line x1="20" y1="34" x2="28" y2="34" />
      </svg>
    ),
  },
  {
    id: "stoffdruck",
    title: "Stoffdruck",
    description: "Einzigartige Motive & Designs",
    href: "/leistungen#stoffdruck",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.2">
        <rect x="10" y="20" width="28" height="18" rx="2" />
        <path d="M16 20 L16 14 C16 10 20 8 24 8 C28 8 32 10 32 14 L32 20" />
        <path d="M14 20 L14 16 C14 10 18 6 24 6 C30 6 34 10 34 16 L34 20" />
        <path d="M18 30 C20 26 24 24 28 28 C30 30 30 34 28 36" />
        <circle cx="36" cy="26" r="3" />
        <path d="M10 26 L14 26" />
      </svg>
    ),
  },
  {
    id: "serienanfertigung",
    title: "Serienanfertigung",
    description: "Für Gruppen, Cliquen & Guggenmusiken",
    href: "/leistungen#serienanfertigung",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.2">
        <path d="M8 12 L8 38 M14 10 L14 36 M20 12 L20 38" />
        <path d="M6 16 L22 16 M6 24 L22 24 M6 32 L22 32" />
        <path d="M28 12 L28 38 M34 10 L34 36 M40 12 L40 38" />
        <path d="M26 16 L42 16 M26 24 L42 24 M26 32 L42 32" />
      </svg>
    ),
  },
  {
    id: "termin",
    title: "Termin buchen",
    description: "Beratungsgespräch vereinbaren",
    href: "/termin",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.2">
        <rect x="8" y="12" width="32" height="28" rx="3" />
        <line x1="8" y1="20" x2="40" y2="20" />
        <line x1="16" y1="8" x2="16" y2="16" />
        <line x1="32" y1="8" x2="32" y2="16" />
        <rect x="14" y="25" width="6" height="5" rx="1" />
        <rect x="22" y="25" width="6" height="5" rx="1" />
        <rect x="30" y="25" width="6" height="5" rx="1" />
        <rect x="14" y="33" width="6" height="5" rx="1" />
        <rect x="22" y="33" width="6" height="5" rx="1" />
      </svg>
    ),
  },
  {
    id: "abholung",
    title: "Abholung & Lieferung",
    description: "Unkomplizierte Übergabe Ihres Kostüms",
    href: "/kontakt#abholung",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 48 48" strokeWidth="1.2">
        <path d="M24 8 L24 32" />
        <path d="M16 12 L24 8 L32 12" />
        <path d="M16 18 L24 14 L32 18" />
        <rect x="12" y="32" width="24" height="12" rx="2" />
        <line x1="24" y1="32" x2="24" y2="44" />
        <path d="M16 36 L16 40 M20 36 L20 40" />
        <path d="M28 36 L28 40 M32 36 L32 40" />
      </svg>
    ),
  },
];

interface ServiceCardProps {
  service: (typeof services)[0];
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <Link
      href={service.href}
      className={cn(
        "group flex flex-col items-center text-center p-6 rounded-2xl border border-cream-deep bg-white",
        "hover:border-lavender-light hover:shadow-card-hover hover:-translate-y-1",
        "transition-all duration-300 ease-out"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <span
        className={cn(
          "text-charcoal/40 group-hover:text-lavender transition-colors duration-300 mb-4"
        )}
      >
        {service.icon}
      </span>
      <h3 className="font-serif text-base font-semibold text-charcoal group-hover:text-lavender transition-colors duration-200 mb-1.5">
        {service.title}
      </h3>
      <p className="font-sans text-xs text-charcoal/50 leading-relaxed">
        {service.description}
      </p>
    </Link>
  );
}

export function ServicesGrid() {
  return (
    <section className="py-24 bg-cream-warm">
      <div className="container-site">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="divider-ornament justify-center mb-6">
            <span>Rundum betreut. Bis ins Detail.</span>
          </div>
          <h2 className="font-serif text-4xl xl:text-5xl text-charcoal text-balance">
            Ihre{" "}
            <span className="text-lavender italic">Vorteile</span>{" "}
            auf einen Blick
          </h2>
          <p className="font-sans text-base text-charcoal/55 mt-4 max-w-xl mx-auto leading-relaxed">
            Von der ersten Idee bis zur finalen Übergabe – wir bieten alles aus
            einer Hand. Verlässlich, transparent und mit Liebe zum Detail.
          </p>
        </div>

        {/* 12-card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/leistungen"
            className="btn-secondary inline-flex items-center gap-2"
          >
            Alle Leistungen ansehen
            <svg
              className="w-4 h-4"
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
      </div>
    </section>
  );
}
