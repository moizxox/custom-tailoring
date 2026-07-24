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

function dateInput(d: Date | null | undefined): string {
  return d ? d.toISOString().split("T")[0] : "";
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
        <Link href="/admin/crm/projects" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">Aufträge</Link>
        <span className="text-gray-700">/</span>
        <span className="text-xs text-gray-400">
          {project.projectNumber ? `${project.projectNumber} · ` : ""}{project.title}
        </span>
      </div>

      <ProjectDetailClient
        project={{
          id: project.id,
          projectNumber: project.projectNumber ?? null,
          title: project.title,
          customerStatus: project.customerStatus,
          internalStatus: project.internalStatus,
          priority: project.priority,
          totalAmount: project.totalAmount ? Number(project.totalAmount) : null,
          paidAmount: project.paidAmount ? Number(project.paidAmount) : null,
          depositRequired: project.depositRequired ? Number(project.depositRequired) : null,
          paymentStatus: project.paymentStatus,
          archived: project.archived,
          season: project.season ?? null,
          updatedAt: project.updatedAt.toISOString(),
          customer: project.customer
            ? { id: project.customer.id, name: project.customer.name, email: project.customer.email }
            : null,
          group: project.group ? { id: project.group.id, name: project.group.name } : null,
        }}
        formData={{
          title: project.title,
          description: project.description ?? "",
          customerId: project.customer?.id ?? "",
          groupId: project.group?.id ?? "",
          season: project.season ?? "",
          costumeCategory: project.costumeCategory ?? "",
          orderType: project.orderType ?? "",
          quantity: project.quantity,
          measurementDeadline1: dateInput(project.measurementDeadline1),
          measurementDeadline2: dateInput(project.measurementDeadline2),
          measurementDeadline3: dateInput(project.measurementDeadline3),
          fittingDate: dateInput(project.fittingDate),
          deadline: dateInput(project.deadline),
          deliveryDate: dateInput(project.deliveryDate),
          deliveryDate2: dateInput(project.deliveryDate2),
          priority: project.priority,
          customerStatus: project.customerStatus,
          internalStatus: project.internalStatus,
          notes: project.notes ?? "",
          internalNotes: project.internalNotes ?? "",
          totalAmount: project.totalAmount != null ? String(project.totalAmount) : "",
          paidAmount: project.paidAmount != null ? String(project.paidAmount) : "",
          depositRequired: project.depositRequired != null ? String(project.depositRequired) : "",
          paymentStatus: project.paymentStatus,
          contactPersonId: project.contactPersonId ?? "",
          contactPersonName: project.contactPersonName ?? "",
          contactPersonContact: project.contactPersonContact ?? "",
          treasurerName: project.treasurerName ?? "",
          treasurerContact: project.treasurerContact ?? "",
          treasurerNotes: project.treasurerNotes ?? "",
          socialMediaName: project.socialMediaName ?? "",
          socialMediaContact: project.socialMediaContact ?? "",
          socialMediaNotes: project.socialMediaNotes ?? "",
          hasMajorCostume: project.hasMajorCostume,
          majorCostumeNotes: project.majorCostumeNotes ?? "",
          archived: project.archived,
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
        payments={project.payments.map((p) => ({
          id: p.id,
          amount: Number(p.amount),
          kind: p.kind,
          paidAt: p.paidAt.toISOString(),
          note: p.note ?? null,
        }))}
        statusHistory={project.statusHistory.map((h) => ({
          id: h.id,
          status: h.status,
          note: h.note ?? null,
          changedBy: h.changedBy ?? null,
          createdAt: h.createdAt.toISOString(),
        }))}
        reclamations={project.reclamations.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description ?? null,
          status: r.status,
          createdAt: r.createdAt.toISOString(),
          resolvedAt: r.resolvedAt?.toISOString() ?? null,
        }))}
      />
    </div>
  );
}
