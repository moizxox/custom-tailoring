"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  inStock: boolean;
}

export default function ProductStockToggle({ productId, inStock }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(inStock);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const next = !value;
    setValue(next);
    try {
      await fetch(`/admin/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: next }),
      });
      router.refresh();
    } catch {
      setValue(!next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 focus:outline-none ${value ? "bg-periwinkle-600" : "bg-gray-200"}`}
      title={value ? "Auf Lager" : "Nicht auf Lager"}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${value ? "translate-x-4.5" : "translate-x-0.5"}`} />
    </button>
  );
}
