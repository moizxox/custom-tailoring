"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { slugifyPageTitle } from "@/lib/cms/custom-pages";

interface CustomPageRow {
  id: string;
  slug: string;
  title: string;
  navLabel: string | null;
  published: boolean;
  updatedAt: string;
}

export function CustomPagesSection({ initialPages }: { initialPages: CustomPageRow[] }) {
  const router = useRouter();
  const [pages, setPages] = useState(initialPages);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function createPage(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/admin/api/custom-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || slugifyPageTitle(title),
          published: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Seite konnte nicht erstellt werden.");
        return;
      }
      router.push(`/admin/pages/custom/${data.page.id}`);
      router.refresh();
    } catch {
      setError("Verbindungsfehler.");
    } finally {
      setSaving(false);
    }
  }

  async function removePage(id: string, pageTitle: string) {
    if (!confirm(`Seite «${pageTitle}» wirklich löschen?`)) return;
    const res = await fetch(`/admin/api/custom-pages/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Löschen fehlgeschlagen.");
      return;
    }
    setPages((prev) => prev.filter((p) => p.id !== id));
    router.refresh();
  }

  return (
    <div className="mt-10">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Eigene Seiten</h2>
          <p className="text-sm text-gray-500 mt-1">
            Neue Inhaltsseiten unter <code className="text-xs bg-gray-100 px-1 rounded">/seite/…</code> —
            danach in Navigation verlinken.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 px-3.5 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700"
        >
          {open ? "Abbrechen" : "Neue Seite"}
        </button>
      </div>

      {open && (
        <form
          onSubmit={createPage}
          className="mb-4 bg-white border border-violet-100 rounded-xl p-4 flex flex-col gap-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-gray-600">
              Titel
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug || slug === slugifyPageTitle(title)) {
                    setSlug(slugifyPageTitle(e.target.value));
                  }
                }}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="block text-xs font-medium text-gray-600">
              Slug (URL)
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="meine-seite"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono"
              />
            </label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="self-start px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Erstellen…" : "Seite erstellen"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {pages.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-500 text-center">Noch keine eigenen Seiten.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Seite</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Pfad</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{page.title}</td>
                  <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">/seite/{page.slug}</td>
                  <td className="px-5 py-3.5">
                    {page.published ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Veröffentlicht
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                        Entwurf
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-3">
                    <Link
                      href={`/admin/pages/custom/${page.id}`}
                      className="text-xs font-medium text-periwinkle-600 hover:text-periwinkle-700"
                    >
                      Bearbeiten →
                    </Link>
                    <button
                      type="button"
                      onClick={() => removePage(page.id, page.title)}
                      className="text-xs font-medium text-red-500 hover:text-red-600"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
