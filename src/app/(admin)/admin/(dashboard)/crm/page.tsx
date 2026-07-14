import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Users, FolderKanban, UsersRound, MessageSquare, AlertCircle, Inbox } from "lucide-react";

export const metadata: Metadata = { title: "CRM — Admin" };

export default async function CrmDashboardPage() {
  const [
    customerCount,
    groupCount,
    projectCount,
    activeProjectCount,
    urgentProjects,
    recentProjects,
    unreadMessages,
    unreadSubmissions,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.group.count(),
    prisma.project.count(),
    prisma.project.count({ where: { customerStatus: { not: "completed" } } }),
    prisma.project.findMany({
      where: { priority: "urgent", customerStatus: { not: "completed" } },
      take: 3,
      orderBy: { updatedAt: "desc" },
      include: { customer: { select: { name: true } }, group: { select: { name: true } } },
    }),
    prisma.project.findMany({
      where: { customerStatus: { not: "completed" } },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { customer: { select: { name: true } }, group: { select: { name: true } } },
    }),
    prisma.message.count({
      where: { senderRole: "customer", isInternal: false, readAt: null },
    }),
    prisma.contactSubmission.count({ where: { read: false } }),
  ]);

  const stats = [
    { label: "Kunden", value: customerCount, icon: Users, href: "/admin/crm/customers", color: "bg-blue-500/10 text-blue-400" },
    { label: "Gruppen", value: groupCount, icon: UsersRound, href: "/admin/crm/groups", color: "bg-purple-500/10 text-purple-400" },
    { label: "Projekte gesamt", value: projectCount, icon: FolderKanban, href: "/admin/crm/projects", color: "bg-emerald-500/10 text-emerald-400" },
    { label: "Aktive Projekte", value: activeProjectCount, icon: FolderKanban, href: "/admin/crm/projects", color: "bg-amber-500/10 text-amber-400" },
    { label: "Ungelesene Nachrichten", value: unreadMessages, icon: MessageSquare, href: "/admin/crm/projects", color: "bg-rose-500/10 text-rose-400" },
    { label: "Neue Anfragen", value: unreadSubmissions, icon: Inbox, href: "/admin/crm/submissions?unread=true", color: "bg-sky-500/10 text-sky-400" },
  ];

  const customerStatusLabels: Record<string, string> = {
    request_received: "Anfrage",
    consultation_scheduled: "Beratung geplant",
    design_approved: "Design ok",
    measurement_pending: "Masse ausstehend",
    production_started: "In Produktion",
    fitting_scheduled: "Anprobe geplant",
    alterations: "Anpassungen",
    ready_for_pickup: "Abholbereit",
    completed: "Fertig",
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">CRM Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Übersicht aller Kunden, Gruppen und Projekte</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 hover:border-gray-300 transition-all group"
            >
              <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent projects */}
        {urgentProjects.length > 0 && (
          <div className="bg-white border border-red-200 shadow-sm rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <h2 className="text-sm font-semibold text-gray-900">Dringend</h2>
            </div>
            <div className="space-y-2">
              {urgentProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/crm/projects/${p.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all group"
                >
                  <div>
                    <p className="text-sm text-gray-900 group-hover:text-red-300 transition-colors">{p.title}</p>
                    <p className="text-xs text-gray-500">
                      {p.customer?.name ?? p.group?.name ?? "Unbekannt"}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">
                    Dringend
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent projects */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Aktuelle Projekte</h2>
            <Link href="/admin/crm/projects" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Alle →
            </Link>
          </div>
          <div className="space-y-2">
            {recentProjects.map((p) => (
              <Link
                key={p.id}
                href={`/admin/crm/projects/${p.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900 group-hover:text-violet-600 transition-colors truncate">{p.title}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {p.customer?.name ?? p.group?.name ?? "Unbekannt"}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full ml-2 flex-shrink-0">
                  {customerStatusLabels[p.customerStatus] ?? p.customerStatus}
                </span>
              </Link>
            ))}
            {recentProjects.length === 0 && (
              <p className="text-xs text-gray-600 text-center py-6">Noch keine Projekte</p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Schnellzugriff</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/crm/submissions"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
            >
              <Inbox className="w-4 h-4" />
              Anfragen
              {unreadSubmissions > 0 && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">{unreadSubmissions}</span>
              )}
            </Link>
            <Link
              href="/admin/crm/customers/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
            >
              <Users className="w-4 h-4" />
              Neuer Kunde
            </Link>
            <Link
              href="/admin/crm/groups/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
            >
              <UsersRound className="w-4 h-4" />
              Neue Gruppe
            </Link>
            <Link
              href="/admin/crm/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
            >
              <FolderKanban className="w-4 h-4" />
              Neues Projekt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
