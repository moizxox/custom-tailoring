import Link from "next/link";

const FOOTER_LINKS = {
  Leistungen: [
    { label: "Massanfertigung", href: "/leistungen#massanfertigung" },
    { label: "Thema-Refresh", href: "/thema-refresh" },
    { label: "Kostüm-Veredelung", href: "/kostüm-veredelung" },
    { label: "Reparaturen", href: "/leistungen#reparaturen" },
    { label: "Beratung", href: "/leistungen#beratung" },
  ],
  Service: [
    { label: "Terminbuchung", href: "/termin" },
    { label: "Massblatt", href: "/massblatt" },
    { label: "Galerie", href: "/galerie" },
    { label: "Shop", href: "/shop" },
    { label: "FAQs", href: "/faqs" },
  ],
  Unternehmen: [
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Team", href: "/team" },
    { label: "Kontakt", href: "/kontakt" },
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-charcoal text-white/80">
      {/* CTA Band */}
      <div className="bg-lavender/10 border-t border-lavender/20">
        <div className="container-site py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="section-label text-lavender-light mb-2">
              Bereit für Ihr Projekt?
            </p>
            <h3 className="font-serif text-2xl text-white">
              Lassen Sie uns Grossartiges schaffen.
            </h3>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/kontakt"
              className="btn-primary bg-white text-lavender-dark hover:bg-cream"
            >
              Jetzt anfragen
            </Link>
            <Link
              href="/termin"
              className="btn-secondary border-white/30 text-white hover:border-white"
            >
              Termin buchen
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <p className="font-serif text-xl text-white tracking-[0.12em] uppercase">
                Kostüm<span className="text-lavender-light">schneiderei</span>
              </p>
              <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 mt-0.5">
                Basel
              </p>
            </div>
            <address className="not-italic flex flex-col gap-2 text-sm text-white/60">
              <span>Greifengasse 20</span>
              <span>4052 Basel, Schweiz</span>
              <a
                href="tel:+41313124567"
                className="hover:text-white transition-colors mt-1"
              >
                +41 31 312 45 67
              </a>
              <a
                href="mailto:hallo@kostuemschneiderei-basel.ch"
                className="hover:text-white transition-colors"
              >
                hallo@kostuemschneiderei-basel.ch
              </a>
            </address>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-lavender-light hover:text-lavender-light transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-lavender-light hover:text-lavender-light transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-5">
                {category}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>
            © {new Date().getFullYear()} Kostümschneiderei Basel. Alle Rechte
            vorbehalten.
          </p>
          <div className="flex gap-5">
            <Link href="/impressum" className="hover:text-white/60 transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-white/60 transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
