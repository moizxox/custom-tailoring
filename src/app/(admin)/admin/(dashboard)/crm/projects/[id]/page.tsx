import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, CUSTOMER_STATUSES, INTERNAL_STATUSES } from "@/lib/crm/projects";
import { prisma } from "@/lib/prisma";
import { ProjectDetailClient } from "@/components/crm/ProjectDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  return { title: project ? `${project.title} — CRM` : "Projekt" };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  const groups = await prisma.group.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const peopleMap = new Map<string, string>();
  if (project.customer) {
    peopleMap.set(project.customer.id, project.customer.name);
  }
  for (const member of project.group?.members ?? []) {
    peopleMap.set(member.customer.id, member.customer.name);
  }
  for (const m of project.measurements) {
    if (m.customer && !peopleMap.has(m.customer.id)) {
      peopleMap.set(m.customer.id, m.customer.name);
    }
  }
  const people = Array.from(peopleMap.entries()).map(([id, name]) => ({ id, name }));

  const conv = project.conversations[0] ?? null;
  const messages = conv?.messages ?? [];

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/crm/projects" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">Projekte</Link>
        <span className="text-gray-700">/</span>
        <span className="text-xs text-gray-400">{project.title}</span>
      </div>

      <ProjectDetailClient
        project={{
          id: project.id,
          title: project.title,
          description: project.description ?? null,
          customerStatus: project.customerStatus,
          internalStatus: project.internalStatus,
          priority: project.priority,
          deadline: project.deadline?.toISOString() ?? null,
          deliveryDate: project.deliveryDate?.toISOString() ?? null,
          quantity: project.quantity,
          costumeCategory: project.costumeCategory ?? null,
          orderType: project.orderType ?? null,
          notes: project.notes ?? null,
          internalNotes: project.internalNotes ?? null,
          totalAmount: project.totalAmount ? Number(project.totalAmount) : null,
          paidAmount: project.paidAmount ? Number(project.paidAmount) : null,
          paymentStatus: project.paymentStatus,
          updatedAt: project.updatedAt.toISOString(),
          customer: project.customer
            ? { id: project.customer.id, name: project.customer.name, email: project.customer.email }
            : null,
          group: project.group ? { id: project.group.id, name: project.group.name } : null,
        }}
        tasks={project.tasks.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description ?? null,
          assignedTo: t.assignedTo ?? null,
          priority: t.priority,
          status: t.status,
          dueAt: t.dueAt?.toISOString() ?? null,
          completedAt: t.completedAt?.toISOString() ?? null,
          createdAt: t.createdAt.toISOString(),
        }))}
        files={project.files.map((f) => ({
          id: f.id,
          url: f.url,
          originalName: f.originalName ?? null,
          category: f.category,
          description: f.description ?? null,
          uploadedBy: f.uploadedBy,
          visibleToCustomer: f.visibleToCustomer && f.category !== "internal",
          createdAt: f.createdAt.toISOString(),
        }))}
        measurements={project.measurements.map((m) => ({
          id: m.id,
          customerId: m.customerId,
          customerName: m.customer?.name ?? null,
          fields: m.fields as Record<string, number>,
          status: m.status,
          notes: m.notes ?? null,
          updatedAt: m.updatedAt.toISOString(),
        }))}
        people={people}
        costumeCategory={project.costumeCategory ?? null}
        conversationId={conv?.id ?? null}
        initialMessages={messages.map((m) => ({
          id: m.id,
          conversationId: m.conversationId,
          projectId: id,
          senderRole: m.senderRole as "admin" | "customer",
          senderName: m.senderName,
          body: m.body,
          isInternal: m.isInternal,
          readAt: m.readAt?.toISOString() ?? null,
          createdAt: m.createdAt.toISOString(),
        }))}
        customers={customers}
        groups={groups}
        customerStatuses={CUSTOMER_STATUSES as unknown as Array<{ value: string; label: string }>}
        internalStatuses={INTERNAL_STATUSES as unknown as Array<{ value: string; label: string }>}
      />
    </div>
  );
}
