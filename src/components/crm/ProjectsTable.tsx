"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderKanban } from "lucide-react";
import { formatMoney } from "@/lib/crm/projects";

interface ProjectRow {
  id: string;
  projectNumber: string | null;
  title: string;
  season: string | null;
  customerStatus: string;
  internalStatus: string;
  priority: string;
  deadline: string | null;
  totalAmount: number | null;
  paidAmount: number | null;
  paymentStatus: string;
  archived: boolean;
  updatedAt: string;
  customer: { id: string; name: string; email: string } | null;
  group: { id: string; name: string } | null;
  _count: { tasks: number; files: number; measurements: number };
}

interface Filters {
  q: string;
  customerStatus: string;
  internalStatus: string;
  priority: string;
  season: string;
  archived: boolean;
}

interface Props {
  projects: ProjectRow[];
  total: number;
  currentPage: number;
  totalPages: number;
  seasons: string[];
  customerStatuses: Array<{ value: string; label: string }>;
  internalStatuses: Array<{ value: string; label: string }>;
  priorities: Array<{ value: string; label: string }>;
  initialFilters: Filters;
}

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-gray-500/10 text-gray-400",
  normal: "bg-blue-500/10 text-blue-400",
  high: "bg-amber-500/10 text-amber-400",
  urgent: "bg-red-500/10 text-red-400",
};

const SELECT_CLASS =
  "px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-violet-500 transition-colors";

export function ProjectsTable({
  projects,
  total,
  currentPage,
  totalPages,
  seasons,
  customerStatuses,
  internalStatuses,
  priorities,
  initialFilters,
}: Props) {
  const router = useRouter();
  const [f, setF] = useState(initialFilters);

  function applyFilters(updated: Filters) {
    const params = new URLSearchParams();
    if (updated.q) params.set("q", updated.q);
    if (updated.customerStatus) params.set("customerStatus", updated.customerStatus);
    if (updated.internalStatus) params.set("internalStatus", updated.internalStatus);
    if (updated.priority) params.set("priority", updated.priority);
    if (updated.season) params.set("season", updated.season);
    if (updated.archived) params.set("archived", "1");
    router.push(`/admin/crm/projects?${params.toString()}`);
  }

  function handleChange(key: keyof Filters, value: string | boolean) {
    const updated = { ...f, [key]: value };
    setF(updated);
    if (key !== "q") applyFilters(updated);
  }

  const csLabel = (v: string) => customerStatuses.find((s) => s.value === v)?.label ?? v;
  const isLabel = (v: string) => internalStatuses.find((s) => s.value === v)?.label ?? v;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          type="search"
          placeholder="Nr., Auftrag oder Kunde suchen…"
          value={f.q}
          onChange={(e) => handleChange("q", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters(f)}
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 transition-colors"
        />
        {seasons.length > 0 && (
          <select
            value={f.season}
            onChange={(e) => handleChange("season", e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="">Alle Saisons</option>
            {seasons.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
        <select
          value={f.customerStatus}
          onChange={(e) => handleChange("customerStatus", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="">Alle Kundenstatus</option>
          {customerStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select
          value={f.internalStatus}
          onChange={(e) => handleChange("internalStatus", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="">Alle Intern-Status</option>
          {internalStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select
          value={f.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="">Alle Prioritäten</option>
          {priorities.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600 px-3 py-2.5 rounded-xl bg-white border border-gray-200 cursor-pointer">
          <input
            type="checkbox"
            checked={f.archived}
            onChange={(e) => handleChange("archived", e.target.checked)}
            className="rounded border-gray-300"
          />
          Archivierte anzeigen
        </label>
        <button
          onClick={() => applyFilters(f)}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
        >
          Suchen
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-12 text-center">
          <FolderKanban className="w-8 h-8 text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Keine Aufträge gefunden</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden sm:table-cell">NR</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Auftrag</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden xl:table-cell">Saison</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden lg:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden md:table-cell">Priorität</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden lg:table-cell">Abholung</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden md:table-cell">Zahlung</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="font-mono text-xs text-violet-700">{p.projectNumber ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/crm/projects/${p.id}`} className="font-medium text-gray-900 hover:text-violet-600 transition-colors block">
                      {p.title}
                      {p.archived && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-500">Archiv</span>
                      )}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {p.customer?.name ?? p.group?.name ?? "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden xl:table-cell">{p.season ?? "—"}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full whitespace-nowrap block w-fit">
                      {csLabel(p.customerStatus)}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full whitespace-nowrap block w-fit mt-1">
                      {isLabel(p.internalStatus)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${PRIORITY_COLORS[p.priority] ?? PRIORITY_COLORS.normal}`}>
                      {priorities.find((pr) => pr.value === p.priority)?.label ?? p.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                    {p.deadline ? new Date(p.deadline).toLocaleDateString("de-CH") : "—"}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className={`text-xs whitespace-nowrap ${
                        p.paymentStatus === "paid"
                          ? "text-emerald-600"
                          : p.paymentStatus === "partial"
                            ? "text-amber-600"
                            : "text-gray-400"
                      }`}
                    >
                      CHF {formatMoney(p.paidAmount)} / {formatMoney(p.totalAmount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>{total} Aufträge</span>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/crm/projects?page=${p}${f.archived ? "&archived=1" : ""}`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${
                  p === currentPage ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
