import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { getPageSchema } from "@/lib/cms/page-schemas";
import { revalidateCmsPage } from "@/lib/cms/revalidate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function PUT(request: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const schema = getPageSchema(slug);
  if (!schema) return NextResponse.json({ error: "Unknown page slug" }, { status: 404 });

  try {
    const body = (await request.json()) as { order?: unknown };
    if (!Array.isArray(body.order) || !body.order.every((k) => typeof k === "string")) {
      return NextResponse.json({ error: "order array of section keys required" }, { status: 400 });
    }

    const validKeys = new Set(schema.sections.map((s) => s.key));
    const sanitized = (body.order as string[]).filter((key) => validKeys.has(key));
    if (sanitized.length === 0) {
      return NextResponse.json({ error: "No valid section keys in order" }, { status: 400 });
    }
    const missing = schema.sections.map((s) => s.key).filter((key) => !sanitized.includes(key));
    const finalOrder = [...sanitized, ...missing];
    const value = finalOrder as unknown as Prisma.InputJsonValue;

    await prisma.siteSettings.upsert({
      where: { key: `page_order_${slug}` },
      update: { value },
      create: { key: `page_order_${slug}`, value },
    });

    revalidateCmsPage(slug);
    return NextResponse.json({ ok: true, order: finalOrder });
  } catch (err) {
    console.error("[cms] section order save failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
