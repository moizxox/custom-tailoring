import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { google } from "googleapis";
import { createOAuthClient, saveGoogleTokens } from "@/lib/google/calendar";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://kostuemschneiderei.ch";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/admin/login", APP_URL));
  }

  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/admin/crm/bookings?gcal=error&msg=${encodeURIComponent(error)}`, APP_URL));
  }
  if (!code) {
    return NextResponse.redirect(new URL("/admin/crm/bookings?gcal=error&msg=missing_code", APP_URL));
  }

  try {
    const oauth2 = createOAuthClient();
    const { tokens } = await oauth2.getToken(code);
    oauth2.setCredentials(tokens);

    let email: string | null = null;
    try {
      const oauth2api = google.oauth2({ version: "v2", auth: oauth2 });
      const me = await oauth2api.userinfo.get();
      email = me.data.email ?? null;
    } catch {
      // optional profile
    }

    await saveGoogleTokens({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
      token_type: tokens.token_type,
      scope: tokens.scope,
      email,
      connectedAt: new Date().toISOString(),
    });

    return NextResponse.redirect(new URL("/admin/crm/bookings?gcal=connected", APP_URL));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "token_exchange_failed";
    return NextResponse.redirect(new URL(`/admin/crm/bookings?gcal=error&msg=${encodeURIComponent(msg)}`, APP_URL));
  }
}
