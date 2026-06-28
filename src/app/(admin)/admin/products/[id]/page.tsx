import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Produkt bearbeiten" };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  let product = null;
  try {
    product = await prisma.product.findUnique({ where: { id } });
  } catch {
    // DB not available
  }
  if (!product) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-sm text-gray-400 hover:text-gray-600">
          ← Produkte
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
      </div>
      <ProductForm mode="edit" product={product} />
    </div>
  );
}
