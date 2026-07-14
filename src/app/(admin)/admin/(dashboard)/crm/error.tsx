"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CrmError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[crm]", error);
  }, [error]);

  return (
    <div className="p-6 md:p-8 max-w-lg mx-auto text-center">
      <h1 className="text-xl font-semibold text-gray-900 mb-2">CRM-Fehler</h1>
      <p className="text-sm text-gray-500 mb-6">
        Dieser Bereich konnte nicht geladen werden. Oft fehlt die Datenbankverbindung oder eine Tabelle.
        Bitte prüfen Sie DATABASE_URL in Vercel und führen Sie prisma db push aus.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500"
        >
          Erneut versuchen
        </button>
        <Link href="/admin/crm" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
          Zum CRM
        </Link>
      </div>
    </div>
  );
}
