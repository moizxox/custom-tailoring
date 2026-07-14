import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getAdminNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/crm/notifications";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notifications = await getAdminNotifications();
  return NextResponse.json({ notifications });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json() as { markAllRead?: boolean; notificationId?: string };
  if (body.markAllRead) {
    await markAllNotificationsRead(undefined); // admin notifications have no customerId
  } else if (body.notificationId) {
    await markNotificationRead(body.notificationId);
  }
  return NextResponse.json({ ok: true });
}
