import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { addGroupMember, removeGroupMember, updateGroupMember } from "@/lib/crm/groups";
import { prisma } from "@/lib/prisma";

interface Params { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: groupId } = await params;
  const body = await req.json();

  if (!body.email?.trim() && !body.customerId) {
    return NextResponse.json({ error: "E-Mail oder customerId erforderlich." }, { status: 400 });
  }

  let customerId = body.customerId;
  if (!customerId) {
    const customer = await prisma.customer.findFirst({
      where: { email: { equals: body.email, mode: "insensitive" } },
    });
    if (!customer) {
      return NextResponse.json({ error: "Kein Kunde mit dieser E-Mail gefunden." }, { status: 404 });
    }
    customerId = customer.id;
  }

  const member = await addGroupMember(groupId, customerId, {
    costumeVariant: body.costumeVariant,
    notes: body.notes,
  });
  return NextResponse.json({ member }, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: groupId } = await params;
  const body = await req.json();
  await removeGroupMember(groupId, body.customerId);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: groupId } = await params;
  const body = await req.json();
  const member = await updateGroupMember(groupId, body.customerId, body);
  return NextResponse.json({ member });
}
