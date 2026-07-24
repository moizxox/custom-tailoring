import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GroupForm } from "@/components/crm/GroupForm";

export const metadata: Metadata = { title: "Neue Gruppe — CRM" };

export default async function NewGroupPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Neue Gruppe</h1>
        <p className="text-sm text-gray-400 mt-1">Guggenmusik, Clique, Verein oder andere Gruppe anlegen.</p>
      </div>
      <GroupForm customers={customers} />
    </div>
  );
}
