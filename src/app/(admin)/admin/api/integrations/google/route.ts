import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getGoogleAuthUrl,
  getGoogleCalendarStatus,
  isGoogleCalendarConfigured,
} from "@/lib/google/calendar";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = await getGoogleCalendarStatus();
  return NextResponse.json({
    ...status,
    connectUrl: status.configured && !status.connected ? getGoogleAuthUrl() : null,
  });
}

/** Start OAuth — redirect to Google */
export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isGoogleCalendarConfigured()) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET fehlen auf dem Server." },
      { status: 500 },
    );
  }
  return NextResponse.json({ url: getGoogleAuthUrl() });
}
