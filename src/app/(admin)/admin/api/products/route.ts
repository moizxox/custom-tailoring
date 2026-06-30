import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { revalidateShopPage } from "@/lib/cms/revalidate";

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
    const { name, slug, description, price, category, tier, imageUrl, inStock, sortOrder } = body;

    if (!name || !slug || !price) {
      return NextResponse.json({ error: "name, slug, and price are required" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price,
        category: category || "Einzelperson",
        tier: tier || "Standard",
        imageUrl: imageUrl || null,
        inStock: Boolean(inStock),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    revalidateShopPage();

    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    console.error(err);
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Dieser Slug ist bereits vergeben." }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
