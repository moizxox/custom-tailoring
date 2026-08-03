"use client";

import { useState, useRef } from "react";
import {
  GripVertical, Plus, Trash2, Check, X,
  Navigation, LayoutPanelTop, Phone, Mail, Clock,
  MapPin, Type, Link2, ExternalLink, Columns3, Share2,
} from "lucide-react";
import type { NavItem, FooterContent, FooterLocation } from "@/lib/cms/navigation";
import type { NavPageOption } from "@/lib/cms/nav-page-options";
import { PageLinkSelect } from "@/components/admin/PageLinkSelect";
import { cn } from "@/lib/utils";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const PLACEHOLDER_LABELS = new Set(["", "Neuer Link", "New link", "New Link"]);

function suggestLabel(current: string, option: NavPageOption): string {
  if (PLACEHOLDER_LABELS.has(current.trim())) return option.label.replace(/ \(Entwurf\)$/, "");
  return current;
}

/* ─── Shared field row ───────────────────────────────────────────────────── */
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
        {hint && <span className="ml-1.5 font-normal text-gray-400">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

const inp = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition";

/* ─── Nav item row (supports drag-to-nest submenus) ──────────────────────── */
function NavItemsEditor({
  items,
  onChange,
  pageOptions,
}: {
  items: NavItem[];
  onChange: (items: NavItem[]) => void;
  pageOptions: NavPageOption[];
}) {
  const dragFrom = useRef<{ parentId: string | null; index: number } | null>(null);
  const [dropHint, setDropHint] = useState<{ parentId: string | null; index: number; nest?: boolean } | null>(null);

  function updateTop(id: string, patch: Partial<NavItem>) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function updateChild(parentId: string, childId: string, patch: Partial<NavItem>) {
    onChange(
      items.map((it) =>
        it.id === parentId
          ? {
              ...it,
              children: (it.children ?? []).map((c) => (c.id === childId ? { ...c, ...patch } : c)),
            }
          : it,
      ),
    );
  }

  function removeTop(id: string) {
    onChange(items.filter((it) => it.id !== id));
  }

  function removeChild(parentId: string, childId: string) {
    onChange(
      items.map((it) =>
        it.id === parentId
          ? { ...it, children: (it.children ?? []).filter((c) => c.id !== childId) }
          : it,
      ),
    );
  }

  function add() {
    onChange([...items, { id: uid(), label: "Neuer Link", href: "/", openInNewTab: false, hidden: false }]);
  }

  function nestUnder(childId: string, parentId: string) {
    if (childId === parentId) return;
    const child = items.find((it) => it.id === childId);
    const parent = items.find((it) => it.id === parentId);
    if (!child || !parent) return;
    const promoted = child.children ?? [];
    const without = items.filter((it) => it.id !== childId);
    const nested: NavItem = {
      id: child.id,
      label: child.label,
      href: child.href,
      openInNewTab: child.openInNewTab,
      hidden: child.hidden,
    };
    onChange(
      without
        .map((it) =>
          it.id === parentId
            ? { ...it, children: [...(it.children ?? []), nested] }
            : it,
        )
        .concat(promoted),
    );
  }

  function unnest(parentId: string, childId: string) {
    const parent = items.find((it) => it.id === parentId);
    const child = parent?.children?.find((c) => c.id === childId);
    if (!parent || !child) return;
    const parentIndex = items.findIndex((it) => it.id === parentId);
    const next = items.map((it) =>
      it.id === parentId
        ? { ...it, children: (it.children ?? []).filter((c) => c.id !== childId) }
        : it,
    );
    next.splice(parentIndex + 1, 0, { ...child });
    onChange(next);
  }

  function reorderTop(from: number, to: number) {
    if (from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  function reorderChild(parentId: string, from: number, to: number) {
    if (from === to) return;
    onChange(
      items.map((it) => {
        if (it.id !== parentId) return it;
        const kids = [...(it.children ?? [])];
        const [moved] = kids.splice(from, 1);
        kids.splice(to, 0, moved);
        return { ...it, children: kids };
      }),
    );
  }

  function onDragStartTop(index: number) {
    dragFrom.current = { parentId: null, index };
  }

  function onDragStartChild(parentId: string, index: number) {
    dragFrom.current = { parentId, index };
  }

  function onDragOverTop(e: React.DragEvent, index: number) {
    e.preventDefault();
    const nest = e.clientX - (e.currentTarget as HTMLElement).getBoundingClientRect().left > 56;
    setDropHint({ parentId: null, index, nest });
  }

  function onDropTop(e: React.DragEvent, toIndex: number) {
    e.preventDefault();
    const from = dragFrom.current;
    setDropHint(null);
    dragFrom.current = null;
    if (!from) return;

    const nest = e.clientX - (e.currentTarget as HTMLElement).getBoundingClientRect().left > 56;
    const target = items[toIndex];
    if (!target) return;

    if (from.parentId === null) {
      const source = items[from.index];
      if (!source) return;
      if (nest && source.id !== target.id) {
        nestUnder(source.id, target.id);
        return;
      }
      reorderTop(from.index, toIndex);
      return;
    }

    const parent = items.find((it) => it.id === from.parentId);
    const child = parent?.children?.[from.index];
    if (!child) return;
    unnest(from.parentId, child.id);
  }

  function onDropChild(e: React.DragEvent, parentId: string, toIndex: number) {
    e.preventDefault();
    const from = dragFrom.current;
    setDropHint(null);
    dragFrom.current = null;
    if (!from) return;

    if (from.parentId === parentId) {
      reorderChild(parentId, from.index, toIndex);
      return;
    }

    if (from.parentId === null) {
      nestUnder(items[from.index]?.id ?? "", parentId);
      return;
    }

    const srcParent = items.find((it) => it.id === from.parentId);
    const child = srcParent?.children?.[from.index];
    if (!child) return;
    onChange(
      items.map((it) => {
        if (it.id === from.parentId) {
          return { ...it, children: (it.children ?? []).filter((c) => c.id !== child.id) };
        }
        if (it.id === parentId) {
          const kids = [...(it.children ?? [])];
          kids.splice(toIndex, 0, child);
          return { ...it, children: kids };
        }
        return it;
      }),
    );
  }

  function renderRow(
    item: NavItem,
    opts: {
      nested?: boolean;
      parentId?: string;
      index: number;
      onDragStart: () => void;
      onDragOver: (e: React.DragEvent) => void;
      onDrop: (e: React.DragEvent) => void;
      onUpdate: (patch: Partial<NavItem>) => void;
      onRemove: () => void;
      onUnnest?: () => void;
      onMakeSub?: () => void;
    },
  ) {
    const isDropTarget =
      dropHint &&
      ((opts.nested && dropHint.parentId === opts.parentId && dropHint.index === opts.index) ||
        (!opts.nested && dropHint.parentId === null && dropHint.index === opts.index));

    return (
      <div
        key={item.id}
        draggable
        onDragStart={opts.onDragStart}
        onDragOver={opts.onDragOver}
        onDrop={opts.onDrop}
        onDragEnd={() => {
          dragFrom.current = null;
          setDropHint(null);
        }}
        className={cn(
          "flex flex-wrap sm:flex-nowrap items-center gap-2 bg-white border rounded-xl px-3 py-2.5 group cursor-grab active:cursor-grabbing hover:border-violet-200 hover:shadow-sm transition-all",
          opts.nested ? "ml-8 border-violet-100 bg-violet-50/40" : "border-gray-200",
          item.hidden && "opacity-55",
          isDropTarget && dropHint?.nest && !opts.nested && "ring-2 ring-violet-400 border-violet-300",
          isDropTarget && !dropHint?.nest && "ring-2 ring-violet-200",
        )}
      >
        <GripVertical className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-gray-400" />
        {opts.nested && (
          <span className="text-[10px] font-medium uppercase tracking-wide text-violet-500 shrink-0">Sub</span>
        )}
        <input
          value={item.label}
          onChange={(e) => opts.onUpdate({ label: e.target.value })}
          placeholder="Bezeichnung"
          className={cn(inp, "flex-1 min-w-[8rem]")}
        />
        <PageLinkSelect
          compact
          value={item.href}
          options={pageOptions}
          onChange={(href) => opts.onUpdate({ href })}
          onSelectPage={(option) =>
            opts.onUpdate({ href: option.href, label: suggestLabel(item.label, option) })
          }
          selectClassName="min-w-[10rem]"
        />
        <label className="flex items-center gap-1.5 text-xs text-gray-500 shrink-0 cursor-pointer select-none whitespace-nowrap" title="Auf der Website in der Navigation anzeigen">
          <input
            type="checkbox"
            checked={!item.hidden}
            onChange={(e) => opts.onUpdate({ hidden: !e.target.checked })}
            className="accent-violet-600 rounded"
          />
          Auf Website anzeigen
        </label>
        <label className="flex items-center gap-1.5 text-xs text-gray-500 shrink-0 cursor-pointer select-none whitespace-nowrap">
          <input
            type="checkbox"
            checked={!!item.openInNewTab}
            onChange={(e) => opts.onUpdate({ openInNewTab: e.target.checked })}
            className="accent-violet-600 rounded"
          />
          <ExternalLink className="w-3 h-3" /> New tab
        </label>
        {!opts.nested && opts.index > 0 && opts.onMakeSub && (
          <button
            type="button"
            title="Als Unterpunkt des vorherigen Eintrags"
            onClick={opts.onMakeSub}
            className="px-2 py-1 text-[10px] font-medium text-violet-600 bg-violet-50 rounded-lg hover:bg-violet-100 shrink-0"
          >
            → Sub
          </button>
        )}
        {opts.nested && opts.onUnnest && (
          <button
            type="button"
            title="Aus Untermenü lösen"
            onClick={opts.onUnnest}
            className="px-2 py-1 text-[10px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 shrink-0"
          >
            ↑ Top
          </button>
        )}
        <button type="button" onClick={opts.onRemove} className="p-1 text-gray-300 hover:text-red-400 transition-colors shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2">
        Seite aus der Liste wählen — kein Tippen von URLs nötig. Rechts ziehen (oder → Sub) für Untermenüs.
      </p>
      {items.map((item, i) => (
        <div key={item.id} className="space-y-1.5">
          {renderRow(item, {
            index: i,
            onDragStart: () => onDragStartTop(i),
            onDragOver: (e) => onDragOverTop(e, i),
            onDrop: (e) => onDropTop(e, i),
            onUpdate: (patch) => updateTop(item.id, patch),
            onRemove: () => removeTop(item.id),
            onMakeSub:
              i > 0
                ? () => nestUnder(item.id, items[i - 1].id)
                : undefined,
          })}
          {(item.children ?? []).map((child, ci) =>
            renderRow(child, {
              nested: true,
              parentId: item.id,
              index: ci,
              onDragStart: () => onDragStartChild(item.id, ci),
              onDragOver: (e) => {
                e.preventDefault();
                setDropHint({ parentId: item.id, index: ci });
              },
              onDrop: (e) => onDropChild(e, item.id, ci),
              onUpdate: (patch) => updateChild(item.id, child.id, patch),
              onRemove: () => removeChild(item.id, child.id),
              onUnnest: () => unnest(item.id, child.id),
            }),
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-violet-300 hover:text-violet-600 transition-colors"
      >
        <Plus className="w-4 h-4" /> Nav-Eintrag hinzufügen
      </button>
    </div>
  );
}

/* ─── Location row ───────────────────────────────────────────────────────── */
function LocationEditor({ loc, onChange, onRemove }: { loc: FooterLocation; onChange: (l: FooterLocation) => void; onRemove: () => void }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-gray-600 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-violet-500" /> Atelier {loc.name || "…"}</p>
        <button type="button" onClick={onRemove} className="p-1 text-gray-300 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <input value={loc.name} onChange={(e) => onChange({ ...loc, name: e.target.value })} placeholder="City name" className={cn(inp, "text-xs")} />
        <input value={loc.address} onChange={(e) => onChange({ ...loc, address: e.target.value })} placeholder="Street address" className={cn(inp, "text-xs")} />
        <input value={loc.city} onChange={(e) => onChange({ ...loc, city: e.target.value })} placeholder="ZIP + City" className={cn(inp, "text-xs")} />
      </div>
    </div>
  );
}

/* ─── Footer column editor ───────────────────────────────────────────────── */
function FooterColumnEditor({
  column, onChange, onRemove, pageOptions,
}: {
  column: { heading: string; links: { label: string; href: string }[] };
  onChange: (col: typeof column) => void;
  onRemove: () => void;
  pageOptions: NavPageOption[];
}) {
  function updateLink(i: number, patch: Partial<{ label: string; href: string }>) {
    onChange({ ...column, links: column.links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)) });
  }
  function removeLink(i: number) { onChange({ ...column, links: column.links.filter((_, idx) => idx !== i) }); }
  function addLink() { onChange({ ...column, links: [...column.links, { label: "Neuer Link", href: "/" }] }); }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <input value={column.heading} onChange={(e) => onChange({ ...column, heading: e.target.value })} placeholder="Column heading" className={cn(inp, "flex-1 font-semibold text-sm")} />
        <button type="button" onClick={onRemove} className="p-1.5 text-gray-300 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
      <div className="space-y-1.5 pl-1">
        {column.links.map((link, i) => (
          <div key={i} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <input value={link.label} onChange={(e) => updateLink(i, { label: e.target.value })} placeholder="Bezeichnung" className={cn(inp, "flex-1 text-xs min-w-[8rem]")} />
            <PageLinkSelect
              compact
              value={link.href}
              options={pageOptions}
              onChange={(href) => updateLink(i, { href })}
              onSelectPage={(option) =>
                updateLink(i, { href: option.href, label: suggestLabel(link.label, option) })
              }
            />
            <button type="button" onClick={() => removeLink(i)} className="p-1 text-gray-300 hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
          </div>
        ))}
        <button type="button" onClick={addLink} className="text-xs text-gray-400 hover:text-violet-600 flex items-center gap-1 mt-1 transition-colors">
          <Plus className="w-3 h-3" /> Link hinzufügen
        </button>
      </div>
    </div>
  );
}

/* ─── Section card ───────────────────────────────────────────────────────── */
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left">
        <span className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">{icon}</span>
        <span className="text-sm font-semibold text-gray-900 flex-1">{title}</span>
        <svg viewBox="0 0 20 20" fill="currentColor" className={cn("w-4 h-4 text-gray-300 transition-transform", open ? "rotate-180" : "")}>
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {open && <div className="border-t border-gray-100 px-5 py-5 space-y-4">{children}</div>}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
type Tab = "nav" | "footer";

export default function NavEditorClient({
  initialNav,
  initialFooter,
  pageOptions,
}: {
  initialNav: NavItem[];
  initialFooter: FooterContent;
  pageOptions: NavPageOption[];
}) {
  const [tab, setTab] = useState<Tab>("nav");
  const [nav, setNav] = useState<NavItem[]>(initialNav);
  const [footer, setFooter] = useState<FooterContent>(initialFooter);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true); setSaved(false); setError("");
    try {
      const results = await Promise.all([
        fetch("/admin/api/navigation", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "navigation", value: nav }) }),
        fetch("/admin/api/navigation", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "footer", value: footer }) }),
      ]);
      if (results.some((r) => !r.ok)) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setError("Failed to save. Please try again."); }
    finally { setSaving(false); }
  }

  function setF<K extends keyof FooterContent>(key: K, value: FooterContent[K]) {
    setFooter((f) => ({ ...f, [key]: value }));
  }

  function updateColumn(i: number, col: FooterContent["columns"][number]) {
    setFooter((f) => ({ ...f, columns: f.columns.map((c, idx) => (idx === i ? col : c)) }));
  }

  function updateLocation(i: number, loc: FooterLocation) {
    setFooter((f) => ({ ...f, locations: f.locations.map((l, idx) => (idx === i ? loc : l)) }));
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Navigation & Footer</h1>
          <p className="text-sm text-gray-500 mt-0.5">Seiten aus der Liste wählen — URLs werden automatisch gesetzt.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
          <button type="button" onClick={save} disabled={saving} className="px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition shadow-sm">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>}

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {([
          { key: "nav" as Tab, label: "Header nav", icon: <Navigation className="w-3.5 h-3.5" /> },
          { key: "footer" as Tab, label: "Footer", icon: <LayoutPanelTop className="w-3.5 h-3.5" /> },
        ]).map(({ key, label, icon }) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={cn("flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg transition-colors",
              tab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {tab === "nav" && (
        <div className="space-y-4">
          <Section title="Header CTA button" icon={<Link2 className="w-4 h-4" />}>
            <p className="text-xs text-gray-400 -mt-2">The primary button in the top-right corner of the header.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Button label">
                <input value={footer.ctaPrimaryLabel} onChange={(e) => setF("ctaPrimaryLabel", e.target.value)} className={inp} />
              </Field>
              <Field label="Button link" hint="Seite wählen">
                <PageLinkSelect
                  value={footer.ctaPrimaryUrl}
                  options={pageOptions}
                  onChange={(href) => setF("ctaPrimaryUrl", href)}
                />
              </Field>
            </div>
          </Section>

          <Section title="Navigation links" icon={<Navigation className="w-4 h-4" />}>
            <p className="text-xs text-gray-400 -mt-2">Bezeichnung + Seite auswählen. Untermenüs mit → Sub oder Rechts-Drop.</p>
            <NavItemsEditor items={nav} onChange={setNav} pageOptions={pageOptions} />
          </Section>
        </div>
      )}

      {tab === "footer" && (
        <div className="space-y-4">
          <Section title="CTA banner" icon={<Type className="w-4 h-4" />}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Small label text">
                <input value={footer.ctaSubheading} onChange={(e) => setF("ctaSubheading", e.target.value)} className={inp} />
              </Field>
              <Field label="Heading">
                <input value={footer.ctaHeading} onChange={(e) => setF("ctaHeading", e.target.value)} className={inp} />
              </Field>
              <Field label="Primary button label">
                <input value={footer.ctaPrimaryLabel} onChange={(e) => setF("ctaPrimaryLabel", e.target.value)} className={inp} />
              </Field>
              <Field label="Primary button page">
                <PageLinkSelect
                  value={footer.ctaPrimaryUrl}
                  options={pageOptions}
                  onChange={(href) => setF("ctaPrimaryUrl", href)}
                />
              </Field>
              <Field label="Secondary button label">
                <input value={footer.ctaSecondaryLabel} onChange={(e) => setF("ctaSecondaryLabel", e.target.value)} className={inp} />
              </Field>
              <Field label="Secondary button page">
                <PageLinkSelect
                  value={footer.ctaSecondaryUrl}
                  options={pageOptions}
                  onChange={(href) => setF("ctaSecondaryUrl", href)}
                />
              </Field>
            </div>
          </Section>

          <Section title="Brand / logo" icon={<Type className="w-4 h-4" />}>
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Brand name (first part)">
                <input value={footer.brandName} onChange={(e) => setF("brandName", e.target.value)} className={inp} />
              </Field>
              <Field label="Accent part (purple)" hint="e.g. schneiderei">
                <input value={footer.brandAccent} onChange={(e) => setF("brandAccent", e.target.value)} className={inp} />
              </Field>
              <Field label="Sub-line" hint="e.g. Pratteln & Therwil">
                <input value={footer.brandSubline} onChange={(e) => setF("brandSubline", e.target.value)} className={inp} />
              </Field>
            </div>
          </Section>

          <Section title="Contact info" icon={<Phone className="w-4 h-4" />}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Phone number (display)" hint="visible text">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input value={footer.phone} onChange={(e) => setF("phone", e.target.value)} className={cn(inp, "pl-9")} />
                </div>
              </Field>
              <Field label="Phone href" hint="tel:+41…">
                <input value={footer.phoneHref} onChange={(e) => setF("phoneHref", e.target.value)} className={cn(inp, "font-mono")} />
              </Field>
              <Field label="Email address">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input type="email" value={footer.email} onChange={(e) => setF("email", e.target.value)} className={cn(inp, "pl-9")} />
                </div>
              </Field>
              <Field label="Opening hours / info">
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input value={footer.hours} onChange={(e) => setF("hours", e.target.value)} className={cn(inp, "pl-9")} />
                </div>
              </Field>
            </div>
          </Section>

          <Section title="Social media" icon={<Share2 className="w-4 h-4" />}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Instagram URL">
                <div className="relative">
                  <Share2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input value={footer.instagramUrl} onChange={(e) => setF("instagramUrl", e.target.value)} className={cn(inp, "pl-9 font-mono")} />
                </div>
              </Field>
              <Field label="Facebook URL">
                <div className="relative">
                  <Share2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input value={footer.facebookUrl} onChange={(e) => setF("facebookUrl", e.target.value)} className={cn(inp, "pl-9 font-mono")} />
                </div>
              </Field>
            </div>
          </Section>

          <Section title="Atelier locations" icon={<MapPin className="w-4 h-4" />}>
            <p className="text-xs text-gray-400 -mt-2">Name, street address, and ZIP + city for each atelier.</p>
            <div className="space-y-3">
              {footer.locations.map((loc, i) => (
                <LocationEditor
                  key={i}
                  loc={loc}
                  onChange={(l) => updateLocation(i, l)}
                  onRemove={() => setFooter((f) => ({ ...f, locations: f.locations.filter((_, idx) => idx !== i) }))}
                />
              ))}
              <button type="button" onClick={() => setFooter((f) => ({ ...f, locations: [...f.locations, { name: "", address: "", city: "" }] }))}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-violet-300 hover:text-violet-600 transition-colors">
                <Plus className="w-4 h-4" /> Add location
              </button>
            </div>
          </Section>

          <Section title="Footer link columns" icon={<Columns3 className="w-4 h-4" />}>
            <p className="text-xs text-gray-400 -mt-2">Each column shows in the main footer grid.</p>
            <div className="space-y-3">
              {footer.columns.map((col, i) => (
                <FooterColumnEditor key={i} column={col}
                  pageOptions={pageOptions}
                  onChange={(c) => updateColumn(i, c)}
                  onRemove={() => setFooter((f) => ({ ...f, columns: f.columns.filter((_, idx) => idx !== i) }))}
                />
              ))}
              <button type="button"
                onClick={() => setFooter((f) => ({ ...f, columns: [...f.columns, { heading: "New column", links: [] }] }))}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-violet-300 hover:text-violet-600 transition-colors">
                <Plus className="w-4 h-4" /> Add column
              </button>
            </div>
          </Section>

          <Section title="Legal footer links" icon={<Columns3 className="w-4 h-4" />}>
            <p className="text-xs text-gray-400 -mt-2">Impressum, AGB, Datenschutz, etc. shown in the footer bar.</p>
            <div className="space-y-2">
              {(footer.legalLinks ?? []).map((link, i) => (
                <div key={i} className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                  <input
                    value={link.label}
                    onChange={(e) => setF("legalLinks", footer.legalLinks.map((l, idx) => idx === i ? { ...l, label: e.target.value } : l))}
                    placeholder="Bezeichnung"
                    className={cn(inp, "flex-1 min-w-[8rem]")}
                  />
                  <PageLinkSelect
                    compact
                    value={link.href}
                    options={pageOptions}
                    onChange={(href) => setF("legalLinks", footer.legalLinks.map((l, idx) => idx === i ? { ...l, href } : l))}
                    onSelectPage={(option) =>
                      setF(
                        "legalLinks",
                        footer.legalLinks.map((l, idx) =>
                          idx === i
                            ? { ...l, href: option.href, label: suggestLabel(l.label, option) }
                            : l,
                        ),
                      )
                    }
                  />
                  <button type="button" onClick={() => setF("legalLinks", footer.legalLinks.filter((_, idx) => idx !== i))} className="p-2 text-gray-300 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setF("legalLinks", [...(footer.legalLinks ?? []), { label: "", href: "/" }])}
                className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-violet-300 hover:text-violet-600 transition-colors">
                <Plus className="w-4 h-4" /> Add legal link
              </button>
            </div>
          </Section>

          <Section title="Copyright text" icon={<Type className="w-4 h-4" />}>
            <Field label="Copyright line" hint="Year is added automatically">
              <input value={footer.copyrightText} onChange={(e) => setF("copyrightText", e.target.value)} className={inp} />
            </Field>
          </Section>
        </div>
      )}
    </div>
  );
}
