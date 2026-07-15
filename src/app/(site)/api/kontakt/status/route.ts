import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public, non-sensitive status for ops.
 * Does not expose connection strings — only whether the app can write CRM inquiries.
 */
export async function GET() {
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const count = await prisma.contactSubmission.count();
    return NextResponse.json({
      ok: true,
      contactForm: "ready",
      latencyMs: Date.now() - started,
      submissions: count,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    const missingTable = /does not exist|P2021/i.test(message);
    return NextResponse.json(
      {
        ok: false,
        contactForm: "unavailable",
        reason: missingTable ? "schema_missing" : "db_unreachable",
        latencyMs: Date.now() - started,
      },
      { status: 503 },
    );
  }
}
