import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMessages, sendMessage, markMessagesRead } from "@/lib/crm/messages";

interface Params { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: projectId } = await params;
  const messages = await getMessages(projectId, { includeInternal: true });
  await markMessagesRead(projectId, "admin");
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: projectId } = await params;
  const body = await req.json() as { body?: string; isInternal?: boolean };
  if (!body.body?.trim()) return NextResponse.json({ error: "Nachricht leer." }, { status: 400 });

  const adminName = (session as { user?: { name?: string | null } }).user?.name ?? "Admin";
  const message = await sendMessage({
    projectId,
    senderRole: "admin",
    senderName: adminName,
    body: body.body.trim(),
    isInternal: body.isInternal ?? false,
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
