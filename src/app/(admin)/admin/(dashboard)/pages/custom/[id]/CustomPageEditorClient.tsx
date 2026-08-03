"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CustomPageBlock, CustomPageContent } from "@/lib/cms/custom-pages";
import { slugifyPageTitle } from "@/lib/cms/custom-pages";

interface PageData {
  id: string;
  slug: string;
  title: string;
  navLabel: string | null;
  published: boolean;
  content: CustomPageContent;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function CustomPageEditorClient({ initial }: { initial: PageData }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugManual, setSlugManual] = useState(true);
  const [navLabel, setNavLabel] = useState(initial.navLabel ?? "");
  const [published, setPublished] = useState(initial.published);
  const [content, setContent] = useState<CustomPageContent>(initial.content);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateHero(patch: Partial<CustomPageContent["hero"]>) {
    setContent((c) => ({ ...c, hero: { ...c.hero, ...patch } }));
  }

  function updateBlock(id: string, patch: Partial<CustomPageBlock>) {
    setContent((c) => ({
      ...c,
      blocks: c.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));
  }

  function addBlock() {
    setContent((c) => ({
      ...c,
      blocks: [...c.blocks, { id: uid(), title: "Neuer Abschnitt", body: "" }],
    }));
  }

  function removeBlock(id: string) {
    setContent((c) => ({ ...c, blocks: c.blocks.filter((b) => b.id !== id) }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/admin/api/custom-pages/${initial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          navLabel: navLabel.trim() || null,
          published,
          content: {
            ...content,
            hero: {
              ...content.hero,
              title: content.hero.title || title.trim(),
            },
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Speichern fehlgeschlagen.");
        return;
      }
      setSlug(data.page.slug);
      setSlugManual(true);
      setMessage(published ? "Gespeichert und veröffentlicht." : "Entwurf gespeichert.");
      router.refresh();
    } catch {
      setError("Verbindungsfehler.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/admin/pages" className="text-sm text-gray-400 hover:text-gray-600">
            ← Alle Seiten
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-2">Eigene Seite bearbeiten</h1>
        </div>
        <div className="flex items-center gap-3">
          {published && (
            <Link
              href={`/seite/${slug}`}
              target="_blank"
              className="text-xs font-medium text-periwinkle-600 hover:underline"
            >
              Live ansehen ↗
            </Link>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
      {message && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
          {message}
        </p>
      )}

      <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-800">Metadaten</h2>
        <label className="block text-xs font-medium text-gray-600">
          Titel (Admin / Browser-Titel)
          <input
            value={title}
            onChange={(e) => {
              const next = e.target.value;
              setTitle(next);
              if (!slugManual) setSlug(slugifyPageTitle(next));
            }}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            required
          />
        </label>
        <label className="block text-xs font-medium text-gray-600">
          Web-Adresse{" "}
          <span className="font-normal text-gray-400">(änderbar)</span>
          <div className="mt-1 flex items-center gap-0 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 focus-within:ring-2 focus-within:ring-violet-400">
            <span className="px-3 py-2 text-xs text-gray-400 font-mono shrink-0 border-r border-gray-200 bg-gray-100">
              /seite/
            </span>
            <input
              value={slug}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
              }}
              className="flex-1 px-3 py-2 text-sm font-mono bg-transparent outline-none"
              required
            />
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">
            Öffentliche URL: /seite/{slug || "…"}
          </span>
        </label>
        {!slugManual ? (
          <p className="text-[11px] text-violet-600">Web-Adresse folgt dem Titel automatisch.</p>
        ) : (
          <button
            type="button"
            onClick={() => {
              setSlugManual(false);
              setSlug(slugifyPageTitle(title));
            }}
            className="text-xs text-violet-600 hover:underline"
          >
            Wieder aus Titel erzeugen
          </button>
        )}
        <label className="block text-xs font-medium text-gray-600">
          Nav-Label (optional, Hinweis für Navigation)
          <input
            value={navLabel}
            onChange={(e) => setNavLabel(e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            placeholder={title}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="accent-violet-600"
          />
          Veröffentlicht (sichtbar unter /seite/{slug || "…"})
        </label>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-800">Hero</h2>
        <label className="block text-xs font-medium text-gray-600">
          Label
          <input
            value={content.hero.label}
            onChange={(e) => updateHero({ label: e.target.value })}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-medium text-gray-600">
          Überschrift
          <input
            value={content.hero.title || title}
            onChange={(e) => updateHero({ title: e.target.value })}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-medium text-gray-600">
          Akzentwort (optional)
          <input
            value={content.hero.titleAccent}
            onChange={(e) => updateHero({ titleAccent: e.target.value })}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-medium text-gray-600">
          Untertitel
          <textarea
            value={content.hero.subtitle}
            onChange={(e) => updateHero({ subtitle: e.target.value })}
            rows={3}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </label>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Inhaltsblöcke</h2>
          <button
            type="button"
            onClick={addBlock}
            className="text-xs font-medium text-violet-600 hover:text-violet-700"
          >
            + Block
          </button>
        </div>
        {content.blocks.length === 0 && (
          <p className="text-sm text-gray-500">Noch keine Blöcke — fügen Sie Abschnitte mit Überschrift und Text hinzu.</p>
        )}
        {content.blocks.map((block) => (
          <div key={block.id} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50">
            <div className="flex justify-between gap-2">
              <input
                value={block.title}
                onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                placeholder="Überschrift"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => removeBlock(block.id)}
                className="text-xs text-red-500 hover:text-red-600 px-2"
              >
                Entfernen
              </button>
            </div>
            <textarea
              value={block.body}
              onChange={(e) => updateBlock(block.id, { body: e.target.value })}
              rows={5}
              placeholder="Text (Absätze mit Leerzeile trennen)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        ))}
      </section>

      <p className="text-xs text-gray-500">
        Tipp: Nach dem Veröffentlichen unter Navigation → Neuer Link mit{" "}
        <code className="bg-gray-100 px-1 rounded">/seite/{slug || "slug"}</code> hinzufügen.
      </p>
    </form>
  );
}
