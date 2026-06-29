"use client";

import { useState, useRef } from "react";
import type { NavItem, FooterContent, FooterColumn } from "@/lib/cms/navigation";
import { cn } from "@/lib/utils";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ─── Drag-and-drop hook ─────────────────────────────────────────────────── */
function useDraggableList<T extends { id: string }>(
  items: T[],
  onChange: (items: T[]) => void
) {
  const dragIndex = useRef<number | null>(null);

  function onDragStart(i: number) {
    dragIndex.current = i;
  }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === i) return;
    const next = [...items];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(i, 0, moved);
    dragIndex.current = i;
    onChange(next);
  }
  function onDrop() {
    dragIndex.current = null;
  }

  return { onDragStart, onDragOver, onDrop };
}

/* ─── Nav items editor ───────────────────────────────────────────────────── */
function NavItemsEditor({
  items,
  onChange,
}: {
  items: NavItem[];
  onChange: (items: NavItem[]) => void;
}) {
  const drag = useDraggableList(items, onChange);

  function update(id: string, patch: Partial<NavItem>) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  function remove(id: string) {
    onChange(items.filter((it) => it.id !== id));
  }
  function add() {
    onChange([...items, { id: uid(), label: "New link", href: "/", openInNewTab: false }]);
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => drag.onDragStart(i)}
          onDragOver={(e) => drag.onDragOver(e, i)}
          onDrop={drag.onDrop}
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 group cursor-grab active:cursor-grabbing hover:border-periwinkle-300 transition-colors"
        >
          {/* drag handle */}
          <svg className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zM7 8a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zM7 14a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z" />
          </svg>

          <input
            value={item.label}
            onChange={(e) => update(item.id, { label: e.target.value })}
            placeholder="Label"
            className="flex-1 min-w-0 text-sm px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-periwinkle-400 bg-gray-50"
          />
          <input
            value={item.href}
            onChange={(e) => update(item.id, { href: e.target.value })}
            placeholder="/path"
            className="flex-1 min-w-0 text-sm px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-periwinkle-400 bg-gray-50 font-mono"
          />

          <label className="flex items-center gap-1 text-xs text-gray-500 shrink-0 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!item.openInNewTab}
              onChange={(e) => update(item.id, { openInNewTab: e.target.checked })}
              className="accent-periwinkle-600"
            />
            New tab
          </label>

          <button
            type="button"
            onClick={() => remove(item.id)}
            className="p-1 text-gray-300 hover:text-red-400 transition-colors shrink-0"
            aria-label="Remove"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-periwinkle-300 hover:text-periwinkle-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add nav item
      </button>
    </div>
  );
}

