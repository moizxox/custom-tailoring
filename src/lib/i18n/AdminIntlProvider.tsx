"use client";

import { NextIntlClientProvider } from "next-intl";
import { getAdminLocale, getAdminMessages, ADMIN_TIME_ZONE } from "@/lib/i18n/admin";

export default function AdminIntlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getAdminLocale();

  return (
    <NextIntlClientProvider locale={locale} messages={getAdminMessages(locale)} timeZone={ADMIN_TIME_ZONE}>
      {children}
    </NextIntlClientProvider>
  );
}
