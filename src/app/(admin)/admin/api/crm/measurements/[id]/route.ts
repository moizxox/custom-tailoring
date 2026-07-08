import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const existing = await prisma.measurement.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });

  // Append to history
  const history = (existing.history as Array<unknown>) ?? [];
  history.push({ changedAt: new Date().toISOString(), snapshot: existing.fields });

  const measurement = await prisma.measurement.update({
    where: { id },
    data: {
      fields: body.fields ?? existing.fields,
      status: body.status ?? existing.status,
      notes: body.notes ?? existing.notes,
      history,
    },
  });
  return NextResponse.json({ measurement });
}
