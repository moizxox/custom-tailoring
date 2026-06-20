import Image from "next/image";
import Link from "next/link";

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
  iconSlug,
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
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-offwhite overflow-hidden">
      {/* Subtle bg blob */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-periwinkle-lighter/40 to-transparent" />
      </div>

      <div className="container-site relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 mb-6 text-xs font-sans text-charcoal-lighter">
            <Link href="/" className="hover:text-charcoal transition-colors">
              Start
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-2">
                <svg className="w-3 h-3 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-charcoal">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-charcoal transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="flex items-start gap-6">
          {/* Optional icon */}
          {iconSlug && (
            <div className="hidden md:flex w-16 h-16 rounded-2xl bg-periwinkle-lighter shrink-0 items-center justify-center mt-1">
              <Image
                src={`/icons/sewing/${iconSlug}`}
                alt=""
                width={32}
                height={32}
                className="icon-periwinkle"
              />
            </div>
          )}

          <div>
            {label && <p className="section-label mb-3">{label}</p>}
            <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl text-charcoal leading-tight text-balance">
              {renderTitle()}
            </h1>
            {subtitle && (
              <p className="font-sans text-base text-charcoal-light leading-relaxed mt-4 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Decorative line */}
        <div className="mt-10 h-px bg-gradient-to-r from-periwinkle-light via-stone to-transparent" />
      </div>
    </section>
  );
}
