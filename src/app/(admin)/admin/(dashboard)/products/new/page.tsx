import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Neues Produkt" };

export default function NewProductPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-sm text-gray-400 hover:text-gray-600">
          ← Produkte
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Neues Produkt</h1>
      </div>
      <ProductForm mode="new" />
    </div>
  );
}
