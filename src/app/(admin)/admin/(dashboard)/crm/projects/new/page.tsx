import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/crm/ProjectForm";

export const metadata: Metadata = { title: "Neues Projekt — CRM" };

interface Props {
  searchParams: Promise<{ customerId?: string; groupId?: string }>;
}

export default async function NewProjectPage({ searchParams }: Props) {
  const { customerId, groupId } = await searchParams;

  const [customers, groups] = await Promise.all([
    prisma.customer.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.group.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Neues Projekt</h1>
        <p className="text-sm text-gray-400 mt-1">Projekt für einen Kunden oder eine Gruppe erstellen.</p>
      </div>
      <ProjectForm
        customers={customers}
        groups={groups}
        initialCustomerId={customerId}
        initialGroupId={groupId}
      />
    </div>
  );
}
