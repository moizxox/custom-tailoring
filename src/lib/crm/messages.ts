import { prisma } from "@/lib/prisma";

export async function getOrCreateConversation(projectId: string) {
  const existing = await prisma.conversation.findFirst({ where: { projectId } });
  if (existing) return existing;
  return prisma.conversation.create({ data: { projectId } });
}

export async function getMessages(
  projectId: string,
  opts: { includeInternal?: boolean; skip?: number; take?: number } = {}
) {
  const conv = await prisma.conversation.findFirst({ where: { projectId } });
  if (!conv) return [];

  return prisma.message.findMany({
    where: {
      conversationId: conv.id,
      ...(opts.includeInternal === false ? { isInternal: false } : {}),
    },
    orderBy: { createdAt: "asc" },
    skip: opts.skip ?? 0,
    take: opts.take ?? 100,
  });
}

export async function sendMessage(opts: {
  projectId: string;
  senderRole: "admin" | "customer";
  senderName?: string;
  body: string;
  isInternal?: boolean;
  attachmentUrl?: string;
  attachmentType?: string;
}) {
  const conv = await getOrCreateConversation(opts.projectId);

  return prisma.message.create({
    data: {
      conversationId: conv.id,
      senderRole: opts.senderRole,
      senderName: opts.senderName ?? null,
      body: opts.body,
      isInternal: opts.isInternal ?? false,
      attachmentUrl: opts.attachmentUrl ?? null,
      attachmentType: opts.attachmentType ?? null,
    },
  });
}

export async function markMessagesRead(projectId: string, readByRole: "admin" | "customer") {
  const conv = await prisma.conversation.findFirst({ where: { projectId } });
  if (!conv) return;

  const oppositeRole = readByRole === "admin" ? "customer" : "admin";
  await prisma.message.updateMany({
    where: {
      conversationId: conv.id,
      senderRole: oppositeRole,
      isInternal: false,
      readAt: null,
    },
    data: { readAt: new Date() },
  });
}

export async function getUnreadCount(projectId: string, forRole: "admin" | "customer") {
  const conv = await prisma.conversation.findFirst({ where: { projectId } });
  if (!conv) return 0;

  const oppositeRole = forRole === "admin" ? "customer" : "admin";
  return prisma.message.count({
    where: {
      conversationId: conv.id,
      senderRole: oppositeRole,
      isInternal: false,
      readAt: null,
    },
  });
}
