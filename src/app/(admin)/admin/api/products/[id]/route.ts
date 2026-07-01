import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { revalidateShopPage } from "@/lib/cms/revalidate";
import { buildStoredPriceLabel, parseTierPricing, tierPricingFromForm, type TierKey } from "@/lib/product-tiers";

interface Props {
  params: Promise<{ id: string }>;
}

function buildProductPayload(body: Record<string, unknown>) {
  const tierPricingRaw = body.tierPricing;
  let tierPricing = parseTierPricing(tierPricingRaw);
  if (!Object.values(tierPricing).some((tier) => tier?.price?.trim())) {
    tierPricing = tierPricingFromForm(body.tiers as Record<TierKey, { price: string; description: string; enabled: boolean }>);
  }

  const price =
    typeof body.price === "string" && body.price.trim()
      ? body.price.trim()
      : buildStoredPriceLabel(tierPricing);

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.slug !== undefined) data.slug = body.slug;
  if (body.description !== undefined) data.description = body.description || null;
  if (price) data.price = price;
  if (body.category !== undefined) data.category = body.category;
  if (body.tier !== undefined) data.tier = body.tier;
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl || null;
  if (body.galleryUrls !== undefined) data.galleryUrls = body.galleryUrls as Prisma.InputJsonValue;
  if (tierPricingRaw !== undefined || body.tiers !== undefined) data.tierPricing = tierPricing as Prisma.InputJsonValue;
  data.inStock = true;
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder) || 0;
  return data;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await request.json();
    const data = buildProductPayload(body);
    const product = await prisma.product.update({ where: { id }, data });
    revalidateShopPage(product.slug);
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const product = await prisma.product.delete({ where: { id } });
    revalidateShopPage(product.slug);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
