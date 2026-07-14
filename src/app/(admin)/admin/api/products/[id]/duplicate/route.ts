import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { revalidateShopPage } from "@/lib/cms/revalidate";

interface Props {
  params: Promise<{ id: string }>;
}

async function uniqueSlug(base: string): Promise<string> {
  const root = base.replace(/-kopie(-\d+)?$/i, "").replace(/-copy(-\d+)?$/i, "");
  let candidate = `${root}-kopie`;
  for (let n = 2; n < 1000; n += 1) {
    const existing = await prisma.product.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
    candidate = `${root}-kopie-${n}`;
  }
  return `${root}-kopie-${Date.now()}`;
}

export async function POST(_req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const source = await prisma.product.findUnique({ where: { id } });
    if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const maxOrder = await prisma.product.aggregate({ _max: { sortOrder: true } });
    const slug = await uniqueSlug(source.slug);
    const nameBase = source.name.replace(/\s*\(Kopie(?:\s+\d+)?\)\s*$/i, "").trim();
    let name = `${nameBase} (Kopie)`;
    const nameTaken = await prisma.product.findFirst({ where: { name } });
    if (nameTaken) {
      let n = 2;
      while (await prisma.product.findFirst({ where: { name: `${nameBase} (Kopie ${n})` } })) {
        n += 1;
      }
      name = `${nameBase} (Kopie ${n})`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: source.description,
        price: source.price,
        category: source.category,
        tier: source.tier,
        imageUrl: source.imageUrl,
        galleryUrls: source.galleryUrls as Prisma.InputJsonValue,
        tierPricing: source.tierPricing as Prisma.InputJsonValue,
        inStock: source.inStock,
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      },
    });

    revalidateShopPage(product.slug);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
