"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ImageIcon, Plus, Trash2 } from "lucide-react";
import type { Product } from "@prisma/client";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import {
  buildStoredPriceLabel,
  normalizeTierPricing,
  parseGalleryUrls,
  parseTierPricing,
  TIER_KEYS,
  TIER_LABELS,
  tierPricingFromForm,
  tierPricingToForm,
  type TierKey,
} from "@/lib/product-tiers";

type TierFormRow = { price: string; description: string; enabled: boolean };

type FormData = {
  name: string;
  slug: string;
  description: string;
  category: string;
  imageUrl: string;
  galleryUrls: string[];
  tiers: Record<TierKey, TierFormRow>;
  sortOrder: string;
};

interface ProductFormProps {
  product?: Product;
  mode: "new" | "edit";
}

const CATEGORIES = ["Einzelperson", "Gruppe", "Veredelung", "Sonstiges"];

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function initialForm(product?: Product): FormData {
  const tierPricing = normalizeTierPricing(parseTierPricing(product?.tierPricing), {
    tier: product?.tier,
    price: product?.price,
  });
  const gallery = parseGalleryUrls(product?.galleryUrls, product?.imageUrl);
  const cover = gallery[0] ?? product?.imageUrl ?? "";
  const extraGallery = gallery.slice(1);

  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    category: product?.category ?? "Einzelperson",
    imageUrl: cover,
    galleryUrls: extraGallery,
    tiers: tierPricingToForm(tierPricing),
    sortOrder: String(product?.sortOrder ?? 0),
  };
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const [form, setForm] = useState<FormData>(() => initialForm(product));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mediaPicker, setMediaPicker] = useState<"cover" | "gallery" | null>(null);

  const previewPrice = buildStoredPriceLabel(tierPricingFromForm(form.tiers));

  function handleChange<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && mode === "new") {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  function updateTier(key: TierKey, patch: Partial<TierFormRow>) {
    setForm((prev) => ({
      ...prev,
      tiers: {
        ...prev.tiers,
        [key]: { ...prev.tiers[key], ...patch },
      },
    }));
  }

  function removeGalleryImage(index: number) {
    setForm((prev) => ({
      ...prev,
      galleryUrls: prev.galleryUrls.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const tierPricing = tierPricingFromForm(form.tiers);
    const enabledCount = TIER_KEYS.filter((key) => tierPricing[key]?.price).length;
    if (enabledCount === 0) {
      setError("Bitte mindestens eine Qualitätsstufe mit Preis angeben.");
      return;
    }

    setLoading(true);
    const price = buildStoredPriceLabel(tierPricing);
    const firstTierKey = TIER_KEYS.find((key) => tierPricing[key]?.price) ?? "standard";

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price,
      category: form.category,
      tier: TIER_LABELS[firstTierKey],
      imageUrl: form.imageUrl || null,
      galleryUrls: form.galleryUrls.filter(Boolean),
      tierPricing,
      inStock: true,
      sortOrder: parseInt(form.sortOrder, 10) || 0,
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
              placeholder="3-teiliges-waggis-kostuem"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("descriptionLabel")}</label>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition resize-y"
            placeholder="Produktbeschreibung für die Detailseite…"
          />
        </div>

        <div className="w-full sm:w-64">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("categoryLabel")}</label>
          <select
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{t("imagesSection")}</h2>
        <p className="text-xs text-gray-500">{t("imagesHint")}</p>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("coverImageLabel")}</label>
          {form.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.imageUrl} alt="" className="w-40 h-28 rounded-lg object-cover border border-gray-200 mb-2" />
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
              onClick={() => setMediaPicker("cover")}
              className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white whitespace-nowrap"
            >
              <ImageIcon className="w-4 h-4" /> Pick
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("galleryImagesLabel")}</label>
          <div className="space-y-2">
            {form.galleryUrls.map((url, index) => (
              <div key={`${url}-${index}`} className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-16 h-12 rounded object-cover border border-gray-200 shrink-0" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    const next = [...form.galleryUrls];
                    next[index] = e.target.value;
                    handleChange("galleryUrls", next);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button type="button" onClick={() => removeGalleryImage(index)} className="p-2 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setMediaPicker("gallery")}
              className="flex items-center gap-2 text-sm text-periwinkle-600 hover:text-periwinkle-700"
            >
              <Plus className="w-4 h-4" /> {t("addGalleryImage")}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{t("tierPricingSection")}</h2>
            <p className="text-xs text-gray-500 mt-1">{t("tierPricingHint")}</p>
          </div>
          {previewPrice && <span className="text-sm font-medium text-periwinkle-700">{previewPrice}</span>}
        </div>

        <div className="space-y-4">
          {TIER_KEYS.map((key) => (
            <div key={key} className="rounded-xl border border-gray-200 p-4 space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.tiers[key].enabled}
                  onChange={(e) => updateTier(key, { enabled: e.target.checked })}
                  className="rounded border-gray-300 text-periwinkle-600 focus:ring-periwinkle-500"
                />
                <span className="text-sm font-medium text-gray-800">{TIER_LABELS[key]}</span>
              </label>
              {form.tiers[key].enabled && (
                <>
                  <input
                    type="text"
                    value={form.tiers[key].price}
                    onChange={(e) => updateTier(key, { price: e.target.value })}
                    placeholder={t("tierPricePlaceholder")}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm"
                  />
                  <textarea
                    rows={2}
                    value={form.tiers[key].description}
                    onChange={(e) => updateTier(key, { description: e.target.value })}
                    placeholder={t("tierDescriptionPlaceholder")}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm resize-y"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <label className="block text-xs font-medium text-gray-700 mb-1.5">{t("sortOrderLabel")}</label>
        <input
          type="number"
          min={0}
          value={form.sortOrder}
          onChange={(e) => handleChange("sortOrder", e.target.value)}
          className="w-32 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
        />
      </div>

      {mediaPicker && (
        <MediaPickerModal
          onSelect={(url) => {
            if (mediaPicker === "cover") handleChange("imageUrl", url);
            else handleChange("galleryUrls", [...form.galleryUrls, url]);
            setMediaPicker(null);
          }}
          onClose={() => setMediaPicker(null)}
        />
      )}

      {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-periwinkle-600 hover:bg-periwinkle-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
        >
          {loading ? `${t("saveChanges")}…` : mode === "new" ? t("createProduct") : t("saveChanges")}
        </button>
        <Link href="/admin/products" className="px-5 py-2.5 border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition">
          {t("cancel")}
        </Link>
        {mode === "edit" && product?.slug && (
          <Link href={`/shop/${product.slug}`} target="_blank" className="text-sm text-periwinkle-600 hover:underline ml-auto">
            {t("viewOnSite")} →
          </Link>
        )}
      </div>
    </form>
  );
}
