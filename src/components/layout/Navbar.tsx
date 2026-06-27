"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/site-content";
import { SiteSearch } from "@/components/layout/SiteSearch";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 site-nav-enter",
        "bg-offwhite-pure/40 backdrop-blur-md border-b",
        scrolled ? "bg-offwhite-pure/40 backdrop-blur-sm shadow-soft border-gold-muted/40" : "border-gold-muted/20",
      )}
    >
      <div className="container-site">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-[1.1] group shrink-0">
            <span className="font-serif text-[15px] tracking-[0.18em] uppercase text-charcoal">Kostüm</span>
            <span className="font-serif text-[15px] tracking-[0.18em] uppercase text-periwinkle-dark">Schneiderei</span>
            <span className="font-sans text-[7px] tracking-[0.22em] uppercase text-warmgrey mt-0.5">Pratteln & Therwil</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-7 bg-periwinkle-lighter/60 border border-periwinkle-light/40 rounded-full px-7 py-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="nav-link text-[13px]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA + Search + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <SiteSearch className="hidden md:block" variant="bar" />
            <SiteSearch className="md:hidden" variant="compact" onNavigate={() => setMobileOpen(false)} />

            <Link
              href="/termin"
              className={cn(
                "hidden sm:inline-flex items-center gap-2",
                "bg-periwinkle hover:bg-periwinkle-dark text-charcoal hover:text-white",
                "text-[13px] font-sans font-medium px-4 py-2 rounded-full",
                "transition-all duration-200 shadow-soft hover:shadow-periwinkle",
              )}
            >
              Beratung buchen
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 -mr-1 rounded-lg hover:bg-sand-light transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü öffnen"
              aria-expanded={mobileOpen}
            >
              <span className="sr-only">Menü</span>
              <div className="w-[22px] flex flex-col gap-[5px]">
                <span className={cn("block h-[1.5px] bg-charcoal rounded transition-all duration-300 origin-center", mobileOpen ? "rotate-45 translate-y-[6.5px]" : "")} />
                <span className={cn("block h-[1.5px] bg-charcoal rounded transition-all duration-300", mobileOpen ? "opacity-0 scale-x-0" : "")} />
                <span className={cn("block h-[1.5px] bg-charcoal rounded transition-all duration-300 origin-center", mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : "")} />
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          "bg-offwhite-pure/98 backdrop-blur-sm border-t border-stone-light",
          mobileOpen ? "max-h-[500px] py-2" : "max-h-0",
        )}
      >
        <div className="container-site flex flex-col pb-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="py-3.5 text-sm font-sans text-charcoal-light hover:text-charcoal border-b border-stone-light/60 last:border-0 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/termin" onClick={() => setMobileOpen(false)} className="mt-4 btn-primary justify-center">
            Beratung buchen
          </Link>
        </div>
      </div>
    </header>
  );
}
