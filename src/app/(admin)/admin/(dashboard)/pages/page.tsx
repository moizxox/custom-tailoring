import Link from "next/link";
import { PAGE_SCHEMAS } from "@/lib/cms/page-schemas";
import { prisma } from "@/lib/db/prisma";
import { getAdminT, getSchemaTranslator } from "@/lib/i18n/admin";
import { localizePageSchema } from "@/lib/i18n/schema-labels";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pages" };

async function getEditedSlugs(): Promise<Set<string>> {
  try {
    const rows = await prisma.pageContent.groupBy({ by: ["pageSlug"] });
    return new Set(rows.map((r) => r.pageSlug));
  } catch {
    return new Set();
  }
}

export default async function PagesListPage() {
  const editedSlugs = await getEditedSlugs();
  const t = getAdminT("pages");
  const ts = getSchemaTranslator();
  const pages = PAGE_SCHEMAS.map((page) => localizePageSchema(ts, page));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">{t("columnPage")}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">{t("columnPath")}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">{t("columnStatus")}</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pages.map((page) => (
              <tr key={page.slug} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <span className="font-medium text-gray-900">{page.label}</span>
                </td>
                <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">{page.path}</td>
                <td className="px-5 py-3.5">
                  {editedSlugs.has(page.slug) ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {t("statusEdited")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {t("statusDefault")}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href={`/admin/pages/${page.slug}`}
                    className="text-xs font-medium text-periwinkle-600 hover:text-periwinkle-700"
                  >
                    {t("edit")} →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
