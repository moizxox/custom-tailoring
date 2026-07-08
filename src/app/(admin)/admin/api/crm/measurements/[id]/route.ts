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
  // Build updated history — cast to satisfy Prisma's Json type
  const prevHistory = Array.isArray(existing.history) ? [...(existing.history as object[])] : [];
  prevHistory.push({ changedAt: new Date().toISOString(), snapshot: existing.fields } as object);

  const measurement = await prisma.measurement.update({
    where: { id },
    data: {
      fields: body.fields ?? existing.fields,
      status: body.status ?? existing.status,
      notes: body.notes ?? existing.notes,
      history: prevHistory as object[],
    },
  });
  return NextResponse.json({ measurement });
}
