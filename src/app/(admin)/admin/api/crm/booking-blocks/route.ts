import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const startAt = new Date(body.startAt);
    const endAt = new Date(body.endAt);
    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime()) || endAt <= startAt) {
      return NextResponse.json({ error: "Ungültiger Zeitraum." }, { status: 400 });
    }

    const block = await prisma.bookingBlock.create({
      data: {
        locationId: typeof body.locationId === "string" && body.locationId ? body.locationId : null,
        startAt,
        endAt,
        reason: typeof body.reason === "string" && body.reason.trim() ? body.reason.trim() : null,
      },
    });

    return NextResponse.json({
      block: {
        ...block,
        startAt: block.startAt.toISOString(),
        endAt: block.endAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[crm] create block failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
