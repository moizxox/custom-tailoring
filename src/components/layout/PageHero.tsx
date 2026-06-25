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
}

export function PageHero({ label, title, titleAccent, subtitle, breadcrumbs }: PageHeroProps) {
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
      <BackgroundDecor variant="page" showConfetti showStitchDashes showFigures={false} />
      <SideSketchFigures opacity="opacity-[0.5]" width="w-[min(22vw,320px)]" />

      <div className="container-site relative z-10 pb-10 lg:pb-12 pt-8 lg:pt-12">
        <div className="max-w-4xl">
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

          {subtitle && <p className="font-sans text-[15px] text-charcoal-light leading-relaxed mt-5 max-w-2xl">{subtitle}</p>}
        </div>
      </div>

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
