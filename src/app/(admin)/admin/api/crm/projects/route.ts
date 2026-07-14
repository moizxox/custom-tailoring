import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createProject, listProjects } from "@/lib/crm/projects";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const result = await listProjects({
    search: searchParams.get("q") ?? undefined,
    customerStatus: searchParams.get("customerStatus") ?? undefined,
    internalStatus: searchParams.get("internalStatus") ?? undefined,
    priority: searchParams.get("priority") ?? undefined,
  });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.title?.trim()) return NextResponse.json({ error: "Titel erforderlich." }, { status: 400 });
  const project = await createProject({
    ...body,
    deadline: body.deadline ? new Date(body.deadline) : undefined,
  });
  return NextResponse.json({ project }, { status: 201 });
}
