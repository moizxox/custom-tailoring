import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGroup } from "@/lib/crm/groups";
import { GroupForm } from "@/components/crm/GroupForm";
import { GroupMemberTable } from "@/components/crm/GroupMemberTable";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const group = await getGroup(id);
  return { title: group ? `${group.name} — CRM` : "Gruppe" };
}

export default async function GroupDetailPage({ params }: Props) {
  const { id } = await params;
  const group = await getGroup(id);
  if (!group) notFound();

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/crm/groups" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
          Gruppen
        </Link>
        <span className="text-gray-700">/</span>
        <span className="text-xs text-gray-400">{group.name}</span>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-1">{group.name}</h1>
      <p className="text-sm text-gray-400 mb-6 capitalize">{group.type}{group.season ? ` — ${group.season}` : ""}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Gruppendetails</h2>
          <GroupForm
            groupId={group.id}
            initialData={{
              name: group.name,
              description: group.description ?? "",
              type: group.type,
              season: group.season ?? "",
              leaderId: group.leaderId ?? "",
              location: group.location ?? "",
              notes: group.notes ?? "",
            }}
          />
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Statistik</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Mitglieder</span>
                <span className="text-gray-900 font-medium">{group.members.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Projekte</span>
                <span className="text-gray-900 font-medium">{group.projects.length}</span>
              </div>
            </div>
          </div>

          {group.projects.length > 0 && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Projekte</p>
              <div className="space-y-2">
                {group.projects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/crm/projects/${p.id}`}
                    className="block text-sm text-gray-300 hover:text-violet-600 transition-colors"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Members */}
      <GroupMemberTable
        groupId={group.id}
        members={group.members.map((m) => ({
          customerId: m.customerId,
          customerName: m.customer.name,
          customerEmail: m.customer.email,
          costumeVariant: m.costumeVariant ?? null,
          measurementStatus: m.measurementStatus,
          notes: m.notes ?? null,
          sortOrder: m.sortOrder,
        }))}
      />
    </div>
  );
}
