import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import {
  createCalendarEventForAppointment,
  getGoogleCalendarStatus,
} from "@/lib/google/calendar";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const status = typeof body.status === "string" ? body.status : null;
  if (!status || !["pending", "confirmed", "cancelled", "completed"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const existing = await prisma.appointmentRequest.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let googleEventId = existing.googleEventId;
  let calendarWarning: string | null = null;

  if (status === "confirmed" && existing.status !== "confirmed" && !googleEventId) {
    const gcal = await getGoogleCalendarStatus();
    if (gcal.connected) {
      try {
        googleEventId = await createCalendarEventForAppointment(existing);
      } catch (err) {
        calendarWarning =
          err instanceof Error ? err.message : "Google Calendar Event konnte nicht erstellt werden.";
        console.error("[gcal] create event failed", err);
      }
    } else {
      calendarWarning = "Google Calendar ist nicht verbunden.";
    }
  }

  const appointment = await prisma.appointmentRequest.update({
    where: { id },
    data: {
      status,
      ...(googleEventId ? { googleEventId } : {}),
    },
  });

  return NextResponse.json({ appointment, calendarWarning });
}
