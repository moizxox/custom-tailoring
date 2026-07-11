import { NextRequest, NextResponse } from "next/server";
import { getPortalCustomerId } from "@/lib/portal/session";
import { prisma } from "@/lib/prisma";
import { canAccessProject } from "@/lib/portal/projects";
import { sendMessage, getMessages, markMessagesRead } from "@/lib/crm/messages";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id: projectId } = await params;

  const customerId = await getPortalCustomerId();
  if (!customerId) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { customerId: true, groupId: true },
  });
  if (!project || !(await canAccessProject(customerId, project))) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }

  const messages = await getMessages(projectId, { includeInternal: false });
  await markMessagesRead(projectId, "customer");

  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id: projectId } = await params;

  const customerId = await getPortalCustomerId();
  if (!customerId) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { customer: { select: { name: true } } },
  });
  if (!project || !(await canAccessProject(customerId, project))) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { name: true },
  });

  const body = await req.json() as { body?: string };
  if (!body.body?.trim()) {
    return NextResponse.json({ error: "Nachricht ist leer." }, { status: 400 });
  }

  const message = await sendMessage({
    projectId,
    senderRole: "customer",
    senderName: customer?.name ?? project.customer?.name ?? undefined,
    body: body.body.trim(),
  });

  return NextResponse.json({
    message: {
      id: message.id,
      conversationId: message.conversationId,
      projectId,
      senderRole: message.senderRole,
      senderName: message.senderName,
      body: message.body,
      isInternal: message.isInternal,
      readAt: message.readAt?.toISOString() ?? null,
      createdAt: message.createdAt.toISOString(),
    },
  });
}
