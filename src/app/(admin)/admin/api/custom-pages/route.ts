import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";
import {
  EMPTY_CUSTOM_PAGE_CONTENT,
  isValidCustomSlug,
  normalizeCustomPageContent,
  slugifyPageTitle,
} from "@/lib/cms/custom-pages";
import { getPageSchema } from "@/lib/cms/page-schemas";
import { revalidateCustomPage } from "@/lib/cms/revalidate";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pages = await prisma.customPage.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      navLabel: true,
      published: true,
      updatedAt: true,
    },
  });
  return NextResponse.json({ pages });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json({ error: "Titel ist erforderlich." }, { status: 400 });
    }

    const slug =
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug.trim().toLowerCase()
        : slugifyPageTitle(title);

    if (!isValidCustomSlug(slug)) {
      return NextResponse.json(
        { error: "Ungültiger Slug. Nur Kleinbuchstaben, Zahlen und Bindestriche." },
        { status: 400 },
      );
    }

    if (getPageSchema(slug)) {
      return NextResponse.json(
        { error: "Dieser Slug ist für eine feste Website-Seite reserviert." },
        { status: 409 },
      );
    }

    const existing = await prisma.customPage.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Dieser Slug ist bereits vergeben." }, { status: 409 });
    }

    const content = normalizeCustomPageContent({
      ...EMPTY_CUSTOM_PAGE_CONTENT,
      hero: {
        ...EMPTY_CUSTOM_PAGE_CONTENT.hero,
        title,
      },
    });

    const page = await prisma.customPage.create({
      data: {
        title,
        slug,
        navLabel: typeof body.navLabel === "string" ? body.navLabel.trim() || null : null,
        published: Boolean(body.published),
        content: content as unknown as Prisma.InputJsonValue,
      },
    });

    if (page.published) revalidateCustomPage(page.slug);

    return NextResponse.json({ page });
  } catch (err) {
    console.error("[custom-pages] create failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
