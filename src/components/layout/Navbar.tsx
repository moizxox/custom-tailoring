"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SiteSearch } from "@/components/layout/SiteSearch";
import type { NavItem } from "@/lib/cms/navigation";

interface NavbarProps {
  navItems: NavItem[];
  ctaLabel?: string;
  ctaUrl?: string;
  brandName?: string;
  brandAccent?: string;
  brandSubline?: string;
}

function DesktopNavItem({ link }: { link: NavItem }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasChildren = (link.children?.length ?? 0) > 0;

  function clearClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function scheduleClose() {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  if (!hasChildren) {
    return (
      <li className="whitespace-nowrap">
        <Link
          href={link.href}
          className="nav-link text-[13px] whitespace-nowrap"
          target={link.openInNewTab ? "_blank" : undefined}
          rel={link.openInNewTab ? "noopener noreferrer" : undefined}
        >
          {link.label}
        </Link>
      </li>
    );
  }

  return (
    <li
      className="relative whitespace-nowrap"
      onMouseEnter={() => {
        clearClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="nav-link text-[13px] whitespace-nowrap inline-flex items-center gap-1"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {link.label}
        <svg className={cn("w-3 h-3 transition-transform", open && "rotate-180")} viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-150",
          open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1 pointer-events-none",
        )}
      >
        <ul className="min-w-[200px] rounded-2xl bg-white border border-periwinkle-light/40 shadow-soft py-2">
          {link.href && link.href !== "#" && (
            <li>
              <Link
                href={link.href}
                className="block px-4 py-2.5 text-[13px] font-sans text-charcoal-light hover:text-charcoal hover:bg-periwinkle-lighter/50 transition-colors"
                target={link.openInNewTab ? "_blank" : undefined}
                rel={link.openInNewTab ? "noopener noreferrer" : undefined}
              >
                {link.label}
              </Link>
            </li>
          )}
          {link.children!.map((child) => (
            <li key={child.id}>
              <Link
                href={child.href}
                className="block px-4 py-2.5 text-[13px] font-sans text-charcoal-light hover:text-charcoal hover:bg-periwinkle-lighter/50 transition-colors"
                target={child.openInNewTab ? "_blank" : undefined}
                rel={child.openInNewTab ? "noopener noreferrer" : undefined}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function Navbar({
  navItems,
  ctaLabel = "Termin buchen",
  ctaUrl = "/termin",
  brandName = "Kostüm",
  brandAccent = "Schneiderei",
  brandSubline = "Pratteln & Therwil",
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 site-nav-enter",
        "bg-offwhite-pure/40 backdrop-blur-md",
        scrolled ? "bg-offwhite-pure/40 backdrop-blur-sm shadow-soft" : "",
      )}
    >
      <div className="container-site">
        <nav className="flex items-center gap-4 justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-[1.1] group shrink-0">
            <span className="font-serif text-[15px] tracking-[0.18em] uppercase text-charcoal">
              {brandName}
            </span>
            <span className="font-serif text-[15px] tracking-[0.18em] uppercase text-periwinkle-dark">
              {brandAccent}
            </span>
            <span className="font-sans text-[7px] tracking-[0.22em] uppercase text-warmgrey mt-0.5">
              {brandSubline}
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden xl:flex items-center gap-5 bg-periwinkle-lighter/60 border border-periwinkle-light/40 rounded-full px-6 py-2.5">
            {navItems.map((link) => (
              <DesktopNavItem key={link.id} link={link} />
            ))}
          </ul>

          {/* Desktop CTA + Search + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <SiteSearch className="hidden md:block" variant="bar" />
            <SiteSearch
              className="md:hidden"
              variant="compact"
              onNavigate={() => setMobileOpen(false)}
            />

            <Link
              href="/kundenbereich/login"
              className={cn(
                "hidden lg:inline-flex items-center",
                "text-[12px] font-sans font-medium text-charcoal/70 hover:text-periwinkle-dark",
                "px-2 py-1.5 transition-colors",
              )}
            >
              Kundenbereich
            </Link>

            <Link
              href={ctaUrl}
              className={cn(
                "hidden sm:inline-flex items-center gap-2",
                "bg-periwinkle hover:bg-periwinkle-dark text-charcoal hover:text-white",
                "text-[13px] font-sans font-medium px-4 py-2 rounded-full",
                "transition-all duration-200 shadow-soft hover:shadow-periwinkle",
              )}
            >
              {ctaLabel}
            </Link>

            {/* Hamburger */}
            <button
              className="xl:hidden p-2 -mr-1 rounded-lg hover:bg-sand-light transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü öffnen"
              aria-expanded={mobileOpen}
            >
              <span className="sr-only">Menü</span>
              <div className="w-[22px] flex flex-col gap-[5px]">
                <span
                  className={cn(
                    "block h-[1.5px] bg-charcoal rounded transition-all duration-300 origin-center",
                    mobileOpen ? "rotate-45 translate-y-[6.5px]" : "",
                  )}
                />
                <span
                  className={cn(
                    "block h-[1.5px] bg-charcoal rounded transition-all duration-300",
                    mobileOpen ? "opacity-0 scale-x-0" : "",
                  )}
                />
                <span
                  className={cn(
                    "block h-[1.5px] bg-charcoal rounded transition-all duration-300 origin-center",
                    mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : "",
                  )}
                />
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "xl:hidden overflow-hidden transition-all duration-300",
          "bg-offwhite-pure/98 backdrop-blur-sm border-t border-stone-light",
          mobileOpen ? "max-h-[70vh] overflow-y-auto py-2" : "max-h-0",
        )}
      >
        <div className="container-site flex flex-col pb-5">
          {navItems.map((link) => {
            const hasChildren = (link.children?.length ?? 0) > 0;
            if (!hasChildren) {
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  target={link.openInNewTab ? "_blank" : undefined}
                  rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                  className="py-3.5 text-sm font-sans text-charcoal-light hover:text-charcoal border-b border-stone-light/60 last:border-0 transition-colors"
                >
                  {link.label}
                </Link>
              );
            }
            const expanded = mobileExpanded === link.id;
            return (
              <div key={link.id} className="border-b border-stone-light/60">
                <button
                  type="button"
                  onClick={() => setMobileExpanded(expanded ? null : link.id)}
                  className="w-full flex items-center justify-between py-3.5 text-sm font-sans text-charcoal-light hover:text-charcoal transition-colors"
                >
                  {link.label}
                  <svg className={cn("w-3.5 h-3.5 transition-transform", expanded && "rotate-180")} viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {expanded && (
                  <div className="pb-2 pl-3 flex flex-col">
                    {link.href && link.href !== "#" && (
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="py-2.5 text-sm font-sans text-charcoal-light hover:text-charcoal"
                      >
                        {link.label}
                      </Link>
                    )}
                    {link.children!.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        target={child.openInNewTab ? "_blank" : undefined}
                        rel={child.openInNewTab ? "noopener noreferrer" : undefined}
                        className="py-2.5 text-sm font-sans text-charcoal-light hover:text-charcoal"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href="/kundenbereich/login"
            onClick={() => setMobileOpen(false)}
            className="py-3.5 text-sm font-sans text-charcoal-light hover:text-charcoal border-b border-stone-light/60 transition-colors"
          >
            Kundenbereich
          </Link>
          <Link
            href={ctaUrl}
            onClick={() => setMobileOpen(false)}
            className="mt-4 btn-primary justify-center"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
