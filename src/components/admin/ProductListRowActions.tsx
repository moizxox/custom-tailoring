"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ProductDeleteButton from "@/components/admin/ProductDeleteButton";

interface Props {
  productId: string;
  productName: string;
  productSlug: string;
  orderedIds: string[];
  index: number;
}

export default function ProductListRowActions({
  productId,
  productName,
  productSlug,
  orderedIds,
  index,
}: Props) {
  const router = useRouter();
  const t = useTranslations("products");
  const [busy, setBusy] = useState<"dup" | "up" | "down" | null>(null);

  async function persistOrder(nextIds: string[]) {
    const res = await fetch("/admin/api/products/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: nextIds }),
    });
    if (!res.ok) throw new Error("reorder failed");
    router.refresh();
  }

  async function move(direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= orderedIds.length) return;
    setBusy(direction);
    try {
      const next = [...orderedIds];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      await persistOrder(next);
    } finally {
      setBusy(null);
    }
  }

  async function duplicate() {
    setBusy("dup");
    try {
      const res = await fetch(`/admin/api/products/${productId}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error("duplicate failed");
      const product = await res.json();
      router.refresh();
      if (product?.id) router.push(`/admin/products/${product.id}`);
    } finally {
      setBusy(null);
    }
  }

  const isFirst = index === 0;
  const isLast = index === orderedIds.length - 1;

  return (
    <div className="flex items-center gap-2 justify-end flex-wrap">
      <div className="flex items-center gap-0.5 mr-1">
        <button
          type="button"
          onClick={() => move("up")}
          disabled={isFirst || busy !== null}
          className="w-7 h-7 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
          title={t("moveUp")}
          aria-label={t("moveUp")}
        >
          {busy === "up" ? "…" : "↑"}
        </button>
        <button
          type="button"
          onClick={() => move("down")}
          disabled={isLast || busy !== null}
          className="w-7 h-7 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
          title={t("moveDown")}
          aria-label={t("moveDown")}
        >
          {busy === "down" ? "…" : "↓"}
        </button>
      </div>
      <Link href={`/shop/${productSlug}`} target="_blank" className="text-xs font-medium text-gray-500 hover:text-gray-700">
        {t("viewOnSite")}
      </Link>
      <Link
        href={`/admin/products/${productId}`}
        className="text-xs font-medium text-periwinkle-600 hover:text-periwinkle-700"
      >
        {t("edit")}
      </Link>
      <button
        type="button"
        onClick={duplicate}
        disabled={busy !== null}
        className="text-xs font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50"
      >
        {busy === "dup" ? "…" : t("duplicate")}
      </button>
      <ProductDeleteButton productId={productId} productName={productName} />
    </div>
  );
}
