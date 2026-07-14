import { prisma } from "@/lib/db/prisma";
import { getAdminT } from "@/lib/i18n/admin";
import Link from "next/link";
import type { Metadata } from "next";
import ProductListRowActions from "@/components/admin/ProductListRowActions";
import { getEnabledTiers, normalizeTierPricing, parseTierPricing } from "@/lib/product-tiers";

export const metadata: Metadata = { title: "Products" };

async function getProducts() {
  try {
    return await prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  } catch {
    return [];
  }
}

export default async function ProductsListPage() {
  const products = await getProducts();
  const t = getAdminT("products");
  const orderedIds = products.map((p) => p.id);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t("count", { count: products.length })}</p>
          {products.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">{t("reorderHint")}</p>
          )}
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-periwinkle-600 hover:bg-periwinkle-700 text-white text-sm font-medium rounded-lg transition"
        >
          + {t("newProduct")}
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">{t("empty")}</p>
          <Link href="/admin/products/new" className="mt-3 inline-block text-sm text-periwinkle-600 hover:underline">
            {t("addProductLink")} →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 w-12">#</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">{t("columnProduct")}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden sm:table-cell">{t("columnCategory")}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden md:table-cell">{t("columnTiers")}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden sm:table-cell">{t("columnPrice")}</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product, index) => {
                const tierPricing = normalizeTierPricing(parseTierPricing(product.tierPricing), {
                  tier: product.tier,
                  price: product.price,
                });
                const tierCount = getEnabledTiers(tierPricing).length;
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">{index + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 hidden sm:table-cell">{product.category}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-gray-600">{tierCount} / 3</td>
                    <td className="px-5 py-3.5 text-gray-600 hidden sm:table-cell">{product.price}</td>
                    <td className="px-5 py-3.5">
                      <ProductListRowActions
                        productId={product.id}
                        productName={product.name}
                        productSlug={product.slug}
                        orderedIds={orderedIds}
                        index={index}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
