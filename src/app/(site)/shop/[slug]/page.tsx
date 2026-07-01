import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/shop/ProductDetailView";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { splitLines } from "@/lib/cms/section-helpers";
import { getShopProductBySlug } from "@/lib/products";
import type { ShopTierDefinition } from "@/lib/product-tiers";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getShopProductBySlug(slug);
  if (!product) return { title: "Produkt nicht gefunden" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ShopProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, tiersContent] = await Promise.all([
    getShopProductBySlug(slug),
    getCmsContent("shop", "tiers", {}),
  ]);
  if (!product) notFound();

  const tiersDefaults = getDefaultSectionContent("shop", "tiers");
  const tiersData = { ...tiersDefaults, ...tiersContent } as {
    items?: Array<{ name: string; tagline: string; features: string }>;
  };
  const tierDefinitions: ShopTierDefinition[] = (tiersData.items ?? []).map((item) => ({
    name: item.name,
    tagline: item.tagline,
    features: splitLines(item.features),
  }));

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Slim breadcrumb bar */}
      <div className="border-b border-stone-light bg-white">
        <div className="container-site py-3">
          <nav className="flex items-center gap-2 font-sans text-[12px] text-charcoal-lighter">
            <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-charcoal transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-charcoal font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product content */}
      <section className="py-10 sm:py-14">
        <div className="container-site">
          <ProductDetailView
            product={{
              name: product.name,
              slug: product.slug,
              category: product.category,
              description: product.description,
              galleryUrls: product.galleryUrls,
              tierPricing: product.tierPricing,
            }}
            tierDefinitions={tierDefinitions}
          />
        </div>
      </section>
    </div>
  );
}
