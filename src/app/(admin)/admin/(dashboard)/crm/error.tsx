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
      <p className="text-sm text-gray-500 mb-2">
        Dieser Bereich konnte nicht geladen werden. Meist fehlt die richtige
        Produktions-Datenbank in Vercel, oder die Tabellen wurden dort noch nicht
        angelegt.
      </p>
      <p className="text-xs text-gray-400 mb-6 text-left bg-gray-50 border border-gray-100 rounded-lg p-3">
        Checklist: Vercel → Settings → Environment Variables → Production
        <br />
        1) <code className="text-violet-700">DATABASE_URL</code> = Neon{" "}
        <strong>pooled</strong> URL with <code>?sslmode=require&amp;connect_timeout=15</code>
        <br />
        2) Run against that same URL:{" "}
        <code className="text-violet-700">./scripts/setup-production-db.sh</code>
        <br />
        3) Redeploy, then hard-refresh this page
        {error.digest ? (
          <>
            <br />
            Error digest: <code>{error.digest}</code>
          </>
        ) : null}
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500"
        >
          Erneut versuchen
        </button>
        <Link
          href="/admin"
          onClick={() => reset()}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
        >
          Zum Admin
        </Link>
      </div>
    </div>
  );
}
