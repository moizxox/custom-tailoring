import { NextRequest, NextResponse } from "next/server";
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
    const { order } = (await request.json()) as { order?: string[] };
    if (!Array.isArray(order)) {
      return NextResponse.json({ error: "order array required" }, { status: 400 });
    }

    const validKeys = new Set(schema.sections.map((s) => s.key));
    const sanitized = order.filter((key) => validKeys.has(key));
    const missing = schema.sections.map((s) => s.key).filter((key) => !sanitized.includes(key));
    const finalOrder = [...sanitized, ...missing];

    await prisma.siteSettings.upsert({
      where: { key: `page_order_${slug}` },
      update: { value: finalOrder },
      create: { key: `page_order_${slug}`, value: finalOrder },
    });

    revalidateCmsPage(slug);
    return NextResponse.json({ ok: true, order: finalOrder });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
