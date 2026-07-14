import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CustomerForm } from "@/components/crm/CustomerForm";
import { CustomerDetailActions } from "@/components/crm/CustomerDetailActions";
import { formatCustomerStatus } from "@/lib/crm/projects";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id }, select: { name: true } });
  return { title: customer ? `${customer.name} — CRM` : "Kunde" };
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      projects: {
        orderBy: { updatedAt: "desc" },
        include: { group: { select: { name: true } } },
      },
      groupMemberships: {
        include: { group: { select: { id: true, name: true, type: true } } },
      },
      _count: { select: { projects: true, measurements: true } },
    },
  });

  if (!customer) notFound();

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/crm/customers" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Kunden
            </Link>
            <span className="text-gray-700">/</span>
            <span className="text-xs text-gray-400">{customer.name}</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">{customer.name}</h1>
          <p className="text-sm text-gray-400 mt-1">{customer.email}</p>
        </div>
        <CustomerDetailActions customerId={customer.id} accessCode={customer.accessCode} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Kundendaten</h2>
            <CustomerForm
              customerId={customer.id}
              initialData={{
                name: customer.name,
                email: customer.email,
                phone: customer.phone ?? "",
                notes: customer.notes ?? "",
                location: customer.location ?? "",
                role: customer.role as "customer" | "group_leader",
              }}
            />
          </div>
        </div>

        {/* Stats & links */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Statistik</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Projekte</span>
                <span className="text-gray-900 font-medium">{customer._count.projects}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Masse</span>
                <span className="text-gray-900 font-medium">{customer._count.measurements}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Gruppen</span>
                <span className="text-gray-900 font-medium">{customer.groupMemberships.length}</span>
              </div>
            </div>
          </div>

          {customer.groupMemberships.length > 0 && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Gruppen</p>
              <div className="space-y-2">
                {customer.groupMemberships.map((gm) => (
                  <Link
                    key={gm.group.id}
                    href={`/admin/crm/groups/${gm.group.id}`}
                    className="flex items-center justify-between text-sm hover:text-violet-600 transition-colors"
                  >
                    <span className="text-gray-300">{gm.group.name}</span>
                    <span className="text-[10px] text-gray-600">{gm.group.type}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Projects */}
      {customer.projects.length > 0 && (
        <div className="mt-6 bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Projekte</h2>
            <Link
              href={`/admin/crm/projects/new?customerId=${customer.id}`}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              + Neues Projekt
            </Link>
          </div>
          <div className="space-y-2">
            {customer.projects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/crm/projects/${project.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all group"
              >
                <div>
                  <p className="text-sm text-gray-900 group-hover:text-violet-600 transition-colors">
                    {project.title}
                  </p>
                  {project.group && (
                    <p className="text-xs text-gray-500">Gruppe: {project.group.name}</p>
                  )}
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full">
                  {formatCustomerStatus(project.customerStatus)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {customer.projects.length === 0 && (
        <div className="mt-6 flex justify-center">
          <Link
            href={`/admin/crm/projects/new?customerId=${customer.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
          >
            + Erstes Projekt anlegen
          </Link>
        </div>
      )}
    </div>
  );
}
