import type { Metadata } from "next";

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
  return children;
}
