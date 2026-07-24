import type { Metadata } from "next";
import Link from "next/link";
import { listProjects, CUSTOMER_STATUSES, INTERNAL_STATUSES, PROJECT_PRIORITIES } from "@/lib/crm/projects";
import { prisma } from "@/lib/prisma";
import { ProjectsTable } from "@/components/crm/ProjectsTable";

export const metadata: Metadata = { title: "Aufträge — CRM" };

interface Props {
  searchParams: Promise<{
    q?: string;
    customerStatus?: string;
    internalStatus?: string;
    priority?: string;
    season?: string;
    archived?: string;
    page?: string;
  }>;
}

export default async function CrmProjectsPage({ searchParams }: Props) {
  const { q, customerStatus, internalStatus, priority, season, archived, page } =
    await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const take = 20;
  const skip = (currentPage - 1) * take;
  const showArchived = archived === "1";

  const [{ projects, total }, seasonRows] = await Promise.all([
    listProjects({
      search: q,
      customerStatus,
      internalStatus,
      priority,
      season,
      archived: showArchived ? true : false,
      skip,
      take,
    }),
    prisma.project.findMany({
      where: { season: { not: null } },
      select: { season: true },
      distinct: ["season"],
      orderBy: { season: "desc" },
    }),
  ]);
  const totalPages = Math.ceil(total / take);
  const seasons = seasonRows
    .map((r) => r.season)
    .filter((s): s is string => !!s);

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Aufträge</h1>
          <p className="text-sm text-gray-400 mt-1">
            {total} {showArchived ? "archivierte " : ""}Aufträge
          </p>
        </div>
        <Link
          href="/admin/crm/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
        >
          + Neuer Auftrag
        </Link>
      </div>

      <ProjectsTable
        projects={projects.map((p) => ({
          id: p.id,
          projectNumber: p.projectNumber ?? null,
          title: p.title,
          season: p.season ?? null,
          customerStatus: p.customerStatus,
          internalStatus: p.internalStatus,
          priority: p.priority,
          deadline: p.deadline?.toISOString() ?? null,
          totalAmount: p.totalAmount != null ? Number(p.totalAmount) : null,
          paidAmount: p.paidAmount != null ? Number(p.paidAmount) : null,
          paymentStatus: p.paymentStatus,
          archived: p.archived,
          updatedAt: p.updatedAt.toISOString(),
          customer: p.customer,
          group: p.group,
          _count: p._count,
        }))}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        seasons={seasons}
        customerStatuses={CUSTOMER_STATUSES as unknown as Array<{ value: string; label: string }>}
        internalStatuses={INTERNAL_STATUSES as unknown as Array<{ value: string; label: string }>}
        priorities={PROJECT_PRIORITIES as unknown as Array<{ value: string; label: string }>}
        initialFilters={{
          q: q ?? "",
          customerStatus: customerStatus ?? "",
          internalStatus: internalStatus ?? "",
          priority: priority ?? "",
          season: season ?? "",
          archived: showArchived,
        }}
      />
    </div>
  );
}
