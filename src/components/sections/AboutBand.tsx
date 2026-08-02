import Image from "next/image";
import Link from "next/link";
import { AccentHeadingText } from "@/components/ui/AccentHeadingText";
import { CmsSectionShell } from "@/components/cms/CmsSectionShell";
import { parseBool, parseSectionAppearance } from "@/lib/cms/section-appearance";

interface UspCard {
  icon_slug?: string;
  title: string;
  subtitle?: string;
  description: string;
}

interface AcfAboutBand {
  acf_fc_layout: "about_band";
  section_label?: string;
  heading: string;
  heading_accent?: string;
  body_text: string;
  cta_label: string;
  cta_url: string;
  cta_secondary_label?: string;
  cta_secondary_url?: string;
  /** When false, hide icons on all USP tiles (text-only cards). */
  showIcons?: boolean;
  usps: UspCard[];
}

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
  showIcons: true,
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

/** Split long Basler title into title + subtitle when CMS stored them as one line. */
function normalizeUsp(usp: UspCard): UspCard {
  const subtitle = usp.subtitle?.trim();
  if (subtitle) return { ...usp, subtitle };

  const title = usp.title.trim();
  const basler = title.match(
    /^Basler\s+Fasnachtskostüme\s*(?:für|&)\s*(Erwachsene\s*(?:und|&)\s*Kinder)?$/i
  );
  if (basler) {
    return {
      ...usp,
      title: "Basler Fasnachtskostüme",
      subtitle: "für Erwachsene und Kinder",
    };
  }

  const baslerLoose = title.match(/^Basler\s+Fasnachtskostüme\s+(.+)$/i);
  if (baslerLoose) {
    return {
      ...usp,
      title: "Basler Fasnachtskostüme",
      subtitle: baslerLoose[1].replace(/^für\s+/i, "für ").replace(/\s*&\s*/g, " und "),
    };
  }

  return usp;
}

interface AboutBandProps {
  acf?: Partial<AcfAboutBand>;
}

export function AboutBand({ acf }: AboutBandProps) {
  const cmsProvided = acf as Record<string, unknown> | undefined;
  const uspsFromCms = Array.isArray(acf?.usps);
  const data = {
    ...DEFAULT_DATA,
    ...acf,
    usps: uspsFromCms
      ? (acf!.usps as typeof DEFAULT_DATA.usps).map(normalizeUsp)
      : DEFAULT_DATA.usps,
  };

  if (cmsProvided && Object.prototype.hasOwnProperty.call(cmsProvided, "heading") && !String(acf?.heading ?? "").trim()) {
    return null;
  }

  const appearance = parseSectionAppearance(acf as Record<string, unknown>);
  const showIcons =
    cmsProvided && Object.prototype.hasOwnProperty.call(cmsProvided, "showIcons")
      ? parseBool(cmsProvided.showIcons)
      : data.showIcons !== false;

  return (
    <CmsSectionShell appearance={appearance} defaultClassName="section-bg-clean" className="py-20">
      <div className="container-site">
        <div className="rounded-3xl card-gradient overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
            {/* Left copy */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              {data.section_label && (
                <p className="section-label mb-4" style={appearance.textColor ? { color: appearance.textColor } : undefined}>{data.section_label}</p>
              )}
              <h2 className="font-serif text-3xl xl:text-4xl leading-snug mb-5" style={appearance.textColor ? { color: appearance.textColor } : undefined}>
                <AccentHeadingText heading={data.heading} accent={data.heading_accent} accentColor={appearance.accentColor} />
              </h2>
              <p className="font-sans text-sm leading-relaxed mb-8 max-w-sm" style={appearance.textColor ? { color: appearance.textColor, opacity: 0.85 } : undefined}>
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

            {/* Right USPs — balanced 2×2 on desktop, equal tile size */}
            <div className="p-10 lg:p-14 lg:pl-0 flex">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full auto-rows-fr content-stretch">
                {data.usps.map((usp) => {
                  const icon = usp.icon_slug?.trim();
                  return (
                    <div
                      key={usp.title + (usp.subtitle ?? "")}
                      className="bg-white/70 border border-white rounded-2xl p-5 flex flex-col gap-3 h-full min-h-[8.5rem]"
                    >
                      {showIcons && icon ? (
                        <div className="w-10 h-10 rounded-full bg-periwinkle-lighter flex items-center justify-center shrink-0">
                          <Image
                            src={`/icons/sewing/${icon}`}
                            alt=""
                            width={20}
                            height={20}
                            className="icon-periwinkle"
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-col flex-1 justify-center min-h-0">
                        <p className="font-serif text-[15px] text-charcoal font-semibold leading-snug">
                          {usp.title}
                        </p>
                        {usp.subtitle ? (
                          <p className="font-sans text-[12px] text-periwinkle-dark font-medium leading-snug mt-0.5">
                            {usp.subtitle}
                          </p>
                        ) : null}
                        {usp.description ? (
                          <p className="font-sans text-[12px] text-charcoal-lighter leading-relaxed mt-1">
                            {usp.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CmsSectionShell>
  );
}
