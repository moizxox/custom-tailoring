import type { Metadata } from "next";
import Link from "next/link";
import { listCustomers } from "@/lib/crm/customers";
import { CustomerListTable } from "@/components/crm/CustomerListTable";

export const metadata: Metadata = { title: "Kunden — CRM" };

interface Props {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
}

export default async function CrmCustomersPage({ searchParams }: Props) {
  const { q, role, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const take = 25;
  const skip = (currentPage - 1) * take;

  const { customers, total } = await listCustomers({ search: q, role, skip, take });
  const totalPages = Math.ceil(total / take);

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Kunden</h1>
          <p className="text-sm text-gray-400 mt-1">{total} Kunden insgesamt</p>
        </div>
        <Link
          href="/admin/crm/customers/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          + Neuer Kunde
        </Link>
      </div>

      <CustomerListTable
        customers={customers.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone ?? null,
          accessCode: c.accessCode,
          role: c.role,
          location: c.location ?? null,
          createdAt: c.createdAt.toISOString(),
          _count: (c as typeof c & { _count?: { projects: number; groupMemberships: number } })._count ?? { projects: 0, groupMemberships: 0 },
        }))}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        initialSearch={q ?? ""}
        initialRole={role ?? ""}
      />
    </div>
  );
}
