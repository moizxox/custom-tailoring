import { getPageSchema } from "@/lib/cms/page-schemas";
import { prisma } from "@/lib/db/prisma";
import { getAdminT, getSchemaTranslator } from "@/lib/i18n/admin";
import { localizePageSchema } from "@/lib/i18n/schema-labels";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { notFound } from "next/navigation";
import PageSectionEditor from "@/components/admin/PageSectionEditor";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const schema = getPageSchema(slug);
  const ts = getSchemaTranslator();
  const t = getAdminT("pages");
  const localized = schema ? localizePageSchema(ts, schema) : null;
  return { title: localized ? localized.label : t("editPageTitle") };
}

async function loadSectionContent(pageSlug: string): Promise<Record<string, unknown>> {
  try {
    const rows = await prisma.pageContent.findMany({ where: { pageSlug } });
    return Object.fromEntries(rows.map((r) => [r.sectionKey, r.content]));
  } catch {
    return {};
  }
}

export default async function PageEditorPage({ params }: Props) {
  const { slug } = await params;
  const schema = getPageSchema(slug);
  if (!schema) notFound();

  const savedContent = await loadSectionContent(slug);
  const t = getAdminT("pages");
  const ts = getSchemaTranslator();
  const localized = localizePageSchema(ts, schema);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/pages" className="text-sm text-gray-400 hover:text-gray-600">
          ← {t("backToPages")}
        </Link>
        <span className="text-gray-300">/</span>
        <div className="flex items-center gap-2">
          <span className="text-xl">{localized.icon}</span>
          <h1 className="text-xl font-bold text-gray-900">{localized.label}</h1>
        </div>
      </div>

      <div className="space-y-4">
        {localized.sections.map((section) => {
          const saved = (savedContent[section.key] as Record<string, unknown>) ?? {};
          const defaults = getDefaultSectionContent(slug, section.key);
          const initialContent = { ...defaults, ...saved };
          return (
            <PageSectionEditor
              key={section.key}
              pageSlug={slug}
              section={section}
              initialContent={initialContent}
            />
          );
        })}
      </div>
    </div>
  );
}
