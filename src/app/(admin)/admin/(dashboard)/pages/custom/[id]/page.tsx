import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { normalizeCustomPageContent } from "@/lib/cms/custom-pages";
import { buildCustomPageSchema } from "@/lib/cms/page-schemas";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import {
  getPageSectionOrder,
  getPageHiddenSections,
  sortSectionsByOrder,
} from "@/lib/cms/section-order";
import CustomPageEditorClient from "./CustomPageEditorClient";
import PageEditorClient from "../../[slug]/PageEditorClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Eigene Seite" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CustomPageAdminPage({ params }: Props) {
  const { id } = await params;
  const page = await prisma.customPage.findUnique({ where: { id } });
  if (!page) notFound();

  const schema = buildCustomPageSchema(page.slug, page.title);
  const savedRows = await prisma.pageContent.findMany({ where: { pageSlug: page.slug } });
  const savedContent = Object.fromEntries(savedRows.map((r) => [r.sectionKey, r.content]));
  const [sectionOrder, hiddenSections] = await Promise.all([
    getPageSectionOrder(page.slug),
    getPageHiddenSections(page.slug),
  ]);
  const orderedSections = sortSectionsByOrder(schema.sections, sectionOrder);

  const initialContents: Record<string, Record<string, unknown>> = {};
  for (const section of orderedSections) {
    const saved = (savedContent[section.key] as Record<string, unknown>) ?? {};
    const defaults = getDefaultSectionContent(page.slug, section.key);
    initialContents[section.key] = { ...defaults, ...saved };
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
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

      <div className="border-t border-gray-200 pt-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Flex-Bausteine</h2>
          <p className="text-sm text-gray-500 mt-1">
            Dieselben Abschnitte wie auf allen Seiten — mit dem Auge einblenden, mit Pfeilen
            sortieren, Inhalt füllen und Reihenfolge speichern.
          </p>
        </div>
        <PageEditorClient
          pageSlug={page.slug}
          sections={orderedSections}
          initialContents={initialContents}
          pageLabel={page.title}
          initialSectionOrder={sectionOrder}
          initialHiddenSections={hiddenSections}
        />
      </div>
    </div>
  );
}
