import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";
import {
  isValidCustomSlug,
  normalizeCustomPageContent,
} from "@/lib/cms/custom-pages";
import { isReservedCustomSlug } from "@/lib/cms/custom-page-routes";
import { revalidateCustomPage } from "@/lib/cms/revalidate";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const page = await prisma.customPage.findUnique({ where: { id } });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    page: {
      ...page,
      content: normalizeCustomPageContent(page.content),
    },
  });
}

export async function PUT(request: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const existing = await prisma.customPage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : existing.title;
    if (!title) {
      return NextResponse.json({ error: "Titel ist erforderlich." }, { status: 400 });
    }

    let slug = existing.slug;
    if (typeof body.slug === "string" && body.slug.trim()) {
      slug = body.slug.trim().toLowerCase();
      if (!isValidCustomSlug(slug)) {
        return NextResponse.json(
          { error: "Ungültiger Slug. Nur Kleinbuchstaben, Zahlen und Bindestriche." },
          { status: 400 },
        );
      }
      if (slug !== existing.slug) {
        if (isReservedCustomSlug(slug)) {
          return NextResponse.json(
            { error: "Dieser Slug ist bereits für eine Website-Seite oder System-Route reserviert." },
            { status: 409 },
          );
        }
        const clash = await prisma.customPage.findUnique({ where: { slug } });
        if (clash) {
          return NextResponse.json({ error: "Dieser Slug ist bereits vergeben." }, { status: 409 });
        }
        // Move Flex-Baustein content + order to the new slug
        await prisma.$transaction([
          prisma.pageContent.updateMany({
            where: { pageSlug: existing.slug },
            data: { pageSlug: slug },
          }),
          prisma.siteSettings.deleteMany({
            where: {
              key: { in: [`page_order_${slug}`, `page_hidden_${slug}`] },
            },
          }),
        ]);
        const [orderRow, hiddenRow] = await Promise.all([
          prisma.siteSettings.findUnique({ where: { key: `page_order_${existing.slug}` } }),
          prisma.siteSettings.findUnique({ where: { key: `page_hidden_${existing.slug}` } }),
        ]);
        if (orderRow) {
          await prisma.siteSettings.upsert({
            where: { key: `page_order_${slug}` },
            update: { value: orderRow.value as Prisma.InputJsonValue },
            create: { key: `page_order_${slug}`, value: orderRow.value as Prisma.InputJsonValue },
          });
          await prisma.siteSettings.delete({ where: { key: `page_order_${existing.slug}` } }).catch(() => null);
        }
        if (hiddenRow) {
          await prisma.siteSettings.upsert({
            where: { key: `page_hidden_${slug}` },
            update: { value: hiddenRow.value as Prisma.InputJsonValue },
            create: { key: `page_hidden_${slug}`, value: hiddenRow.value as Prisma.InputJsonValue },
          });
          await prisma.siteSettings.delete({ where: { key: `page_hidden_${existing.slug}` } }).catch(() => null);
        }
      }
    }

    const page = await prisma.customPage.update({
      where: { id },
      data: {
        title,
        slug,
        navLabel:
          body.navLabel === null || body.navLabel === undefined
            ? existing.navLabel
            : typeof body.navLabel === "string"
              ? body.navLabel.trim() || null
              : existing.navLabel,
        published: typeof body.published === "boolean" ? body.published : existing.published,
        content:
          body.content !== undefined
            ? (normalizeCustomPageContent(body.content) as unknown as Prisma.InputJsonValue)
            : undefined,
      },
    });

    revalidateCustomPage(existing.slug);
    if (page.slug !== existing.slug) revalidateCustomPage(page.slug);

    return NextResponse.json({
      page: { ...page, content: normalizeCustomPageContent(page.content) },
    });
  } catch (err) {
    console.error("[custom-pages] update failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const existing = await prisma.customPage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.customPage.delete({ where: { id } });
    revalidateCustomPage(existing.slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[custom-pages] delete failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
