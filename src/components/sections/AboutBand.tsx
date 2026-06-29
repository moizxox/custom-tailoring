import Image from "next/image";
import Link from "next/link";
import type { AcfAboutBand } from "@/types";

const DEFAULT_DATA: AcfAboutBand = {
  acf_fc_layout: "about_band",
  section_label: "Bereit für Ihr Projekt?",
  heading: "Tradition in jedem Stich.",
  heading_accent: "Tradition",
  body_text:
    "Moderne in jeder Linie. Für Menschen mit Stilgefühl und Anspruch – wir schaffen Kostüme, die Persönlichkeit und Handwerk vereinen.",
  cta_label: "Termin buchen",
  cta_url: "/termin",
  cta_secondary_label: "Unser Angebot",
  cta_secondary_url: "/leistungen",
  usps: [
    {
      icon_slug: "tailor-dummy-fashion-sewing-tailoring.svg",
      title: "Persönlich & nah",
      description: "Wir sind für Sie da – mit Herz und Verstand.",
    },
    {
      icon_slug: "sewing-machine-sewing-tailoring-cloth.svg",
      title: "Erfahren & engagiert",
      description: "Handwerk, das begeistert – seit vielen Jahren.",
    },
    {
      icon_slug: "embroidery-sewing-needlework-handcraft.svg",
      title: "Für besondere Momente",
      description: "Kostüme, die Geschichten erzählen.",
    },
  ],
};

interface AboutBandProps {
  acf?: Partial<AcfAboutBand>;
}

export function AboutBand({ acf }: AboutBandProps) {
  const data = { ...DEFAULT_DATA, ...acf };

  return (
    <section className="py-20 section-bg-clean">
      <div className="container-site">
        <div className="rounded-3xl card-gradient overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left copy */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              {data.section_label && (
                <p className="section-label mb-4">{data.section_label}</p>
              )}
              <h2 className="font-serif text-3xl xl:text-4xl text-charcoal leading-snug mb-5">
                {data.heading_accent
                  ? data.heading.includes(data.heading_accent)
                    ? <>
                        {data.heading.split(data.heading_accent)[0]}
                        <em className="not-italic italic text-periwinkle-dark">{data.heading_accent}</em>
                        {data.heading.split(data.heading_accent)[1]}
                      </>
                    : data.heading
                  : data.heading}
              </h2>
              <p className="font-sans text-sm text-charcoal-light leading-relaxed mb-8 max-w-sm">
                {data.body_text}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href={data.cta_url} className="btn-primary">
                  {data.cta_label}
                </Link>
                {data.cta_secondary_label && (
                  <Link href={data.cta_secondary_url ?? "#"} className="btn-secondary">
                    {data.cta_secondary_label}
                  </Link>
                )}
              </div>
            </div>

            {/* Right USPs */}
            <div className="p-10 lg:p-14 lg:pl-0 flex items-center">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4 w-full">
                {data.usps.map((usp) => (
                  <div
                    key={usp.title}
                    className="bg-white/70 border border-white rounded-2xl p-5 flex flex-col gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-periwinkle-lighter flex items-center justify-center">
                      <Image
                        src={`/icons/sewing/${usp.icon_slug}`}
                        alt=""
                        width={20}
                        height={20}
                        className="icon-periwinkle"
                      />
                    </div>
                    <div>
                      <p className="font-serif text-[15px] text-charcoal font-semibold leading-snug mb-1">
                        {usp.title}
                      </p>
                      <p className="font-sans text-[12px] text-charcoal-lighter leading-relaxed">
                        {usp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
