import type { Metadata } from "next";
import Link from "next/link";
import { listContactSubmissions, safePage } from "@/lib/crm/contact-submissions";
import { Inbox } from "lucide-react";

export const metadata: Metadata = { title: "Anfragen — CRM" };

interface Props {
  searchParams: Promise<{ unread?: string; page?: string }>;
}

const LOCATION_LABELS: Record<string, string> = {
  pratteln: "Atelier Pratteln",
  therwil: "Atelier Therwil",
  unsicher: "Noch unentschlossen",
};

export default async function ContactSubmissionsPage({ searchParams }: Props) {
  const { unread, page } = await searchParams;
  const unreadOnly = unread === "true";
  const currentPage = safePage(page, 1);
  const take = 25;
  const skip = (currentPage - 1) * take;

  const { submissions, total, unreadCount } = await listContactSubmissions({
    unreadOnly,
    skip,
    take,
  });
  const totalPages = Math.max(1, Math.ceil(total / take));

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Kontaktanfragen</h1>
          <p className="text-sm text-gray-400 mt-1">
            {unreadCount} ungelesen · {total} gesamt
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/crm/submissions"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !unreadOnly ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Alle
          </Link>
          <Link
            href="/admin/crm/submissions?unread=true"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              unreadOnly ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Ungelesen ({unreadCount})
          </Link>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-12 text-center">
          <Inbox className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Keine Anfragen gefunden</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden md:table-cell">E-Mail</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden lg:table-cell">Standort</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Datum</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr
                  key={s.id}
                  className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${!s.read ? "bg-blue-50/30" : ""}`}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/crm/submissions/${s.id}`}
                      className="font-medium text-gray-900 hover:text-violet-600 transition-colors"
                    >
                      {s.name}
                    </Link>
                    <p className="text-xs text-gray-500 truncate max-w-[200px] mt-0.5">
                      {s.message.slice(0, 60)}
                      {s.message.length > 60 ? "…" : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{s.email}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                    {s.location ? (LOCATION_LABELS[s.location] ?? s.location) : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(s.createdAt).toLocaleDateString("de-CH")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.convertedCustomerId ? (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Konvertiert</span>
                    ) : !s.read ? (
                      <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Neu</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Gelesen</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/crm/submissions?page=${p}${unreadOnly ? "&unread=true" : ""}`}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${
                p === currentPage ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
