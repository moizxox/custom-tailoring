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
  iconSlug = "tailor-dummy-fashion-sewing-tailoring.svg",
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
    <section className="relative overflow-hidden bg-offwhite pt-20 lg:pt-24">
      <BackgroundDecor variant="page" showConfetti={false} />

      {/* ── Main content area ──────────────────────────────────────────────── */}
      <div className="container-site relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">

        {/* LEFT: text content */}
        <div className="pb-10 lg:pb-12 pt-8 lg:pt-12">
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

        {/* RIGHT: large decorative icon panel */}
        <div className="hidden lg:flex items-end justify-center w-56 xl:w-64 self-stretch relative pb-0">
          {/* Large faded watermark icon */}
          <div className="absolute bottom-0 right-4 w-48 xl:w-56 h-48 xl:h-56 opacity-[0.18] pointer-events-none select-none" aria-hidden>
            <Image
              src={`/icons/sewing/${iconSlug}`}
              alt=""
              fill
              className="object-contain object-bottom icon-periwinkle"
            />
          </div>
          {/* Smaller icon in a circle — visible */}
          <div className="relative z-10 mb-8 w-16 h-16 rounded-2xl bg-white border border-periwinkle-light ring-1 ring-gold-muted/20 shadow-soft flex items-center justify-center">
            <Image
              src={`/icons/sewing/${iconSlug}`}
              alt=""
              width={30}
              height={30}
              className="icon-periwinkle"
            />
          </div>
        </div>
      </div>

      {/* ── Bottom border strip ─────────────────────────────────────────────── */}
      <div className="relative z-10">
        {/* Decorative line with ornament */}
        <div className="container-site">
          <div className="flex items-center gap-0">
            <div className="h-px flex-1 bg-gradient-to-r from-gold-muted/50 via-periwinkle to-periwinkle-light" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold-muted mx-2 shrink-0" />
            <div className="h-px w-8 bg-gradient-to-r from-periwinkle-light to-gold-light/40" />
          </div>
        </div>

        {/* Subtle strip of tiny sewing icons */}
        <div className="bg-offwhite-warm border-t border-gold-muted/20 py-3 overflow-hidden">
          <div className="flex items-center gap-5 px-6 opacity-30 justify-center flex-wrap">
            {[
              "scissor-cut-fabric-sewing.svg",
              "spool-of-thread-sewing-tailoring-needle.svg",
              "pin-cushion-handcraft-sewing-tailoring.svg",
              "tape-measure-sewing-tailoring-size.svg",
              "button-sewing-tailoring-handcraft.svg",
              "needle-threader-fashion-design-sewing-tailoring.svg",
              "thimble" /* skip if not found */,
              "sewing-needles-sewing-tailoring-needle.svg",
            ]
              .filter((s) => !s.includes("thimble"))
              .map((icon) => (
                <Image
                  key={icon}
                  src={`/icons/sewing/${icon}`}
                  alt=""
                  width={16}
                  height={16}
                  className="icon-charcoal shrink-0"
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
