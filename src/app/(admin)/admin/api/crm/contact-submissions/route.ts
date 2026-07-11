import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { listContactSubmissions } from "@/lib/crm/contact-submissions";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const unreadOnly = searchParams.get("unread") === "true";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const take = 25;
  const skip = (page - 1) * take;

  const { submissions, total, unreadCount } = await listContactSubmissions({
    unreadOnly,
    skip,
    take,
  });

  return NextResponse.json({ submissions, total, unreadCount, page, totalPages: Math.ceil(total / take) });
}
