import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getGroup, updateGroup, deleteGroup } from "@/lib/crm/groups";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const group = await getGroup(id);
  if (!group) return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  return NextResponse.json({ group });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const group = await updateGroup(id, body);
  return NextResponse.json({ group });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteGroup(id);
  return NextResponse.json({ ok: true });
}
