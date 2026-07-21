"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { AtelierLocation } from "@/lib/site-content";
import GlobalColorsEditor from "@/components/admin/GlobalColorsEditor";
import { Phone, Mail, MessageCircle, AtSign, Globe, MapPin, Palette } from "lucide-react";

type Tab = "contact" | "social" | "locations" | "colors";

function tabFromHash(): Tab {
  if (typeof window === "undefined") return "contact";
  const hash = window.location.hash.replace("#", "");
  if (hash === "colors" || hash === "social" || hash === "locations" || hash === "contact") {
    return hash;
  }
  return "contact";
}

interface Props {
  saved: Record<string, unknown>;
  defaultContact: {
    phone: string;
    email: string;
    whatsapp: string;
    instagram?: string;
    facebook?: string;
  };
  defaultLocations: AtelierLocation[];
}

export default function SettingsEditor({ saved, defaultContact, defaultLocations }: Props) {
  const t = useTranslations("settings");
  const te = useTranslations("editor");

  const [activeTab, setActiveTab] = useState<Tab>("contact");

  useEffect(() => {
    setActiveTab(tabFromHash());
    function onHash() {
      setActiveTab(tabFromHash());
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function selectTab(tab: Tab) {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${tab}`);
    }
  }

  const savedContact = (saved.contact as typeof defaultContact) ?? defaultContact;
  const savedSocial = (saved.social as { instagram?: string; facebook?: string }) ?? {};

  const [contact, setContact] = useState({
    phone: savedContact.phone ?? defaultContact.phone,
    email: savedContact.email ?? defaultContact.email,
    whatsapp: savedContact.whatsapp ?? defaultContact.whatsapp,
  });

  const [social, setSocial] = useState({
    instagram: savedSocial.instagram ?? defaultContact.instagram ?? "",
    facebook: savedSocial.facebook ?? defaultContact.facebook ?? "",
  });

  const [locations, setLocations] = useState(
    defaultLocations.map((loc) => {
      const saved_loc = (saved[`location_${loc.id}`] as typeof loc) ?? loc;
      return { ...loc, ...saved_loc };
    })
  );

  const [saving, setSaving] = useState(false);
  const [saved_ok, setSavedOk] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, unknown> = { contact, social };
      locations.forEach((loc) => { payload[`location_${loc.id}`] = loc; });

      const res = await fetch("/admin/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save failed");
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
    } catch {
      setError(t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  async function handleColorsSave(colors: Record<string, string>) {
    const res = await fetch("/admin/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ global_colors: colors }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "save failed");
    }
  }

  function updateLocation(idx: number, key: keyof AtelierLocation, value: string) {
    setLocations((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "contact", label: t("contactSection"), icon: <Phone className="w-3.5 h-3.5" /> },
    { key: "social", label: t("socialSection"), icon: <AtSign className="w-3.5 h-3.5" /> },
    { key: "locations", label: "Locations", icon: <MapPin className="w-3.5 h-3.5" /> },
    { key: "colors", label: "Global Colors", icon: <Palette className="w-3.5 h-3.5" /> },
  ];

  const savedColors = (saved.global_colors as Record<string, string>) ?? {};

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => selectTab(tab.key)}
            className={`flex items-center gap-2 flex-1 justify-center px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contact tab */}
      {activeTab === "contact" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{t("contactSection")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(["phone", "email", "whatsapp"] as const).map((key) => {
                const icons = { phone: <Phone className="w-3.5 h-3.5" />, email: <Mail className="w-3.5 h-3.5" />, whatsapp: <MessageCircle className="w-3.5 h-3.5" /> };
                const labels = { phone: t("phone"), email: t("email"), whatsapp: t("whatsapp") };
                return (
                  <div key={key}>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                      {icons[key]}
                      {labels[key]}
                    </label>
                    <input
                      type="text"
                      value={contact[key]}
                      onChange={(e) => setContact((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <SaveBar saving={saving} saved={saved_ok} error={error} onSave={handleSave} te={te} t={t} />
        </div>
      )}

      {/* Social tab */}
      {activeTab === "social" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{t("socialSection")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                  <AtSign className="w-3.5 h-3.5" />
                  {t("instagramUrl")}
                </label>
                <input
                  type="url"
                  value={social.instagram}
                  onChange={(e) => setSocial((prev) => ({ ...prev, instagram: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="https://instagram.com/…"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  {t("facebookUrl")}
                </label>
                <input
                  type="url"
                  value={social.facebook}
                  onChange={(e) => setSocial((prev) => ({ ...prev, facebook: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="https://facebook.com/…"
                />
              </div>
            </div>
          </div>
          <SaveBar saving={saving} saved={saved_ok} error={error} onSave={handleSave} te={te} t={t} />
        </div>
      )}

      {/* Locations tab */}
      {activeTab === "locations" && (
        <div className="space-y-4">
          {locations.map((loc, idx) => (
            <div key={loc.id} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <MapPin className="w-4 h-4 text-violet-500" />
                {t("locationSection", { name: loc.name })}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("name")}</label>
                  <input type="text" value={loc.name} onChange={(e) => updateLocation(idx, "name", e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("city")}</label>
                  <input type="text" value={loc.city} onChange={(e) => updateLocation(idx, "city", e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("address")}</label>
                  <input type="text" value={loc.address} onChange={(e) => updateLocation(idx, "address", e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("phone")}</label>
                  <input type="text" value={loc.phone ?? ""} onChange={(e) => updateLocation(idx, "phone", e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("mapsUrl")}</label>
                  <input type="url" value={loc.mapsUrl} onChange={(e) => updateLocation(idx, "mapsUrl", e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("mapsEmbed")}</label>
                  <input type="url" value={loc.mapsEmbed} onChange={(e) => updateLocation(idx, "mapsEmbed", e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                    placeholder="https://www.google.com/maps/embed?pb=…" />
                </div>
              </div>
            </div>
          ))}
          <SaveBar saving={saving} saved={saved_ok} error={error} onSave={handleSave} te={te} t={t} />
        </div>
      )}

      {/* Global Colors tab */}
      {activeTab === "colors" && (
        <GlobalColorsEditor
          savedColors={savedColors}
          onSave={handleColorsSave}
        />
      )}
    </div>
  );
}

interface SaveBarProps {
  saving: boolean;
  saved: boolean;
  error: string;
  onSave: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  te: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

function SaveBar({ saving, saved, error, onSave, te, t }: SaveBarProps) {
  return (
    <>
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
        >
          {saving ? te("saving") : t("saveSettings")}
        </button>
        {saved && (
          <span className="text-xs text-green-600 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {te("saved")}
          </span>
        )}
      </div>
    </>
  );
}