/* ─── Footer column editor ───────────────────────────────────────────────── */
function FooterColumnEditor({
  column,
  onChange,
  onRemove,
}: {
  column: FooterColumn;
  onChange: (col: FooterColumn) => void;
  onRemove: () => void;
}) {
  function updateLink(i: number, patch: Partial<{ label: string; href: string }>) {
    const links = column.links.map((l, idx) => (idx === i ? { ...l, ...patch } : l));
    onChange({ ...column, links });
  }
  function removeLink(i: number) {
    onChange({ ...column, links: column.links.filter((_, idx) => idx !== i) });
  }
  function addLink() {
    onChange({ ...column, links: [...column.links, { label: "New link", href: "/" }] });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <input
          value={column.heading}
          onChange={(e) => onChange({ ...column, heading: e.target.value })}
          placeholder="Column heading"
          className="flex-1 text-sm font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-periwinkle-400 bg-gray-50"
        />
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 text-gray-300 hover:text-red-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="space-y-1.5 pl-1">
        {column.links.map((link, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={link.label}
              onChange={(e) => updateLink(i, { label: e.target.value })}
              placeholder="Label"
              className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-periwinkle-400 bg-gray-50"
            />
            <input
              value={link.href}
              onChange={(e) => updateLink(i, { href: e.target.value })}
              placeholder="/path"
              className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-periwinkle-400 bg-gray-50 font-mono"
            />
            <button
              type="button"
              onClick={() => removeLink(i)}
              className="p-1 text-gray-300 hover:text-red-400 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLink}
          className="text-xs text-gray-400 hover:text-periwinkle-600 flex items-center gap-1 mt-1 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add link
        </button>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
interface Props {
  initialNav: NavItem[];
  initialFooter: FooterContent;
}

type Tab = "nav" | "footer";

export default function NavEditorClient({ initialNav, initialFooter }: Props) {
  const [tab, setTab] = useState<Tab>("nav");
  const [nav, setNav] = useState<NavItem[]>(initialNav);
  const [footer, setFooter] = useState<FooterContent>(initialFooter);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const promises = [
        fetch("/admin/api/navigation", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "navigation", value: nav }),
        }),
        fetch("/admin/api/navigation", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "footer", value: footer }),
        }),
      ];
      const results = await Promise.all(promises);
      if (results.some((r) => !r.ok)) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function updateFooterField(key: keyof FooterContent, value: string) {
    setFooter((f) => ({ ...f, [key]: value }));
  }

  function updateColumn(i: number, col: FooterColumn) {
    setFooter((f) => ({ ...f, columns: f.columns.map((c, idx) => (idx === i ? col : c)) }));
  }
  function removeColumn(i: number) {
    setFooter((f) => ({ ...f, columns: f.columns.filter((_, idx) => idx !== i) }));
  }
  function addColumn() {
    setFooter((f) => ({
      ...f,
      columns: [...f.columns, { heading: "New column", links: [] }],
    }));
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Navigation & Footer</h1>
          <p className="text-sm text-gray-500 mt-0.5">Drag rows to reorder. Changes apply to the live site.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Saved
            </span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="px-5 py-2 bg-periwinkle-600 hover:bg-periwinkle-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {(["nav", "footer"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-lg transition-colors",
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t === "nav" ? "Header nav" : "Footer"}
          </button>
        ))}
      </div>

      {/* Header nav editor */}
      {tab === "nav" && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-700 mb-1">Header CTA button</p>
            <p className="text-xs text-gray-400 mb-4">The "Termin buchen" button in the top-right corner.</p>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Label</label>
                <input
                  value={footer.ctaPrimaryLabel}
                  onChange={(e) => updateFooterField("ctaPrimaryLabel", e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-periwinkle-400 bg-gray-50"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Link</label>
                <input
                  value={footer.ctaPrimaryUrl}
                  onChange={(e) => updateFooterField("ctaPrimaryUrl", e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-periwinkle-400 bg-gray-50 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-700 mb-1">Navigation links</p>
            <p className="text-xs text-gray-400 mb-4">Drag rows to reorder. These appear in both desktop and mobile nav.</p>
            <NavItemsEditor items={nav} onChange={setNav} />
          </div>
        </div>
      )}

      {/* Footer editor */}
      {tab === "footer" && (
        <div className="space-y-4">
          {/* CTA banner */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-700 mb-3">Footer CTA banner</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Subheading (small text)", key: "ctaSubheading" as const },
                { label: "Heading", key: "ctaHeading" as const },
                { label: "Primary button label", key: "ctaPrimaryLabel" as const },
                { label: "Primary button link", key: "ctaPrimaryUrl" as const },
                { label: "Secondary button label", key: "ctaSecondaryLabel" as const },
                { label: "Secondary button link", key: "ctaSecondaryUrl" as const },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <input
                    value={footer[key]}
                    onChange={(e) => updateFooterField(key, e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-periwinkle-400 bg-gray-50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer link columns */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-700 mb-1">Footer link columns</p>
            <p className="text-xs text-gray-400 mb-4">Each column shows in the main footer grid.</p>
            <div className="space-y-3">
              {footer.columns.map((col, i) => (
                <FooterColumnEditor
                  key={i}
                  column={col}
                  onChange={(c) => updateColumn(i, c)}
                  onRemove={() => removeColumn(i)}
                />
              ))}
              <button
                type="button"
                onClick={addColumn}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-periwinkle-300 hover:text-periwinkle-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add column
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Copyright text</label>
            <input
              value={footer.copyrightText}
              onChange={(e) => updateFooterField("copyrightText", e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-periwinkle-400 bg-gray-50"
            />
          </div>
        </div>
      )}
    </div>
  );
}
