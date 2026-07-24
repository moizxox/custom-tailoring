import type { Metadata } from "next";
import Link from "next/link";
import { listGroups, GROUP_TYPES, BILLING_MODES } from "@/lib/crm/groups";
import { UsersRound, Plus } from "lucide-react";

export const metadata: Metadata = { title: "Gruppen — CRM" };

interface Props {
  searchParams: Promise<{ q?: string; type?: string; archived?: string }>;
}

export default async function CrmGroupsPage({ searchParams }: Props) {
  const { q, type, archived } = await searchParams;
  const showArchived = archived === "1";
  const { groups, total } = await listGroups({ search: q, type, archived: showArchived });

  const typeLabel = (v: string) => GROUP_TYPES.find((t) => t.value === v)?.label ?? v;
  const billingLabel = (v: string | null) =>
    v ? (BILLING_MODES.find((b) => b.value === v)?.label ?? v) : null;

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gruppen</h1>
          <p className="text-sm text-gray-400 mt-1">
            {total} {showArchived ? "archivierte " : ""}Gruppen
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={showArchived ? "/admin/crm/groups" : "/admin/crm/groups?archived=1"}
            className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-xl px-3 py-2 transition-colors"
          >
            {showArchived ? "Aktive anzeigen" : "Archiv anzeigen"}
          </Link>
          <Link
            href="/admin/crm/groups/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Neue Gruppe
          </Link>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-12 text-center">
          <UsersRound className="w-8 h-8 text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            {showArchived ? "Keine archivierten Gruppen" : "Noch keine Gruppen vorhanden"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/admin/crm/groups/${group.id}`}
              className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {[group.season, billingLabel(group.billingMode)].filter(Boolean).join(" · ") || "\u00A0"}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded-full">
                  {typeLabel(group.type)}
                </span>
              </div>
              <div className="flex gap-4 mt-auto pt-3 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{group._count.members}</p>
                  <p className="text-[10px] text-gray-600">Mitglieder</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{group._count.projects}</p>
                  <p className="text-[10px] text-gray-600">Aufträge</p>
                </div>
                {group.leader && (
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-500">Hauptperson</p>
                    <p className="text-xs text-gray-700">{group.leader.name}</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
