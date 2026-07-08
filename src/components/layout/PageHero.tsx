import { AccentHeadingText } from "@/components/ui/AccentHeadingText";
import Link from "next/link";
import { BackgroundDecor } from "@/components/decor/BackgroundDecor";
import { HeroConfettiBackground } from "@/components/decor/HeroConfettiBackground";

import type { HeadingTag } from "@/lib/cms/helpers";
import { createElement } from "react";

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
  headingTag?: HeadingTag;
  // CMS color overrides
  textColor?: string;
  accentColor?: string;
}

export function PageHero({
  label,
  title,
  titleAccent,
  subtitle,
  breadcrumbs,
  headingTag = "h1",
  textColor,
  accentColor,
}: PageHeroProps) {
  const renderTitle = () => (
    <AccentHeadingText heading={title} accent={titleAccent} accentColor={accentColor} />
  );

  return (
    <section className="relative overflow-hidden bg-offwhite pt-20 lg:pt-24 min-h-[60vh]">
      <HeroConfettiBackground sketchOpacity="opacity-[0.5]" />
      <BackgroundDecor variant="page" showConfetti={false} showMesh={false} showStitchDashes showFigures={false} />

      <div className="container-site relative z-10 pb-10 lg:pb-12 pt-8 lg:pt-12">
        <div className="max-w-3xl mx-auto text-center">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center justify-center gap-1.5 mb-6" aria-label="Breadcrumb">
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

          {label && (
            <div className="flex justify-center mb-4">
              <p className="section-label" style={textColor ? { color: textColor } : undefined}>{label}</p>
            </div>
          )}

          {createElement(
            headingTag,
            {
              className: "font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.02] text-balance",
              style: textColor ? { color: textColor } : { color: "var(--color-charcoal)" },
            },
            renderTitle()
          )}

          {subtitle && (
            <p
              className="font-sans text-[15px] leading-relaxed mt-5 max-w-2xl mx-auto"
              style={textColor ? { color: textColor, opacity: 0.85 } : { color: "var(--color-charcoal-light)" }}
            >
              {subtitle}
            </p>
          )}
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
