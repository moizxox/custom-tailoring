import { createTranslator } from "next-intl";
import en from "@/messages/admin/en.json";
import de from "@/messages/admin/de.json";
import type { SchemaTranslator } from "@/lib/i18n/schema-labels";

export const ADMIN_LOCALES = ["en", "de"] as const;
export type AdminLocale = (typeof ADMIN_LOCALES)[number];

/** Production/GitHub default: German. Set NEXT_PUBLIC_ADMIN_LOCALE=en in .env.local for English. */
export function getAdminLocale(): AdminLocale {
  const raw = process.env.NEXT_PUBLIC_ADMIN_LOCALE?.trim().toLowerCase();
  if (raw === "en" || raw === "de") return raw;
  return "de";
}

const MESSAGES = { en, de } as const;

export type AdminMessages = typeof en;

export function getAdminMessages(locale: AdminLocale = getAdminLocale()): AdminMessages {
  return MESSAGES[locale];
}

export function getAdminT(namespace?: keyof AdminMessages, locale?: AdminLocale) {
  const resolvedLocale = locale ?? getAdminLocale();
  return createTranslator({
    locale: resolvedLocale,
    messages: getAdminMessages(resolvedLocale),
    namespace,
  });
}

export function getSchemaTranslator(locale?: AdminLocale): SchemaTranslator {
  return getAdminT("schemas", locale) as unknown as SchemaTranslator;
}
