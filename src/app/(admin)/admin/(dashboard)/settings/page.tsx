import { prisma } from "@/lib/db/prisma";
import SettingsEditor from "@/components/admin/SettingsEditor";
import { SITE_CONTACT, ATELIER_LOCATIONS } from "@/lib/site-content";
import { getAdminT } from "@/lib/i18n/admin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

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
  const t = getAdminT("settings");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
      </div>
      <SettingsEditor saved={saved} defaultContact={SITE_CONTACT} defaultLocations={ATELIER_LOCATIONS} />
    </div>
  );
}
