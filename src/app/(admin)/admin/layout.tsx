import type { Metadata } from "next";
import AdminIntlProvider from "@/lib/i18n/AdminIntlProvider";

export const metadata: Metadata = {
  title: {
    default: "CMS Admin",
    template: "%s · CMS",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminIntlProvider>{children}</AdminIntlProvider>;
}
