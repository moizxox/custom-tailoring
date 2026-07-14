import { NextRequest, NextResponse } from "next/server";
import { getPortalCustomerId } from "@/lib/portal/session";
import {
  getNotificationsForCustomer,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/crm/notifications";

export async function GET() {
  const customerId = await getPortalCustomerId();
  if (!customerId) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  const notifications = await getNotificationsForCustomer(customerId);
  return NextResponse.json({ notifications });
}

export async function POST(req: NextRequest) {
  const customerId = await getPortalCustomerId();
  if (!customerId) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  const body = await req.json() as { markAllRead?: boolean; notificationId?: string };
  if (body.markAllRead) {
    await markAllNotificationsRead(customerId);
  } else if (body.notificationId) {
    await markNotificationRead(body.notificationId);
  }
  return NextResponse.json({ ok: true });
}
