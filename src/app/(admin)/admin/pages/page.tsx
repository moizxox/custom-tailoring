import Link from "next/link";
import { PAGE_SCHEMAS } from "@/lib/cms/page-schemas";
import { prisma } from "@/lib/db/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Seiten" };

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Seiten</h1>
        <p className="text-sm text-gray-500 mt-1">Wählen Sie eine Seite, um Inhalte zu bearbeiten.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Seite</th>
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Pfad</th>
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {PAGE_SCHEMAS.map((page) => (
              <tr key={page.slug} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{page.icon}</span>
                    <span className="font-medium text-gray-900">{page.label}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">{page.path}</td>
                <td className="px-5 py-3.5">
                  {editedSlugs.has(page.slug) ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Bearbeitet
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      Standard
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href={`/admin/pages/${page.slug}`}
                    className="text-xs font-medium text-periwinkle-600 hover:text-periwinkle-700"
                  >
                    Bearbeiten →
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
