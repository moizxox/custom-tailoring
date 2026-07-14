import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { listContactSubmissions, safePage } from "@/lib/crm/contact-submissions";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = req.nextUrl;
    const unreadOnly = searchParams.get("unread") === "true";
    const page = safePage(searchParams.get("page"), 1);
    const take = 25;
    const skip = (page - 1) * take;

    const { submissions, total, unreadCount } = await listContactSubmissions({
      unreadOnly,
      skip,
      take,
    });

    return NextResponse.json({
      submissions,
      total,
      unreadCount,
      page,
      totalPages: Math.max(1, Math.ceil(total / take)),
    });
  } catch (error) {
    console.error("[crm] GET contact-submissions failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
