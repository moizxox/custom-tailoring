import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { revalidateSiteShell } from "@/lib/cms/revalidate";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as { key: "navigation" | "footer"; value: unknown };
  if (!body.key || body.value === undefined) {
    return NextResponse.json({ error: "key and value required" }, { status: 400 });
  }

  await prisma.siteSettings.upsert({
    where: { key: body.key },
    update: { value: body.value as never },
    create: { key: body.key, value: body.value as never },
  });

  revalidateSiteShell();

  return NextResponse.json({ ok: true });
}
