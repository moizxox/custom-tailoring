import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { normalizeCustomPageContent } from "@/lib/cms/custom-pages";
import CustomPageEditorClient from "./CustomPageEditorClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Eigene Seite" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CustomPageAdminPage({ params }: Props) {
  const { id } = await params;
  const page = await prisma.customPage.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <CustomPageEditorClient
      initial={{
        id: page.id,
        slug: page.slug,
        title: page.title,
        navLabel: page.navLabel,
        published: page.published,
        content: normalizeCustomPageContent(page.content),
      }}
    />
  );
}
