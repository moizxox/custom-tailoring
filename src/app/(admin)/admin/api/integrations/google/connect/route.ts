import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createOAuthClient,
  getGoogleAuthUrl,
  isGoogleCalendarConfigured,
} from "@/lib/google/calendar";

/** Browser redirect entry: /admin/api/integrations/google/connect */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_APP_URL || "https://kostuemschneiderei.ch"));
  }
  if (!isGoogleCalendarConfigured()) {
    return NextResponse.redirect(
      new URL("/admin/crm/bookings?gcal=missing_config", process.env.NEXT_PUBLIC_APP_URL || "https://kostuemschneiderei.ch"),
    );
  }
  // Ensure client can be constructed
  createOAuthClient();
  return NextResponse.redirect(getGoogleAuthUrl());
}
