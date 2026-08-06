import Link from "next/link";
import { CookieSettingsButton } from "@/components/layout/CookieSettingsButton";
import { DEFAULT_FOOTER, type FooterContent } from "@/lib/cms/navigation";

interface FooterProps {
  footerContent?: FooterContent;
}

export function Footer({ footerContent }: FooterProps) {
  const d = { ...DEFAULT_FOOTER, ...footerContent };

  return (
    <footer className="relative overflow-hidden mt-4 site-footer-enter" data-reveal-ignore>
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-20 left-[10%] w-[420px] h-[280px] rounded-full bg-periwinkle-lighter/25 blur-[90px]" />
        <div className="absolute top-[25%] -right-12 w-[400px] h-[360px] rounded-full bg-sand-light/40 blur-[90px]" />
      </div>

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
              {d.phone && (
                <a
                  href={d.phoneHref || `tel:${d.phone}`}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-stone-light/80 bg-white/70 text-charcoal hover:border-periwinkle-dark hover:text-periwinkle-dark transition-colors"
                  aria-label={`Anrufen ${d.phone}`}
                  title={d.phone}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
              )}
              {d.email && (
                <a
                  href={`mailto:${d.email}`}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-stone-light/80 bg-white/70 text-charcoal hover:border-periwinkle-dark hover:text-periwinkle-dark transition-colors"
                  aria-label={`E-Mail ${d.email}`}
                  title={d.email}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              )}
              <a
                href={`https://wa.me/${(d.phoneHref || d.phone).replace(/\D/g, "").replace(/^0/, "41")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-stone-light/80 bg-white/70 text-charcoal hover:border-periwinkle-dark hover:text-periwinkle-dark transition-colors"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.139-1.633-.807-1.886-.9-.253-.093-.437-.139-.62.14-.184.278-.713.9-.873 1.085-.16.185-.32.208-.597.07-.277-.139-1.17-.43-2.227-1.372-.823-.734-1.379-1.64-1.54-1.917-.16-.278-.017-.428.122-.566.125-.124.278-.323.416-.485.139-.162.185-.278.278-.463.093-.185.047-.347-.023-.485-.07-.139-.62-1.497-.85-2.05-.224-.54-.45-.466-.62-.475l-.528-.01c-.185 0-.485.07-.739.347-.253.278-.967.945-.967 2.304s.99 2.673 1.127 2.85c.139.185 1.946 2.97 4.715 4.163.66.285 1.174.455 1.575.582.661.21 1.263.18 1.738.11.53-.079 1.633-.668 1.864-1.313.23-.645.23-1.197.16-1.313-.07-.116-.255-.185-.532-.324z" />
                  <path d="M12.004 2.003c-5.523 0-10 4.477-10 10 0 1.761.46 3.412 1.264 4.846L2.003 22l5.29-1.386A9.953 9.953 0 0012.004 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.15a8.13 8.13 0 01-4.14-1.14l-.297-.176-3.14.823.838-3.06-.193-.314a8.13 8.13 0 01-1.25-4.283c0-4.5 3.66-8.16 8.16-8.16s8.16 3.66 8.16 8.16-3.66 8.15-8.138 8.15z" />
                </svg>
              </a>
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
              <div>
                <span className="font-serif text-lg text-charcoal tracking-[0.1em] uppercase block leading-tight">
                  {d.brandName}<span className="text-periwinkle-dark">{d.brandAccent}</span>
                </span>
                <span className="font-sans text-[9px] tracking-[0.22em] uppercase text-charcoal/45">{d.brandSubline}</span>
              </div>

              {/* Locations */}
              {d.locations.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {d.locations.map((loc) => (
                    <address key={loc.name} className="not-italic text-sm text-charcoal/65">
                      <span className="font-medium text-charcoal block mb-1">{loc.name}</span>
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

              {/* Social — Instagram / Facebook icons (label text would look like LinkedIn "In") */}
              <div className="flex gap-2.5">
                {[
                  {
                    label: "Instagram",
                    href: d.instagramUrl,
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
                        <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.92A3.12 3.12 0 1 1 12 8.88a3.12 3.12 0 0 1 0 6.24Zm5.28-8.16a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0ZM12 2.4c-2.6 0-2.92.01-3.95.06-2.3.1-4.25 2.04-4.36 4.34C3.61 7.85 3.6 8.17 3.6 10.8s.01 2.95.09 3.98c.11 2.3 2.05 4.25 4.34 4.36 1.03.05 1.35.06 3.97.06s2.95-.01 3.98-.09c2.3-.11 4.24-2.05 4.35-4.34.05-1.04.06-1.36.06-3.97s-.01-2.95-.06-3.98C20.23 4.5 18.28 2.55 15.98 2.44 14.95 2.41 14.63 2.4 12 2.4Zm0 1.68c2.55 0 2.85.01 3.85.06 1.75.08 3.21 1.54 3.29 3.29.05 1 .06 1.3.06 3.85s-.01 2.85-.06 3.85c-.08 1.75-1.54 3.21-3.29 3.29-1 .05-1.3.06-3.85.06s-2.85-.01-3.85-.06c-1.75-.08-3.21-1.54-3.29-3.29-.05-1-.06-1.3-.06-3.85s.01-2.85.06-3.85c.08-1.75 1.54-3.21 3.29-3.29 1-.05 1.3-.06 3.85-.06Z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Facebook",
                    href: d.facebookUrl,
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
                        <path d="M13.5 22v-8.1h2.72l.41-3.16H13.5V8.72c0-.92.25-1.54 1.57-1.54h1.68V4.35c-.29-.04-1.29-.12-2.45-.12-2.42 0-4.08 1.48-4.08 4.19v2.34H7.7v3.16h2.52V22h3.28Z" />
                      </svg>
                    ),
                  },
                ]
                  .filter((s) => {
                    const h = (s.href ?? "").trim();
                    if (!h) return false;
                    return !/^https?:\/\/(www\.)?(instagram|facebook)\.com\/?$/i.test(h);
                  })
                  .map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 flex items-center justify-center text-charcoal/60 hover:text-periwinkle-dark hover:bg-white/80 transition-all duration-200 shadow-soft"
                    >
                      {s.icon}
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
              {(d.legalLinks ?? DEFAULT_FOOTER.legalLinks).map((link) => (
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
