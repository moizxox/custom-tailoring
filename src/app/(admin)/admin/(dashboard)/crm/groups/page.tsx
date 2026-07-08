import type { Metadata } from "next";
import Link from "next/link";
import { listGroups } from "@/lib/crm/groups";
import { UsersRound, Plus } from "lucide-react";

export const metadata: Metadata = { title: "Gruppen — CRM" };

interface Props {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function CrmGroupsPage({ searchParams }: Props) {
  const { q, type } = await searchParams;
  const { groups, total } = await listGroups({ search: q, type });

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Gruppen</h1>
          <p className="text-sm text-gray-400 mt-1">{total} Gruppen insgesamt</p>
        </div>
        <Link
          href="/admin/crm/groups/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Neue Gruppe
        </Link>
      </div>

      {groups.length === 0 ? (
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-12 text-center">
          <UsersRound className="w-8 h-8 text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Noch keine Gruppen vorhanden</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/admin/crm/groups/${group.id}`}
              className="bg-gray-900 border border-white/5 rounded-2xl p-5 hover:border-white/10 hover:bg-gray-800 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                    {group.name}
                  </h3>
                  {group.season && (
                    <p className="text-xs text-gray-500 mt-0.5">{group.season}</p>
                  )}
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full capitalize">
                  {group.type}
                </span>
              </div>
              <div className="flex gap-4 mt-auto pt-3 border-t border-white/5">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{group._count.members}</p>
                  <p className="text-[10px] text-gray-600">Mitglieder</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{group._count.projects}</p>
                  <p className="text-[10px] text-gray-600">Projekte</p>
                </div>
                {group.leader && (
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-500">Leiter</p>
                    <p className="text-xs text-gray-300">{group.leader.name}</p>
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
