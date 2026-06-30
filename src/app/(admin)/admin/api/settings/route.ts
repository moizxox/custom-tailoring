import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { revalidateSiteShell } from "@/lib/cms/revalidate";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await prisma.siteSettings.findMany();
    return NextResponse.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const updates = Object.entries(body);

    for (const [key, value] of updates) {
      await prisma.siteSettings.upsert({
        where: { key },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        update: { value: value as any },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        create: { key, value: value as any },
      });
    }

    revalidateSiteShell();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
