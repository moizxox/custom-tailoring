import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { clearGoogleTokens } from "@/lib/google/calendar";

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await clearGoogleTokens();
  return NextResponse.json({ ok: true });
}
