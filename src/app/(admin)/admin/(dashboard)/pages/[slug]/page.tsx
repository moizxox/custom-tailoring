import { getPageSchema } from "@/lib/cms/page-schemas";
import { prisma } from "@/lib/db/prisma";
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
  return { title: schema ? `${schema.label} bearbeiten` : "Seite bearbeiten" };
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/pages" className="text-sm text-gray-400 hover:text-gray-600">
          ← Seiten
        </Link>
        <span className="text-gray-300">/</span>
        <div className="flex items-center gap-2">
          <span className="text-xl">{schema.icon}</span>
          <h1 className="text-xl font-bold text-gray-900">{schema.label}</h1>
        </div>
      </div>

      <div className="space-y-4">
        {schema.sections.map((section) => (
          <PageSectionEditor
            key={section.key}
            pageSlug={slug}
            section={section}
            initialContent={(savedContent[section.key] as Record<string, unknown>) ?? {}}
          />
        ))}
      </div>
    </div>
  );
}
