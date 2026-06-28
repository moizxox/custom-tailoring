import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login · CMS",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
