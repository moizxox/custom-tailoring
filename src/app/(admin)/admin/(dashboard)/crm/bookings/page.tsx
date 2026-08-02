import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { BookingAdminClient } from "./BookingAdminClient";

export const metadata: Metadata = { title: "Termine — CRM" };

export default async function CrmBookingsPage() {
  let appointments: Awaited<ReturnType<typeof prisma.appointmentRequest.findMany>> = [];
  let blocks: Awaited<ReturnType<typeof prisma.bookingBlock.findMany>> = [];

  try {
    [appointments, blocks] = await Promise.all([
      prisma.appointmentRequest.findMany({ orderBy: [{ date: "asc" }, { time: "asc" }], take: 100 }),
      prisma.bookingBlock.findMany({ orderBy: { startAt: "asc" }, take: 50 }),
    ]);
  } catch (error) {
    console.error("[crm] bookings load failed:", error);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Termine & Kalender</h1>
        <p className="text-sm text-gray-500 mt-1">
          Anfragen aus der Online-Buchung, Sperrzeiten und Dauer pro Service.
        </p>
      </div>
      <BookingAdminClient
        initialAppointments={appointments.map((a) => ({
          ...a,
          createdAt: a.createdAt.toISOString(),
        }))}
        initialBlocks={blocks.map((b) => ({
          ...b,
          startAt: b.startAt.toISOString(),
          endAt: b.endAt.toISOString(),
        }))}
      />
    </div>
  );
}
