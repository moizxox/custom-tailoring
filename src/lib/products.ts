import { prisma } from "@/lib/db/prisma";
import { SHOP_PRODUCTS } from "@/lib/site-content";

export interface ShopProductDisplay {
  id: string;
  name: string;
  slug: string;
  category: string;
  tier: string;
  price: string;
  description: string;
  imageUrl?: string | null;
  inStock: boolean;
}

export interface ShopProductsResult {
  products: ShopProductDisplay[];
  source: "database" | "static";
}

function staticFallback(): ShopProductsResult {
  return {
    source: "static",
    products: SHOP_PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.categoryId,
      tier: p.qualityTier ?? "Standard",
      price: p.priceFrom,
      description: p.shortDescription,
      imageUrl: p.imageSrc ?? null,
      inStock: p.inStock ?? true,
    })),
  };
}

/** Products managed in Admin → Products (Prisma). Falls back to static examples if DB is empty. */
export async function getShopProducts(): Promise<ShopProductsResult> {
  try {
    const rows = await prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length === 0) return staticFallback();
    return {
      source: "database",
      products: rows.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        tier: p.tier,
        price: p.price,
        description: p.description ?? "",
        imageUrl: p.imageUrl,
        inStock: p.inStock,
      })),
    };
  } catch {
    return staticFallback();
  }
}
