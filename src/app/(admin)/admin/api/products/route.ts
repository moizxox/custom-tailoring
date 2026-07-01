import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { revalidateShopPage } from "@/lib/cms/revalidate";
import { buildStoredPriceLabel, parseTierPricing, tierPricingFromForm, type TierKey } from "@/lib/product-tiers";

function buildProductPayload(body: Record<string, unknown>) {
  const name = body.name as string | undefined;
  const slug = body.slug as string | undefined;
  const tierPricingRaw = body.tierPricing;

  let tierPricing = parseTierPricing(tierPricingRaw);
  if (!Object.values(tierPricing).some((tier) => tier?.price?.trim())) {
    tierPricing = tierPricingFromForm(body.tiers as Record<TierKey, { price: string; description: string; enabled: boolean }>);
  }

  const price =
    typeof body.price === "string" && body.price.trim()
      ? body.price.trim()
      : buildStoredPriceLabel(tierPricing);

  return {
    name,
    slug,
    description: typeof body.description === "string" ? body.description : null,
    price,
    category: typeof body.category === "string" ? body.category : "Einzelperson",
    tier: typeof body.tier === "string" ? body.tier : "Standard",
    imageUrl: typeof body.imageUrl === "string" ? body.imageUrl : null,
    galleryUrls: Array.isArray(body.galleryUrls) ? body.galleryUrls : [],
    tierPricing,
    inStock: true,
    sortOrder: Number(body.sortOrder) || 0,
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const products = await prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = buildProductPayload(body);

    if (!data.name || !data.slug || !data.price) {
      return NextResponse.json({ error: "name, slug, and at least one tier price are required" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        category: data.category,
        tier: data.tier,
        imageUrl: data.imageUrl,
        galleryUrls: data.galleryUrls as Prisma.InputJsonValue,
        tierPricing: data.tierPricing as Prisma.InputJsonValue,
        inStock: data.inStock,
        sortOrder: data.sortOrder,
      },
    });

    revalidateShopPage(product.slug);

    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    console.error(err);
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return NextResponse.json({ error: "Dieser Slug ist bereits vergeben." }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
