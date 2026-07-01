import { prisma } from "@/lib/db/prisma";
import {
  buildStoredPriceLabel,
  normalizeTierPricing,
  parseGalleryUrls,
  parseTierPricing,
  type TierPricing,
} from "@/lib/product-tiers";
import { SHOP_PRODUCTS } from "@/lib/site-content";

export interface ShopProductDisplay {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  galleryUrls: string[];
  tierPricing: TierPricing;
  priceLabel: string;
}

export interface ShopProductsResult {
  products: ShopProductDisplay[];
  source: "database" | "static";
}

function mapRow(p: {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: string;
  tier: string;
  imageUrl: string | null;
  galleryUrls: unknown;
  tierPricing: unknown;
}): ShopProductDisplay {
  const tierPricing = normalizeTierPricing(parseTierPricing(p.tierPricing), {
    tier: p.tier,
    price: p.price,
  });
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    description: p.description ?? "",
    imageUrl: p.imageUrl,
    galleryUrls: parseGalleryUrls(p.galleryUrls, p.imageUrl),
    tierPricing,
    priceLabel: buildStoredPriceLabel(tierPricing) || p.price,
  };
}

function staticFallback(): ShopProductsResult {
  return {
    source: "static",
    products: SHOP_PRODUCTS.map((p) => {
      const key = p.qualityTier === "einfach" ? "einfach" : p.qualityTier === "premium" ? "premium" : "standard";
      const tierPricing = { [key]: { price: p.priceFrom } } as TierPricing;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.categoryId,
        description: p.shortDescription,
        imageUrl: p.imageSrc ?? null,
        galleryUrls: p.imageSrc ? [p.imageSrc] : [],
        tierPricing,
        priceLabel: p.priceFrom,
      };
    }),
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
      products: rows.map(mapRow),
    };
  } catch {
    return staticFallback();
  }
}

export async function getShopProductBySlug(slug: string): Promise<ShopProductDisplay | null> {
  try {
    const row = await prisma.product.findUnique({ where: { slug } });
    if (row) return mapRow(row);

    const fallback = SHOP_PRODUCTS.find((p) => p.slug === slug);
    if (!fallback) return null;
    const key = fallback.qualityTier === "einfach" ? "einfach" : fallback.qualityTier === "premium" ? "premium" : "standard";
    const tierPricing = { [key]: { price: fallback.priceFrom } } as TierPricing;
    return {
      id: fallback.id,
      name: fallback.name,
      slug: fallback.slug,
      category: fallback.categoryId,
      description: fallback.shortDescription,
      imageUrl: fallback.imageSrc ?? null,
      galleryUrls: fallback.imageSrc ? [fallback.imageSrc] : [],
      tierPricing,
      priceLabel: fallback.priceFrom,
    };
  } catch {
    return null;
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.product.findMany({ select: { slug: true } });
    if (rows.length > 0) return rows.map((row) => row.slug);
  } catch {
    /* fall through */
  }
  return SHOP_PRODUCTS.map((p) => p.slug);
}
