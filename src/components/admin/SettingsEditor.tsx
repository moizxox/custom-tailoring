"use client";

import { useState } from "react";
import type { AtelierLocation } from "@/lib/site-content";

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
      if (!res.ok) throw new Error("Speichern fehlgeschlagen");
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
    } catch {
      setError("Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  }

  function updateLocation(idx: number, key: keyof AtelierLocation, value: string) {
    setLocations((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {/* Contact */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Kontaktdaten</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(["phone", "email", "whatsapp"] as const).map((key) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 capitalize">{key === "phone" ? "Telefon" : key === "email" ? "E-Mail" : "WhatsApp"}</label>
              <input
                type="text"
                value={contact[key]}
                onChange={(e) => setContact((prev) => ({ ...prev, [key]: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Social */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Social Media</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Instagram-URL</label>
            <input
              type="url"
              value={social.instagram}
              onChange={(e) => setSocial((prev) => ({ ...prev, instagram: e.target.value }))}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
              placeholder="https://instagram.com/…"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Facebook-URL</label>
            <input
              type="url"
              value={social.facebook}
              onChange={(e) => setSocial((prev) => ({ ...prev, facebook: e.target.value }))}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
              placeholder="https://facebook.com/…"
            />
          </div>
        </div>
      </div>

      {/* Locations */}
      {locations.map((loc, idx) => (
        <div key={loc.id} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Standort: {loc.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Name</label>
              <input type="text" value={loc.name} onChange={(e) => updateLocation(idx, "name", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Stadt</label>
              <input type="text" value={loc.city} onChange={(e) => updateLocation(idx, "city", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Adresse</label>
              <input type="text" value={loc.address} onChange={(e) => updateLocation(idx, "address", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Telefon</label>
              <input type="text" value={loc.phone ?? ""} onChange={(e) => updateLocation(idx, "phone", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Google Maps URL</label>
              <input type="url" value={loc.mapsUrl} onChange={(e) => updateLocation(idx, "mapsUrl", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Google Maps Embed-URL</label>
              <input type="url" value={loc.mapsEmbed} onChange={(e) => updateLocation(idx, "mapsEmbed", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
                placeholder="https://www.google.com/maps/embed?pb=…" />
            </div>
          </div>
        </div>
      ))}

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-periwinkle-600 hover:bg-periwinkle-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
        >
          {saving ? "Speichern…" : "Einstellungen speichern"}
        </button>
        {saved_ok && (
          <span className="text-xs text-green-600 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Gespeichert
          </span>
        )}
      </div>
    </div>
  );
}
