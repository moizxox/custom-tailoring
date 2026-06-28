import { prisma } from "@/lib/db/prisma";
import SettingsEditor from "@/components/admin/SettingsEditor";
import { SITE_CONTACT, ATELIER_LOCATIONS } from "@/lib/site-content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Einstellungen" };

async function loadSettings() {
  try {
    const rows = await prisma.siteSettings.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

export default async function SettingsPage() {
  const saved = await loadSettings();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Einstellungen</h1>
        <p className="text-sm text-gray-500 mt-1">Kontaktdaten, Standorte und Social-Media-Links verwalten.</p>
      </div>
      <SettingsEditor saved={saved} defaultContact={SITE_CONTACT} defaultLocations={ATELIER_LOCATIONS} />
    </div>
  );
}
