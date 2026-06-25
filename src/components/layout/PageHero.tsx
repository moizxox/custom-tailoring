import Image from "next/image";
import Link from "next/link";
import { BackgroundDecor } from "@/components/decor/BackgroundDecor";
import { SideSketchFigures } from "@/components/decor/SideSketchFigures";

interface Breadcrumb {
  label: string;
  href: string;
}

interface PageHeroProps {
  label?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  iconSlug?: string;
  /** Single large, faint sewing icon in the hero background center */
  backgroundIcon?: string;
}

const DEFAULT_BACKGROUND_ICON = "sewing-machine-sewing-tailoring-cloth.svg";

export function PageHero({
  label,
  title,
  titleAccent,
  subtitle,
  breadcrumbs,
  backgroundIcon = DEFAULT_BACKGROUND_ICON,
}: PageHeroProps) {

  const renderTitle = () => {
    if (!titleAccent || !title.includes(titleAccent)) return title;
    const parts = title.split(titleAccent);
    return (
      <>
        {parts[0]}
        <em className="not-italic italic text-periwinkle-dark">{titleAccent}</em>
        {parts[1]}
      </>
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-offwhite via-offwhite-warm to-sand-light/20 pt-20 lg:pt-24">
      <BackgroundDecor variant="page" showConfetti={false} showFigures={false} />
      <SideSketchFigures />

      {/* Single sewing icon — dead center, behind content */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-[1]" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-44 md:h-44 opacity-[0.14] hidden sm:block">
          <Image src={`/icons/sewing/${backgroundIcon}`} alt="" fill className="object-contain icon-periwinkle" sizes="176px" />
        </div>
      </div>

      {/* ── Main content area ──────────────────────────────────────────────── */}
      <div className="container-site relative z-10 pb-10 lg:pb-12 pt-8 lg:pt-12 max-w-4xl">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="font-sans text-[11px] text-charcoal-lighter hover:text-charcoal transition-colors">
              Start
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                <svg className="w-2.5 h-2.5 text-stone-dark shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {i === breadcrumbs.length - 1 ? (
                  <span className="font-sans text-[11px] text-charcoal font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="font-sans text-[11px] text-charcoal-lighter hover:text-charcoal transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        )}

        {label && <p className="section-label mb-4">{label}</p>}

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-charcoal leading-[1.02] text-balance">{renderTitle()}</h1>

        {subtitle && (
          <p className="font-sans text-[15px] text-charcoal-light leading-relaxed mt-5 max-w-2xl">{subtitle}</p>
        )}
      </div>

      {/* ── Bottom border strip ─────────────────────────────────────────────── */}
      <div className="relative z-10">
        <div className="container-site">
          <div className="flex items-center gap-3 py-1 pb-4">
            <div className="line-gold-dashed flex-1" />
            <div className="w-2 h-2 rounded-full bg-gold-muted shrink-0" />
            <div className="line-gold-dashed-light w-12 shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
