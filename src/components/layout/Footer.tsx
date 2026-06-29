import Link from "next/link";
import Image from "next/image";
import { BackgroundDecor } from "@/components/decor/BackgroundDecor";
import { SideSketchFigures } from "@/components/decor/SideSketchFigures";
import { CookieSettingsButton } from "@/components/layout/CookieSettingsButton";
import { LEGAL_LINKS } from "@/lib/site-content";
import { DEFAULT_FOOTER } from "@/lib/cms/navigation";
import type { FooterContent } from "@/lib/cms/navigation";

interface FooterProps {
  footerContent?: FooterContent;
}

export function Footer({ footerContent }: FooterProps) {
  const d = { ...DEFAULT_FOOTER, ...footerContent };

  return (
    <footer className="relative overflow-hidden mt-4 site-footer-enter">
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-20 left-[10%] w-[420px] h-[280px] rounded-full bg-periwinkle-lighter/30 blur-[90px] animate-glow-drift" />
        <div className="absolute top-[25%] -right-12 w-[400px] h-[360px] rounded-full bg-sand-light/50 blur-[90px] animate-glow-drift [animation-delay:4s]" />
        <div className="absolute top-[45%] left-[40%] w-[480px] h-[300px] rounded-full bg-gold-lighter/30 blur-[100px]" />
      </div>

      <BackgroundDecor variant="footer" showFigures={false} showConfetti={false} showStitchDashes showMesh className="z-[1]" />
      <SideSketchFigures className="z-[1]" opacity="opacity-[0.06]" width="w-[min(20vw,280px)]" />

      <div className="absolute top-5 left-[5%] right-[5%] z-[2] space-y-2.5 pointer-events-none" aria-hidden>
        <div className="line-gold-dashed" />
        <div className="line-gold-dashed-light" />
      </div>

      <div className="absolute inset-x-0 top-0 z-[5] h-[200px] bg-gradient-to-b from-white via-white/70 to-transparent pointer-events-none" aria-hidden />

      <div className="relative z-20 container-site py-12 lg:py-16 flex flex-col gap-5">
        {/* CTA banner */}
        <div className="glass-footer-panel p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-periwinkle-dark mb-2">{d.ctaSubheading}</p>
              <p className="font-serif text-xl md:text-2xl text-charcoal leading-snug">{d.ctaHeading}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
              <Link href={d.ctaPrimaryUrl} className="btn-primary shadow-soft">{d.ctaPrimaryLabel}</Link>
              <Link href={d.ctaSecondaryUrl} className="btn-secondary">{d.ctaSecondaryLabel}</Link>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="glass-footer-panel p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Brand + contact */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/70 ring-1 ring-gold-muted/20 flex items-center justify-center shadow-soft">
                  <Image src="/icons/sewing/tailor-dummy-fashion-sewing-tailoring.svg" alt="" width={20} height={20} className="icon-periwinkle-deep" />
                </div>
                <div>
                  <span className="font-serif text-lg text-charcoal tracking-[0.1em] uppercase block leading-tight">
                    {d.brandName}<span className="text-periwinkle-dark">{d.brandAccent}</span>
                  </span>
                  <span className="font-sans text-[9px] tracking-[0.22em] uppercase text-charcoal/45">{d.brandSubline}</span>
                </div>
              </div>

              {/* Locations */}
              {d.locations.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {d.locations.map((loc) => (
                    <address key={loc.name} className="not-italic text-sm text-charcoal/65">
                      <span className="font-medium text-charcoal block mb-1">Atelier {loc.name}</span>
                      <span>{loc.address}</span>
                      <br />
                      <span>{loc.city}</span>
                    </address>
                  ))}
                </div>
              )}

              {/* Contact */}
              <div className="flex flex-col gap-1 text-sm text-charcoal/65">
                {d.phone && (
                  <a href={d.phoneHref || `tel:${d.phone}`} className="hover:text-periwinkle-dark transition-colors w-fit">
                    {d.phone}
                  </a>
                )}
                {d.email && (
                  <a href={`mailto:${d.email}`} className="hover:text-periwinkle-dark transition-colors w-fit">
                    {d.email}
                  </a>
                )}
                {d.hours && <span className="text-charcoal/50 text-[13px]">{d.hours}</span>}
              </div>

              {/* Social */}
              <div className="flex gap-2.5">
                {[
                  { label: "Instagram", href: d.instagramUrl },
                  { label: "Facebook", href: d.facebookUrl },
                ]
                  .filter((s) => s.href)
                  .map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 flex items-center justify-center text-charcoal/50 hover:text-periwinkle-dark hover:bg-white/80 transition-all duration-200 shadow-soft text-[10px] font-semibold"
                    >
                      {s.label.slice(0, 2)}
                    </a>
                  ))}
              </div>
            </div>

            {/* Link columns */}
            {d.columns.map((col) => (
              <div key={col.heading} className="glass-footer-column">
                <h4 className="font-sans text-[10px] font-semibold tracking-[0.22em] uppercase text-charcoal/40 mb-4">{col.heading}</h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label + l.href}>
                      <Link href={l.href} className="text-[13px] text-charcoal/65 hover:text-periwinkle-dark font-medium transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="glass-footer-subtle px-6 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2 text-[11px] text-charcoal/50">
              {LEGAL_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-charcoal transition-colors">
                  {link.label}
                </Link>
              ))}
              <CookieSettingsButton />
            </div>
            <p className="text-[11px] text-charcoal/50 text-center sm:text-left">
              © {new Date().getFullYear()} {d.copyrightText}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
