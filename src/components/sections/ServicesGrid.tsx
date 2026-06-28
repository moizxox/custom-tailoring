import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
interface AcfServiceItem {
  title: string;
  description: string;
  icon_slug: string;
  link_url?: string;
}

interface AcfServicesGrid {
  acf_fc_layout: "services_grid";
  section_label?: string;
  heading: string;
  heading_accent?: string;
  subtext?: string;
  services: AcfServiceItem[];
  show_cta: boolean;
  cta_label?: string;
  cta_url?: string;
}

// ─── Default ACF data ─────────────────────────────────────────────────────────
const DEFAULT_DATA: AcfServicesGrid = {
  acf_fc_layout: "services_grid",
  section_label: "Von der Idee bis zum fertigen Kostüm",
  heading: "Unsere Leistungen",
  heading_accent: "Leistungen",
  subtext: "Alles aus einer Hand – von der Beratung über die Massanfertigung bis zur Übergabe. Verlässlich, präzise und mit Liebe zum Handwerk.",
  show_cta: true,
  cta_label: "Alle Leistungen",
  cta_url: "/leistungen",
  services: [
    {
      title: "Individuelle Beratung",
      description: "Wir hören zu, verstehen Ihre Wünsche und finden das passende Konzept.",
      icon_slug: "tailor-dummy-ruler-sewing-tailoring.svg",
      link_url: "/leistungen#beratung",
    },
    {
      title: "Massanfertigung",
      description: "Jedes Kostüm wird nach Ihren Massen und Vorstellungen gefertigt.",
      icon_slug: "tape-measure-sewing-tailoring-size.svg",
      link_url: "/leistungen#massanfertigung",
    },
    {
      title: "Feinste Materialien",
      description: "Hochwertige Stoffe und liebevolle Details für einzigartige Kostüme.",
      icon_slug: "fabric-cloth-sewing-tailoring.svg",
      link_url: "/leistungen#stoffe",
    },
    {
      title: "Einzigartige Designs",
      description: "Kreativ, stilvoll und mit Liebe zum Detail — von Sketch bis Stoff.",
      icon_slug: "pencil-sewing-tailoring-drawing.svg",
      link_url: "/leistungen#design",
    },
    {
      title: "Fasnacht mit Stil",
      description: "Für unvergessliche Momente — Kostüme, die Geschichten erzählen.",
      icon_slug: "hanger-sewing-fashion-cloth.svg",
      link_url: "/leistungen#fasnacht",
    },
    {
      title: "Schnittmuster",
      description: "Traditionelles Handwerk trifft zeitlose Eleganz.",
      icon_slug: "sewing-pattern-sewing-tailoring-fashion-design.svg",
      link_url: "/leistungen#schnittmuster",
    },
    {
      title: "Serienanfertigung",
      description: "Für Guggenmusiken, Cliquen und Gruppen — gleichmässig und präzise.",
      icon_slug: "sewing-machine-sewing-tailoring-cloth.svg",
      link_url: "/leistungen#serienanfertigung",
    },
    {
      title: "Änderungen",
      description: "Anpassungen mit Sorgfalt — damit alles perfekt sitzt.",
      icon_slug: "seam-ripper-sewing-tool-tailoring.svg",
      link_url: "/leistungen#aenderungen",
    },
    {
      title: "Reparaturen",
      description: "Wir geben Ihrem Lieblingsstück neues Leben.",
      icon_slug: "sewing-needles-sewing-tailoring-needle.svg",
      link_url: "/leistungen#reparaturen",
    },
    {
      title: "Stoffauswahl",
      description: "Persönliche Begleitung beim Auswählen der besten Materialien.",
      icon_slug: "box-threads-sewing-tailoring.svg",
      link_url: "/leistungen#stoffe",
    },
    {
      title: "Termin buchen",
      description: "Vereinbaren Sie ein unverbindliches Beratungsgespräch.",
      icon_slug: "pin-cushion-handcraft-sewing-tailoring.svg",
      link_url: "/termin",
    },
    {
      title: "Persönlicher Service",
      description: "Wir begleiten Sie mit Herz und Leidenschaft — auch nach der Übergabe.",
      icon_slug: "button-sewing-tailoring-handcraft.svg",
      link_url: "/kontakt",
    },
  ],
};

function ServiceCard({ item }: { item: AcfServiceItem }) {
  const card = (
    <div
      className={cn(
        "group flex flex-col items-center text-center gap-4 p-5 rounded-2xl h-full",
        "card-gradient",
        "hover:border-periwinkle-light hover:shadow-card-hover hover:-translate-y-1",
        "transition-all duration-300 ease-out cursor-pointer",
      )}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-soft">
        <Image src={`/icons/sewing/${item.icon_slug}`} alt="" width={26} height={26} className="icon-periwinkle" />
      </div>

      {/* Text — flex-1 pushes content to fill remaining height */}
      <div className="flex flex-col flex-1">
        <h3 className="font-serif text-[14px] font-semibold text-charcoal group-hover:text-periwinkle-deep transition-colors duration-200 mb-1.5 leading-snug">{item.title}</h3>
        <p className="font-sans text-[11px] text-charcoal-lighter leading-relaxed">{item.description}</p>
      </div>
    </div>
  );

  if (item.link_url) {
    return (
      <Link href={item.link_url} className="block reveal-item">
        {card}
      </Link>
    );
  }
  return <div className="reveal-item">{card}</div>;
}

interface ServicesGridProps {
  acf?: Partial<AcfServicesGrid>;
}

export function ServicesGrid({ acf }: ServicesGridProps) {
  const data = { ...DEFAULT_DATA, ...acf };

  return (
    <section className="py-24 section-bg-white">
      <div className="container-site">
        {/* Header */}
        <div className="text-center mb-14 reveal-header">
          {data.section_label && (
            <div className="divider-ornament justify-center mb-5">
              <span>{data.section_label}</span>
            </div>
          )}
          <h2 className="section-heading mb-4">
            {data.heading_accent ? (
              <>
                {data.heading.split(data.heading_accent)[0]}
                <em className="not-italic italic text-periwinkle-dark">{data.heading_accent}</em>
                {data.heading.split(data.heading_accent)[1]}
              </>
            ) : (
              data.heading
            )}
          </h2>
          {data.subtext && <p className="section-subtext max-w-xl mx-auto">{data.subtext}</p>}
        </div>

        {/* 12-card grid — auto-rows ensures equal heights in every row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 auto-rows-fr">
          {data.services.map((service) => (
            <ServiceCard key={service.title} item={service} />
          ))}
        </div>

        {/* Bottom CTA */}
        {data.show_cta && data.cta_label && data.cta_url && (
          <div className="mt-12 flex justify-center reveal-item">
            <Link href={data.cta_url} className="btn-outline-dark inline-flex items-center gap-2">
              {data.cta_label}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
