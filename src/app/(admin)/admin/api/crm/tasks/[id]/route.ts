import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const task = await prisma.task.update({
    where: { id },
    data: {
      title: body.title?.trim() ?? undefined,
      description: body.description?.trim() ?? undefined,
      assignedTo: body.assignedTo?.trim() ?? undefined,
      priority: body.priority ?? undefined,
      status: body.status ?? undefined,
      dueAt: body.dueAt ? new Date(body.dueAt) : undefined,
      completedAt: body.status === "done" ? new Date() : body.status === "todo" ? null : undefined,
    },
  });
  return NextResponse.json({ task });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
