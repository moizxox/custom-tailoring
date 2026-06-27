"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ConsentChoice = "all" | "essential" | null;

const STORAGE_KEY = "ks-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [functional, setFunctional] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);

    const open = () => setVisible(true);
    window.addEventListener("ks-open-cookies", open);
    return () => window.removeEventListener("ks-open-cookies", open);
  }, []);

  const save = (choice: ConsentChoice) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ choice, functional, analytics, marketing, at: Date.now() }),
    );
    setVisible(false);
    setShowSettings(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6 pointer-events-none">
      <div
        className={cn(
          "pointer-events-auto mx-auto max-w-4xl rounded-3xl border border-periwinkle-light/50",
          "bg-white/95 backdrop-blur-md shadow-card p-6 sm:p-8",
        )}
        role="dialog"
        aria-label="Cookie-Einstellungen"
      >
        {!showSettings ? (
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="flex-1">
              <h2 className="font-serif text-xl text-charcoal mb-2">Privatsphäre-Einstellungen</h2>
              <p className="font-sans text-sm text-charcoal-light leading-relaxed">
                Wir verwenden Cookies und ähnliche Technologien, um unsere Website bereitzustellen und zu verbessern.
                Essenzielle Cookies sind für den Betrieb erforderlich. Weitere Informationen finden Sie in unserer{" "}
                <Link href="/datenschutz" className="text-periwinkle-dark hover:underline">
                  Datenschutzerklärung
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button type="button" onClick={() => setShowSettings(true)} className="btn-outline-dark justify-center">
                Einstellungen
              </button>
              <button type="button" onClick={() => save("essential")} className="btn-secondary justify-center">
                Ablehnen
              </button>
              <button type="button" onClick={() => save("all")} className="btn-primary justify-center">
                Alles akzeptieren
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-4">Cookie-Einstellungen</h2>
            <ul className="flex flex-col gap-3 mb-6">
              <li className="flex items-center justify-between gap-4 rounded-xl border border-stone-light px-4 py-3">
                <div>
                  <p className="font-sans text-sm font-medium text-charcoal">Essenziell</p>
                  <p className="font-sans text-xs text-charcoal-lighter">Immer aktiv — für Grundfunktionen der Website</p>
                </div>
                <span className="text-xs font-sans text-periwinkle-dark font-semibold">An</span>
              </li>
              {[
                { label: "Funktionell", state: functional, set: setFunctional },
                { label: "Analytisch", state: analytics, set: setAnalytics },
                { label: "Marketing", state: marketing, set: setMarketing },
              ].map(({ label, state, set }) => (
                <li key={label} className="flex items-center justify-between gap-4 rounded-xl border border-stone-light px-4 py-3">
                  <p className="font-sans text-sm font-medium text-charcoal">{label}</p>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={state}
                    onClick={() => set(!state)}
                    className={cn(
                      "relative w-11 h-6 rounded-full transition-colors",
                      state ? "bg-periwinkle-dark" : "bg-stone-light",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                        state && "translate-x-5",
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => save("essential")} className="btn-secondary">
                Nur essenziell
              </button>
              <button type="button" onClick={() => save("all")} className="btn-primary">
                Einstellungen speichern
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Re-open cookie settings from footer link */
export function openCookieSettings() {
  localStorage.removeItem("ks-cookie-consent");
  window.dispatchEvent(new Event("ks-open-cookies"));
}
