import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      locationId?: string;
      serviceId?: string;
      serviceLabel?: string;
      date?: string;
      time?: string;
      durationMin?: number;
      name?: string;
      email?: string;
      phone?: string;
      notes?: string;
    };

    if (!body.name?.trim() || !body.email?.trim() || !body.locationId || !body.date || !body.time || !body.serviceLabel) {
      return NextResponse.json(
        { error: "Name, E-Mail, Standort, Service, Datum und Zeit sind erforderlich." },
        { status: 400 },
      );
    }

    const startAt = new Date(`${body.date}T${body.time}:00`);
    if (!Number.isNaN(startAt.getTime())) {
      const endAt = new Date(startAt.getTime() + (body.durationMin ?? 30) * 60_000);
      const block = await prisma.bookingBlock.findFirst({
        where: {
          AND: [
            { startAt: { lt: endAt } },
            { endAt: { gt: startAt } },
            {
              OR: [
                { locationId: null },
                { locationId: body.locationId },
              ],
            },
          ],
        },
      });
      if (block) {
        return NextResponse.json(
          {
            error:
              "Dieser Zeitraum ist blockiert. Bitte wählen Sie eine andere Zeit oder kontaktieren Sie uns direkt.",
            code: "BLOCKED",
          },
          { status: 409 },
        );
      }
    }

    const appointment = await prisma.appointmentRequest.create({
      data: {
        locationId: body.locationId,
        serviceId: body.serviceId ?? null,
        serviceLabel: body.serviceLabel.trim(),
        date: body.date,
        time: body.time,
        durationMin: body.durationMin && body.durationMin > 0 ? body.durationMin : 30,
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone?.trim() || null,
        notes: body.notes?.trim() || null,
        status: "pending",
      },
    });

    return NextResponse.json({ ok: true, id: appointment.id });
  } catch (error) {
    console.error("[termin] booking failed:", error);
    return NextResponse.json({ error: "Buchung konnte nicht gespeichert werden." }, { status: 500 });
  }
}
