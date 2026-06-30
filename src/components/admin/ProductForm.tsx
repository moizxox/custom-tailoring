"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import type { Product } from "@prisma/client";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

type FormData = {
  name: string;
  slug: string;
  description: string;
  price: string;
  category: string;
  tier: string;
  imageUrl: string;
  inStock: boolean;
  sortOrder: string;
};

interface ProductFormProps {
  product?: Product;
  mode: "new" | "edit";
}

const TIERS = ["Einfach", "Standard", "Premium"];
const CATEGORIES = ["Einzelperson", "Gruppe", "Veredelung", "Sonstiges"];

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const [form, setForm] = useState<FormData>({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    category: product?.category ?? "Einzelperson",
    tier: product?.tier ?? "Standard",
    imageUrl: product?.imageUrl ?? "",
    inStock: product?.inStock ?? true,
    sortOrder: String(product?.sortOrder ?? 0),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  function handleChange(key: keyof FormData, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && mode === "new") {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      sortOrder: parseInt(form.sortOrder) || 0,
    };

    const url = mode === "new" ? "/admin/api/products" : `/admin/api/products/${product!.id}`;
    const method = mode === "new" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? t("saveError"));
      } else {
        router.push("/admin/products");
        router.refresh();
      }
    } catch {
      setError(tc("networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{t("productData")}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("nameLabel")} *</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
              placeholder={t("namePlaceholder")}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("slugLabel")} *</label>
            <input
              required
              type="text"
              value={form.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
              placeholder="einzelkostum-premium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("descriptionLabel")}</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition resize-y"
            placeholder={t("descriptionPlaceholder")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("priceLabel")} *</label>
            <input
              required
              type="text"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
              placeholder={t("pricePlaceholder")}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("categoryLabel")}</label>
            <select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition bg-white"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("tierLabel")}</label>
            <select
              value={form.tier}
              onChange={(e) => handleChange("tier", e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition bg-white"
            >
              {TIERS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{t("imageAndStatus")}</h2>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("imageUrlLabel")}</label>
          {form.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.imageUrl} alt="" className="w-32 h-20 rounded-lg object-cover border border-gray-200 mb-2" />
          )}
          <div className="flex gap-2">
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
              placeholder="https://res.cloudinary.com/…"
            />
            <button
              type="button"
              onClick={() => setMediaPickerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white whitespace-nowrap"
            >
              <ImageIcon className="w-4 h-4" /> Pick
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleChange("inStock", !form.inStock)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:ring-offset-2 ${form.inStock ? "bg-periwinkle-600" : "bg-gray-200"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${form.inStock ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <span className="text-sm text-gray-700">{t("inStockLabel")}</span>
        </div>

        <div className="w-32">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("sortOrderLabel")}</label>
          <input
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => handleChange("sortOrder", e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {mediaPickerOpen && (
        <MediaPickerModal
          onSelect={(url) => {
            handleChange("imageUrl", url);
            setMediaPickerOpen(false);
          }}
          onClose={() => setMediaPickerOpen(false)}
        />
      )}

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-periwinkle-600 hover:bg-periwinkle-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
        >
          {loading ? t("saveChanges") + "…" : mode === "new" ? t("createProduct") : t("saveChanges")}
        </button>
        <Link href="/admin/products" className="px-5 py-2.5 border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition">
          {t("cancel")}
        </Link>
      </div>
    </form>
  );
}
