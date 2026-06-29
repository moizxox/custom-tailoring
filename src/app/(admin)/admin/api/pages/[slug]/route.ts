import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { getPageSchema } from "@/lib/cms/page-schemas";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  try {
    const rows = await prisma.pageContent.findMany({ where: { pageSlug: slug } });
    const content = Object.fromEntries(rows.map((r) => [r.sectionKey, r.content]));
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const schema = getPageSchema(slug);
  if (!schema) return NextResponse.json({ error: "Unknown page slug" }, { status: 404 });

  try {
    const { sectionKey, content } = await request.json();
    if (!sectionKey || !content) {
      return NextResponse.json({ error: "sectionKey and content required" }, { status: 400 });
    }

    await prisma.pageContent.upsert({
      where: { pageSlug_sectionKey: { pageSlug: slug, sectionKey } },
      update: { content },
      create: { pageSlug: slug, sectionKey, content },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
