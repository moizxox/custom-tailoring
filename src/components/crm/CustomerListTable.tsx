"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Copy, Check, Trash2, Pencil } from "lucide-react";

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  accessCode: string;
  role: string;
  location: string | null;
  createdAt: string;
  _count: { projects: number; groupMemberships: number };
}

interface Props {
  customers: CustomerRow[];
  total: number;
  currentPage: number;
  totalPages: number;
  initialSearch: string;
  initialRole: string;
}

export function CustomerListTable({
  customers,
  total,
  currentPage,
  totalPages,
  initialSearch,
  initialRole,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [role, setRole] = useState(initialRole);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function applyFilters(newSearch: string, newRole: string) {
    const params = new URLSearchParams();
    if (newSearch) params.set("q", newSearch);
    if (newRole) params.set("role", newRole);
    router.push(`/admin/crm/customers?${params.toString()}`);
  }

  async function copyCode(customerId: string, code: string) {
    await navigator.clipboard.writeText(code);
    setCopiedId(customerId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function deleteCustomer(id: string) {
    if (!confirm("Kunden wirklich löschen? Alle zugehörigen Daten werden entfernt.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/admin/api/crm/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        startTransition(() => router.refresh());
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="search"
          placeholder="Name oder E-Mail suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters(search, role)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
        />
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            applyFilters(search, e.target.value);
          }}
          className="px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
        >
          <option value="">Alle Rollen</option>
          <option value="customer">Kunden</option>
          <option value="group_leader">Gruppenleiter</option>
        </select>
        <button
          onClick={() => applyFilters(search, role)}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
        >
          Suchen
        </button>
      </div>

      {/* Table */}
      {customers.length === 0 ? (
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-12 text-center">
          <Users className="w-8 h-8 text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Keine Kunden gefunden</p>
          <Link
            href="/admin/crm/customers/new"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
          >
            + Neuer Kunde
          </Link>
        </div>
      ) : (
        <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden md:table-cell">E-Mail</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden lg:table-cell">Zugangscode</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden sm:table-cell">Projekte</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden sm:table-cell">Rolle</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/crm/customers/${customer.id}`}
                      className="font-medium text-white hover:text-violet-300 transition-colors"
                    >
                      {customer.name}
                    </Link>
                    {customer.location && (
                      <p className="text-xs text-gray-500">{customer.location}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{customer.email}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                        {customer.accessCode}
                      </code>
                      <button
                        onClick={() => copyCode(customer.id, customer.accessCode)}
                        className="text-gray-600 hover:text-white transition-colors"
                        title="Code kopieren"
                      >
                        {copiedId === customer.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-gray-400 text-xs">
                      {customer._count.projects} Projekt{customer._count.projects !== 1 ? "e" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      customer.role === "group_leader"
                        ? "bg-purple-500/10 text-purple-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {customer.role === "group_leader" ? "Gruppenleiter" : "Kunde"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/crm/customers/${customer.id}`}
                        className="text-gray-600 hover:text-white transition-colors"
                        title="Bearbeiten"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteCustomer(customer.id)}
                        disabled={deletingId === customer.id}
                        className="text-gray-600 hover:text-red-400 transition-colors disabled:opacity-40"
                        title="Löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>{total} Einträge</span>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/crm/customers?page=${p}${search ? `&q=${search}` : ""}${role ? `&role=${role}` : ""}`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${
                  p === currentPage
                    ? "bg-violet-600 text-white"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-800"
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
