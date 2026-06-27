"use client";

import { useEffect, useState } from "react";

export function CookieSettingsButton() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("ks-open-cookies", handler);
    return () => window.removeEventListener("ks-open-cookies", handler);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        localStorage.removeItem("ks-cookie-consent");
        window.dispatchEvent(new Event("ks-open-cookies"));
      }}
      className="hover:text-charcoal transition-colors text-left"
    >
      Cookie-Einstellungen
    </button>
  );
}
