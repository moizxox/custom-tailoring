import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { getPageSchema } from "@/lib/cms/page-schemas";
import { resolvePageSchema } from "@/lib/cms/resolve-page-schema";
import { revalidateCmsPage, revalidateCustomPage } from "@/lib/cms/revalidate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function PUT(request: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const schema = await resolvePageSchema(slug);
  if (!schema) return NextResponse.json({ error: "Unknown page slug" }, { status: 404 });

  try {
    const body = (await request.json()) as { order?: unknown; hidden?: unknown };
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
    const orderValue = finalOrder as unknown as Prisma.InputJsonValue;

    const hiddenRaw = Array.isArray(body.hidden) ? body.hidden : [];
    const finalHidden = hiddenRaw.filter(
      (key): key is string => typeof key === "string" && validKeys.has(key),
    );
    const hiddenValue = finalHidden as unknown as Prisma.InputJsonValue;

    await prisma.$transaction([
      prisma.siteSettings.upsert({
        where: { key: `page_order_${slug}` },
        update: { value: orderValue },
        create: { key: `page_order_${slug}`, value: orderValue },
      }),
      prisma.siteSettings.upsert({
        where: { key: `page_hidden_${slug}` },
        update: { value: hiddenValue },
        create: { key: `page_hidden_${slug}`, value: hiddenValue },
      }),
    ]);

    revalidateCmsPage(slug);
    if (!getPageSchema(slug)) revalidateCustomPage(slug);
    return NextResponse.json({ ok: true, order: finalOrder, hidden: finalHidden });
  } catch (err) {
    console.error("[cms] section order save failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 },
    );
  }
}
