import Link from "next/link";
import Image from "next/image";
import { BackgroundDecor } from "@/components/decor/BackgroundDecor";

const FOOTER_LINKS = {
  Navigation: [
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Massfertigung", href: "/massfertigung" },
    { label: "Kostümgalerie", href: "/galerie" },
    { label: "Stoffe & Materialien", href: "/stoffe" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  Service: [
    { label: "Beratung & Anfrage", href: "/termin" },
    { label: "Pflegehinweise", href: "/pflege" },
    { label: "FAQs", href: "/faqs" },
  ],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden mt-4">
      {/* Base shade layers — sit behind figure decor */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-offwhite via-offwhite-warm to-sand-light/40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-periwinkle-lighter/20 via-transparent to-sand-light/30" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-sand-light/15 to-offwhite-warm/50" />

        <div className="absolute -top-20 left-[10%] w-[420px] h-[280px] rounded-full bg-periwinkle-lighter/30 blur-[90px] animate-glow-drift" />
        <div className="absolute top-[25%] -right-12 w-[400px] h-[360px] rounded-full bg-sand-light/50 blur-[90px] animate-glow-drift [animation-delay:4s]" />
        <div className="absolute top-[45%] left-[40%] w-[480px] h-[300px] rounded-full bg-gold-lighter/30 blur-[100px]" />
        <div className="absolute bottom-0 left-[20%] w-[340px] h-[220px] rounded-full bg-sand-light/45 blur-[75px]" />
        <div className="absolute bottom-0 right-[15%] w-[280px] h-[180px] rounded-full bg-periwinkle-lighter/25 blur-[70px]" />
        <div className="absolute top-8 right-[20%] w-24 h-24 rounded-full bg-white/50 blur-2xl" />
        <div className="absolute bottom-24 left-[8%] w-20 h-20 rounded-full bg-gold-lighter/40 blur-xl" />
      </div>

      {/* Hero-style figure outlines — subtle, above shade */}
      <BackgroundDecor
        variant="footer"
        showConfetti={false}
        showStitchDashes
        showMesh
        className="z-[1]"
      />

      {/* Top gold dashed seam lines */}
      <div className="absolute top-5 left-[5%] right-[5%] z-[2] space-y-2.5 pointer-events-none" aria-hidden>
        <div className="line-gold-dashed" />
        <div className="line-gold-dashed-light" />
      </div>

      {/* Top fade-in from page content */}
      <div
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 container-site py-12 lg:py-16 flex flex-col gap-5">
        {/* ── CTA — glass panel ─────────────────────────────────────────────── */}
        <div className="glass-footer-panel p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-periwinkle-dark mb-2">
                Handwerk. Individualität. Zeitlosigkeit.
              </p>
              <p className="font-serif text-xl md:text-2xl text-charcoal leading-snug">
                Ihr Traumkostüm beginnt hier.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
              <Link href="/termin" className="btn-primary shadow-soft">
                Termin buchen
              </Link>
              <Link href="/kontakt" className="btn-secondary">
                Anfrage senden
              </Link>
            </div>
          </div>
        </div>

        {/* ── Main footer — glass panel ─────────────────────────────────────── */}
        <div className="glass-footer-panel p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Brand column — spans 2 on lg */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/70 ring-1 ring-gold-muted/20 flex items-center justify-center shadow-soft">
                  <Image
                    src="/icons/sewing/tailor-dummy-fashion-sewing-tailoring.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="icon-periwinkle-deep"
                  />
                </div>
                <div>
                  <span className="font-serif text-lg text-charcoal tracking-[0.1em] uppercase block leading-tight">
                    Kostüm<span className="text-periwinkle-dark">schneiderei</span>
                  </span>
                  <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-charcoal/45">
                    Basel
                  </span>
                </div>
              </div>

              <address className="not-italic flex flex-col gap-1.5 text-sm text-charcoal/65">
                <span>Greifengasse 20, 4052 Basel</span>
                <a href="tel:+41313124567" className="hover:text-periwinkle-dark transition-colors w-fit">
                  +41 31 312 45 67
                </a>
                <a
                  href="mailto:hallo@kostuemschneiderei-basel.ch"
                  className="hover:text-periwinkle-dark transition-colors w-fit"
                >
                  hallo@kostuemschneiderei-basel.ch
                </a>
                <span className="text-charcoal/50 text-[13px]">Mo–Fr: 08:30 – 17:30 Uhr</span>
              </address>

              <div className="flex gap-2.5">
                {[
                  {
                    label: "Instagram",
                    href: "https://instagram.com",
                    icon: (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Facebook",
                    href: "https://facebook.com",
                    icon: (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    ),
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 flex items-center justify-center text-charcoal/50 hover:text-periwinkle-dark hover:bg-white/80 transition-all duration-200 shadow-soft"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns — nested glass cards */}
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading} className="glass-footer-column">
                <h4 className="font-sans text-[10px] font-semibold tracking-[0.22em] uppercase text-charcoal/40 mb-4">
                  {heading}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[13px] text-charcoal/65 hover:text-periwinkle-dark font-medium transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar — subtle glass strip ───────────────────────────────── */}
        <div className="glass-footer-subtle px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-charcoal/50">
            <p>© {new Date().getFullYear()} Kostümschneiderei Basel. Alle Rechte vorbehalten.</p>
            <div className="flex gap-5">
              <Link href="/impressum" className="hover:text-charcoal transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="hover:text-charcoal transition-colors">
                Datenschutz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
