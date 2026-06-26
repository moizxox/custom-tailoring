"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const AUTO_SELECTORS = [
  "[data-reveal]",
  ".reveal-item",
  ".reveal-header",
  ".card-gradient:not(:has(.grid .rounded-2xl))",
  ".glass-card",
  "article",
  "footer .glass-footer-panel",
  "footer .glass-footer-column",
  "footer .glass-footer-subtle",
  "main section .grid > *",
  "main .rounded-2xl.border",
  "main .rounded-3xl.border",
  "main .rounded-xl.border",
  "main section .container-site > div:has(.section-heading)",
  "main .flex.flex-col.gap-3 > *",
].join(", ");

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isInsideIgnored(el: Element) {
  return Boolean(el.closest("[data-reveal-ignore]"));
}

function hasRevealAncestor(el: HTMLElement) {
  const ancestor = el.parentElement?.closest("[data-reveal]");
  return Boolean(ancestor && ancestor !== el);
}

function applyStagger(el: HTMLElement, stepMs = 70) {
  const parent = el.parentElement;
  if (!parent) return;

  const siblings = Array.from(parent.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement &&
      (child.hasAttribute("data-reveal") || child.classList.contains("reveal-item")),
  );
  const index = siblings.indexOf(el);
  if (index >= 0) {
    el.style.setProperty("--reveal-delay", `${Math.min(index, 12) * stepMs}ms`);
  }
}

function parseRevealDelay(el: HTMLElement) {
  const raw = el.style.getPropertyValue("--reveal-delay").trim();
  if (!raw) return 0;
  return Number.parseInt(raw, 10) || 0;
}

function revealHeroContent() {
  document.querySelectorAll<HTMLElement>("[data-hero-enter] .reveal-item").forEach((el) => {
    if (!el.hasAttribute("data-reveal")) {
      el.setAttribute("data-reveal", "");
    }
    applyStagger(el, 60);
  });

  document.querySelectorAll<HTMLElement>("[data-hero-enter] [data-reveal]").forEach((el) => {
    if (el.classList.contains("is-revealed")) return;
    const delay = parseRevealDelay(el);
    window.setTimeout(() => {
      el.classList.add("is-revealed");
    }, 60 + delay);
  });
}

export function SiteReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const observed = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );

    function registerElements() {
      const nodes = document.querySelectorAll<HTMLElement>(AUTO_SELECTORS);

      nodes.forEach((el) => {
        if (isInsideIgnored(el) || hasRevealAncestor(el)) return;
        if (el.closest("[data-hero-enter]")) return;

        if (!el.hasAttribute("data-reveal")) {
          el.setAttribute("data-reveal", "");
        }

        applyStagger(el);

        if (observed.has(el)) return;
        observed.add(el);

        if (!el.classList.contains("is-revealed")) {
          observer.observe(el);
        }
      });

      revealHeroContent();
    }

    registerElements();

    let debounceId: ReturnType<typeof setTimeout> | undefined;
    const mutationObserver = new MutationObserver(() => {
      clearTimeout(debounceId);
      debounceId = setTimeout(registerElements, 80);
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(debounceId);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
