import { redirect, notFound } from "next/navigation";
import { getPortalCustomerId } from "@/lib/portal/session";
import { prisma } from "@/lib/prisma";
import { canAccessProject } from "@/lib/portal/projects";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { PortalProjectDetail } from "@/components/portal/PortalProjectDetail";
import { formatCustomerStatus } from "@/lib/crm/projects";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    select: { title: true },
  });
  return {
    title: project ? `${project.title} — Kundenbereich` : "Projekt",
    robots: { index: false, follow: false },
  };
}

export default async function PortalProjectPage({ params }: Props) {
  const { id } = await params;

  const customerId = await getPortalCustomerId();
  if (!customerId) redirect("/kundenbereich/login");

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      files: {
        where: {
          AND: [
            { category: { not: "internal" } },
            { visibleToCustomer: true },
          ],
        },
        orderBy: { createdAt: "desc" },
      },
      conversations: {
        include: {
          messages: {
            where: { isInternal: false },
            orderBy: { createdAt: "asc" },
            take: 100,
          },
        },
        take: 1,
      },
      group: { select: { name: true } },
    },
  });

  if (!project || !(await canAccessProject(customerId, project))) notFound();

  const unreadCount = await prisma.notification.count({
    where: { customerId, read: false },
  });

  const conversation = project.conversations[0] ?? null;
  const messages = conversation?.messages ?? [];

  return (
    <>
      <PortalHeader unreadCount={unreadCount} />
      <PortalProjectDetail
        project={{
          id: project.id,
          title: project.title,
          description: project.description ?? null,
          notes: project.notes ?? null,
          customerStatus: project.customerStatus,
          customerStatusLabel: formatCustomerStatus(project.customerStatus),
          deadline: project.deadline?.toISOString() ?? null,
          deliveryDate: project.deliveryDate?.toISOString() ?? null,
          quantity: project.quantity,
          costumeCategory: project.costumeCategory ?? null,
          orderType: project.orderType ?? null,
          updatedAt: project.updatedAt.toISOString(),
        }}
        files={project.files.map((f) => ({
          id: f.id,
          url: f.url,
          originalName: f.originalName ?? null,
          category: f.category,
          description: f.description ?? null,
          createdAt: f.createdAt.toISOString(),
        }))}
        conversationId={conversation?.id ?? null}
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
        customerId={customerId}
      />
    </>
  );
}
