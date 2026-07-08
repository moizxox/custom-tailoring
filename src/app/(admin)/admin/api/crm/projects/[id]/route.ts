import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProject, updateProject, deleteProject } from "@/lib/crm/projects";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const project = await updateProject(id, {
    ...body,
    deadline: body.deadline ? new Date(body.deadline) : undefined,
  });
  return NextResponse.json({ project });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
