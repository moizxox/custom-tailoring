"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Leistungen", href: "/leistungen" },
  { label: "Shop", href: "/shop" },
  { label: "Thema-Refresh", href: "/thema-refresh" },
  { label: "Galerie", href: "/galerie" },
  { label: "Massblatt", href: "/massblatt" },
  { label: "Team", href: "/team" },
  { label: "Kontakt", href: "/kontakt" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-soft border-b border-cream-deep"
          : "bg-transparent"
      )}
    >
      <div className="container-site">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span
              className={cn(
                "font-serif text-lg tracking-[0.15em] uppercase transition-colors duration-200",
                scrolled ? "text-charcoal" : "text-charcoal"
              )}
            >
              Kostüm
            </span>
            <span
              className={cn(
                "font-serif text-lg tracking-[0.15em] uppercase transition-colors duration-200 text-lavender"
              )}
            >
              Schneiderei
            </span>
            <span
              className={cn(
                "font-sans text-[9px] tracking-[0.3em] uppercase mt-0.5 transition-colors duration-200",
                scrolled ? "text-charcoal/40" : "text-charcoal/50"
              )}
            >
              Basel
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="nav-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Button
              as="a"
              href="/kontakt"
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex"
              icon={
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            >
              Anfrage senden
            </Button>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-cream-warm transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü öffnen"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span
                  className={cn(
                    "block h-0.5 bg-charcoal transition-all duration-300",
                    mobileOpen ? "rotate-45 translate-y-2" : ""
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 bg-charcoal transition-all duration-300",
                    mobileOpen ? "opacity-0" : ""
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 bg-charcoal transition-all duration-300",
                    mobileOpen ? "-rotate-45 -translate-y-2" : ""
                  )}
                />
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 bg-white/95 backdrop-blur-md border-t border-cream-deep",
          mobileOpen ? "max-h-screen py-4" : "max-h-0"
        )}
      >
        <div className="container-site flex flex-col gap-1 pb-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-3 px-2 text-sm font-sans text-charcoal hover:text-lavender transition-colors border-b border-cream-deep last:border-0"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button
            as="a"
            href="/kontakt"
            variant="primary"
            size="md"
            className="mt-3 w-full justify-center"
          >
            Anfrage senden
          </Button>
        </div>
      </div>
    </header>
  );
}
