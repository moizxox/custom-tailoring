import { getNavItems, getFooterContent } from "@/lib/cms/navigation";
import NavEditorClient from "./NavEditorClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Navigation & Footer" };

export default async function NavigationPage() {
  const [navItems, footerContent] = await Promise.all([getNavItems(), getFooterContent()]);

  return <NavEditorClient initialNav={navItems} initialFooter={footerContent} />;
}
