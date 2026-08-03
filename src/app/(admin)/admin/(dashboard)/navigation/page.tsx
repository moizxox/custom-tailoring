import { prisma } from "@/lib/db/prisma";
import { getNavItems, getFooterContent } from "@/lib/cms/navigation";
import { buildNavPageOptions } from "@/lib/cms/nav-page-options";
import NavEditorClient from "./NavEditorClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Navigation & Footer" };

export default async function NavigationPage() {
  const [navItems, footerContent, customPages] = await Promise.all([
    getNavItems(),
    getFooterContent(),
    prisma.customPage.findMany({
      select: { title: true, slug: true, published: true, navLabel: true },
      orderBy: { title: "asc" },
    }),
  ]);

  const pageOptions = buildNavPageOptions(customPages);

  return (
    <NavEditorClient
      initialNav={navItems}
      initialFooter={footerContent}
      pageOptions={pageOptions}
    />
  );
}
