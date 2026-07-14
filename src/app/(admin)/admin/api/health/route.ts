import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Admin-only DB + env health probe for diagnosing Vercel CRM failures. */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const checks: Record<string, unknown> = {
    ok: false,
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasAuthSecret: Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
    nextAuthUrl: process.env.NEXTAUTH_URL ?? null,
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? null,
    databaseHost: null as string | null,
  };

  try {
    if (process.env.DATABASE_URL) {
      checks.databaseHost = new URL(process.env.DATABASE_URL).hostname;
    }
  } catch {
    checks.databaseHost = "invalid-url";
  }

  try {
    const started = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const [
      admins,
      submissions,
      customers,
      projects,
      products,
      pageContent,
    ] = await Promise.all([
      prisma.admin.count(),
      prisma.contactSubmission.count(),
      prisma.customer.count(),
      prisma.project.count(),
      prisma.product.count(),
      prisma.pageContent.count(),
    ]);

    checks.ok = true;
    checks.latencyMs = Date.now() - started;
    checks.counts = {
      admins,
      contactSubmissions: submissions,
      customers,
      projects,
      products,
      pageContent,
    };
    return NextResponse.json(checks);
  } catch (error) {
    checks.ok = false;
    checks.dbError =
      error instanceof Error ? error.message : "Unknown database error";
    return NextResponse.json(checks, { status: 503 });
  }
}
