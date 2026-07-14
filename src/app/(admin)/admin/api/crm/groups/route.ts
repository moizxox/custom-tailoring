import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createGroup, listGroups } from "@/lib/crm/groups";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const result = await listGroups({
    search: searchParams.get("q") ?? undefined,
    type: searchParams.get("type") ?? undefined,
  });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name ist erforderlich." }, { status: 400 });
  }
  const group = await createGroup(body);
  return NextResponse.json({ group }, { status: 201 });
}
