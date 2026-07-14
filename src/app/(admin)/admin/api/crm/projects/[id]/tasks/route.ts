import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: projectId } = await params;
  const tasks = await prisma.task.findMany({ where: { projectId }, orderBy: { createdAt: "asc" } });
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: projectId } = await params;
  const body = await req.json();
  if (!body.title?.trim()) return NextResponse.json({ error: "Titel erforderlich." }, { status: 400 });
  const task = await prisma.task.create({
    data: {
      projectId,
      title: body.title.trim(),
      description: body.description?.trim() ?? null,
      assignedTo: body.assignedTo?.trim() ?? null,
      priority: body.priority ?? "normal",
      status: body.status ?? "todo",
      dueAt: body.dueAt ? new Date(body.dueAt) : null,
    },
  });
  return NextResponse.json({ task }, { status: 201 });
}
