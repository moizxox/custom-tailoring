"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface Props {
  productId: string;
  productName: string;
}

export default function ProductDeleteButton({ productId, productName }: Props) {
  const router = useRouter();
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch(`/admin/api/products/${productId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-1.5 text-xs">
        <button onClick={handleDelete} disabled={loading} className="text-red-600 hover:underline">
          {loading ? "…" : t("deleteConfirm")}
        </button>
        <span className="text-gray-300">|</span>
        <button onClick={() => setConfirming(false)} className="text-gray-500 hover:underline">
          {tc("cancel")}
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-red-500 hover:text-red-700"
      title={t("deleteTitle", { name: productName })}
    >
      {t("delete")}
    </button>
  );
}
