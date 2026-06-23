import Image from "next/image";
import Link from "next/link";
import { BackgroundDecor } from "@/components/decor/BackgroundDecor";

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
}

export function PageHero({
  label,
  title,
  titleAccent,
  subtitle,
  breadcrumbs,
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
      <BackgroundDecor variant="page" showConfetti={false} />

      {/* ── Main content area ──────────────────────────────────────────────── */}
      <div className="container-site relative z-10 pb-10 lg:pb-12 pt-8 lg:pt-12 max-w-4xl">
          {/* Breadcrumbs */}
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

          {/* Label */}
          {label && (
            <p className="section-label mb-4">{label}</p>
          )}

          {/* Title */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-charcoal leading-[1.02] text-balance">
            {renderTitle()}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="font-sans text-[15px] text-charcoal-light leading-relaxed mt-5 max-w-2xl">
              {subtitle}
            </p>
          )}
      </div>

      {/* ── Bottom border strip ─────────────────────────────────────────────── */}
      <div className="relative z-10">
        {/* Decorative line with ornament */}
        <div className="container-site">
          <div className="flex items-center gap-3 py-1">
            <div className="line-gold-dashed flex-1" />
            <div className="w-2 h-2 rounded-full bg-gold-muted shrink-0" />
            <div className="line-gold-dashed-light w-12 shrink-0" />
          </div>
        </div>

        {/* Subtle strip of tiny sewing icons */}
        <div className="bg-offwhite-warm border-t border-dashed border-gold-muted/50 py-4 overflow-hidden">
          <div className="flex items-center gap-8 px-6 opacity-50 justify-center flex-wrap">
            {[
              "scissor-cut-fabric-sewing.svg",
              "spool-of-thread-sewing-tailoring-needle.svg",
              "pin-cushion-handcraft-sewing-tailoring.svg",
              "tape-measure-sewing-tailoring-size.svg",
              "button-sewing-tailoring-handcraft.svg",
              "needle-threader-fashion-design-sewing-tailoring.svg",
              "sewing-needles-sewing-tailoring-needle.svg",
            ].map((icon) => (
              <Image
                key={icon}
                src={`/icons/sewing/${icon}`}
                alt=""
                width={28}
                height={28}
                className="icon-gold shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
