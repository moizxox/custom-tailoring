"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import type { CmsSection, CmsField, FieldGroup } from "@/lib/cms/page-schemas";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import ItemsEditor from "@/components/admin/ItemsEditor";
import ColorPicker from "@/components/admin/ColorPicker";
import { cn } from "@/lib/utils";
import { ChevronDown, Check, Search, Image as ImageIcon, ChevronUp, GripVertical } from "lucide-react";
import { sortSectionsByOrder } from "@/lib/cms/section-order";

const FIELD_GROUP_META: { key: FieldGroup; label: string }[] = [
  { key: "content", label: "Content" },
  { key: "links", label: "Buttons & links" },
  { key: "appearance", label: "Background & style" },
  { key: "colors", label: "Text colors" },
  { key: "items", label: "Lists & cards" },
  { key: "settings", label: "Settings" },
];

function inferGroup(field: CmsField): FieldGroup {
  if (field.group) return field.group;
  if (field.type === "items") return "items";
  if (field.type === "color") return "colors";
  if (field.type === "toggle" || field.key.includes("gradient") || field.key.includes("bg") || field.key.includes("Konfetti")) return "appearance";
  if (field.type === "url" || /cta|url/i.test(field.key)) return "links";
  return "content";
}

function groupFields(fields: CmsField[]): { group: FieldGroup; label: string; fields: CmsField[] }[] {
  const buckets = new Map<FieldGroup, CmsField[]>();
  for (const field of fields) {
    const g = inferGroup(field);
    buckets.set(g, [...(buckets.get(g) ?? []), field]);
  }
  return FIELD_GROUP_META
    .filter((meta) => (buckets.get(meta.key)?.length ?? 0) > 0)
    .map((meta) => ({ group: meta.key, label: meta.label, fields: buckets.get(meta.key)! }));
}

/* ─── State shape ────────────────────────────────────────────────────────── */
interface SectionState {
  /** String values for text / select / number / image / url / array / color / icon / toggle */
  values: Record<string, string>;
  /** Array values for "items" fields — stored as real arrays */
  arrays: Record<string, Record<string, string>[]>;
  saving: boolean;
  saved: boolean;
  error: string;
  expanded: boolean;
}

interface Props {
  pageSlug: string;
  sections: CmsSection[];
  initialContents: Record<string, Record<string, unknown>>;
  pageLabel: string;
  initialSectionOrder: string[];
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function fieldToString(raw: unknown): string {
  if (typeof raw === "string") return raw;
  if (typeof raw === "number") return String(raw);
  if (Array.isArray(raw)) return JSON.stringify(raw, null, 2);
  if (typeof raw === "object" && raw !== null) return JSON.stringify(raw, null, 2);
  return "";
}

function buildInitialState(sections: CmsSection[], initialContents: Record<string, Record<string, unknown>>): Record<string, SectionState> {
  const map: Record<string, SectionState> = {};
  for (const sec of sections) {
    const content = initialContents[sec.key] ?? {};
    const values: Record<string, string> = {};
    const arrays: Record<string, Record<string, string>[]> = {};
    for (const f of sec.fields) {
      if (f.type === "items") {
        const raw = content[f.key];
        arrays[f.key] = Array.isArray(raw) ? (raw as Record<string, string>[]) : [];
      } else {
        const raw = content[f.key];
        if (f.type === "toggle") {
          values[f.key] = raw === true || raw === "true" ? "true" : "false";
        } else {
          values[f.key] = fieldToString(raw);
        }
      }
    }
    map[sec.key] = { values, arrays, saving: false, saved: false, error: "", expanded: false };
  }
  return map;
}

function buildSavePayload(state: SectionState, section: CmsSection): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const field of section.fields) {
    if (field.type === "items") {
      result[field.key] = state.arrays[field.key] ?? [];
    } else {
      const v = state.values[field.key] ?? "";
      if (field.type === "array") {
        try { result[field.key] = JSON.parse(v); } catch { result[field.key] = v; }
      } else if (field.type === "number") {
        const n = parseFloat(v);
        result[field.key] = Number.isFinite(n) ? n : v;
      } else if (field.type === "toggle") {
        result[field.key] = v === "true";
      } else {
        result[field.key] = v;
      }
    }
  }
  return result;
}

/* ─── Individual field input ─────────────────────────────────────────────── */
function FieldInput({
  field, value, onChange, onImagePick, t,
}: {
  field: CmsField;
  value: string;
  onChange: (v: string) => void;
  onImagePick: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const base = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition bg-gray-50 focus:bg-white";

  if (field.type === "textarea" || field.type === "richtext") {
    return <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className={cn(base, "resize-y")} />;
  }
  if (field.type === "array") {
    return <textarea rows={6} value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? t("arrayPlaceholder")} className={cn(base, "resize-y font-mono text-xs")} />;
  }
  if (field.type === "image") {
    return (
      <div className="flex gap-2">
        {value && <img src={value} alt="" className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0" />}
        <div className="flex-1 flex gap-2">
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={t("imagePlaceholder")} className={cn(base, "flex-1")} />
          <button type="button" onClick={onImagePick} className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap bg-white">
            <ImageIcon className="w-3.5 h-3.5" />
            {t("chooseImage")}
          </button>
        </div>
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={base}>
        <option value="">{t("selectPlaceholder")}</option>
        {field.options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    );
  }
  if (field.type === "number") {
    return <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className={base} />;
  }
  if (field.type === "color") {
    return (
      <ColorPicker
        value={value}
        onChange={onChange}
        showHex
      />
    );
  }
  if (field.type === "toggle") {
    return (
      <button type="button" role="switch" aria-checked={value === "true"}
        onClick={() => onChange(value === "true" ? "false" : "true")}
        className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2",
          value === "true" ? "bg-violet-600" : "bg-gray-200")}>
        <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
          value === "true" ? "translate-x-6" : "translate-x-1")} />
      </button>
    );
  }
  if (field.type === "icon") {
    const COMMON_ICONS = ["⭐","✨","🎯","💎","🌟","🔥","💡","🎨","🪡","✂️","👗","🎭","🧵","📍","🏆","💼","📞","📧","📍","🌍"];
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {COMMON_ICONS.map((icon) => (
            <button key={icon} type="button" onClick={() => onChange(icon)}
              className={cn("w-9 h-9 text-lg rounded-lg border transition-colors hover:border-violet-400",
                value === icon ? "border-violet-500 bg-violet-50" : "border-gray-200 bg-white hover:bg-gray-50")}>
              {icon}
            </button>
          ))}
        </div>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste any emoji or icon code" className={cn(base, "font-mono")} />
      </div>
    );
  }
  return <input type={field.type === "url" ? "url" : "text"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className={base} />;
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function PageEditorClient({ pageSlug, sections, initialContents, pageLabel, initialSectionOrder }: Props) {
  const t = useTranslations("editor");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [imagePickerMeta, setImagePickerMeta] = useState<{ sectionKey: string; fieldKey: string } | null>(null);
  const [search, setSearch] = useState("");
  const [sectionOrder, setSectionOrder] = useState<string[]>(initialSectionOrder);
  const [orderSaving, setOrderSaving] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);
  const [states, setStates] = useState<Record<string, SectionState>>(() =>
    buildInitialState(sections, initialContents)
  );

  const orderedSections = useMemo(
    () => sortSectionsByOrder(sections, sectionOrder),
    [sections, sectionOrder]
  );

  const updateValue = useCallback((sectionKey: string, fieldKey: string, value: string) => {
    setStates((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], saved: false, values: { ...prev[sectionKey].values, [fieldKey]: value } },
    }));
  }, []);

  const updateArray = useCallback((sectionKey: string, fieldKey: string, items: Record<string, string>[]) => {
    setStates((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], saved: false, arrays: { ...prev[sectionKey].arrays, [fieldKey]: items } },
    }));
  }, []);

  const toggleSection = useCallback((key: string) => {
    setStates((prev) => ({ ...prev, [key]: { ...prev[key], expanded: !prev[key].expanded } }));
  }, []);

  const moveSection = useCallback((key: string, direction: -1 | 1) => {
    setSectionOrder((prev) => {
      const idx = prev.indexOf(key);
      if (idx < 0) return prev;
      const nextIdx = idx + direction;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[nextIdx]] = [next[nextIdx], next[idx]];
      return next;
    });
    setOrderSaved(false);
  }, []);

  const saveSectionOrder = useCallback(async () => {
    setOrderSaving(true);
    try {
      const res = await fetch(`/admin/api/pages/${pageSlug}/order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: sectionOrder }),
      });
      if (!res.ok) throw new Error("order save failed");
      setOrderSaved(true);
      setTimeout(() => setOrderSaved(false), 3000);
    } catch {
      // silent — user can retry
    } finally {
      setOrderSaving(false);
    }
  }, [pageSlug, sectionOrder]);

  const saveSection = useCallback(async (sectionKey: string, section: CmsSection) => {
    setStates((prev) => ({ ...prev, [sectionKey]: { ...prev[sectionKey], saving: true, error: "" } }));
    try {
      const res = await fetch(`/admin/api/pages/${pageSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionKey, content: buildSavePayload(states[sectionKey], section) }),
      });
      if (!res.ok) throw new Error("save failed");
      setStates((prev) => ({ ...prev, [sectionKey]: { ...prev[sectionKey], saving: false, saved: true, error: "" } }));
      setTimeout(() => setStates((prev) => ({ ...prev, [sectionKey]: { ...prev[sectionKey], saved: false } })), 3000);
    } catch {
      setStates((prev) => ({ ...prev, [sectionKey]: { ...prev[sectionKey], saving: false, error: t("saveFailed") } }));
    }
  }, [pageSlug, states, t]);

  const scrollToSection = (key: string) => {
    setStates((prev) => ({ ...prev, [key]: { ...prev[key], expanded: true } }));
    setTimeout(() => sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const filteredSections = orderedSections.filter((s) =>
    !search || s.label.toLowerCase().includes(search.toLowerCase()) ||
    s.fields.some((f) => f.label.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex gap-6 min-h-full">
      {/* ── Sticky sidebar ──────────────────────────────────────────────── */}
      <aside className="hidden xl:flex flex-col w-56 shrink-0">
        <div className="sticky top-6 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1 mb-3">
            {pageLabel}
          </p>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find section…"
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-400 bg-gray-50 focus:bg-white transition" />
          </div>
          <nav className="space-y-0.5">
            {orderedSections.map((sec, idx) => {
              const isMatch = !search || sec.label.toLowerCase().includes(search.toLowerCase()) ||
                sec.fields.some((f) => f.label.toLowerCase().includes(search.toLowerCase()));
              const st = states[sec.key];
              return (
                <button key={sec.key} type="button" onClick={() => scrollToSection(sec.key)}
                  className={cn("w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between gap-2",
                    isMatch ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-gray-50",
                    st?.expanded && "bg-violet-50 text-violet-700 font-medium")}>
                  <span className="truncate flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400 w-4">{idx + 1}</span>
                    {sec.label}
                  </span>
                  {st?.saved && <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />}
                </button>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <button type="button" onClick={saveSectionOrder} disabled={orderSaving}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 transition">
              {orderSaving ? "Saving order…" : "Save section order"}
            </button>
            {orderSaved && <p className="text-[10px] text-green-600 px-1">Section order saved</p>}
            <p className="text-[10px] text-gray-400 px-1">{orderedSections.length} sections — use arrows to reorder</p>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Mobile search */}
        <div className="xl:hidden relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sections…"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50 focus:bg-white transition" />
        </div>

        {filteredSections.length === 0 && (
          <div className="text-center py-16 text-sm text-gray-400">No sections match &ldquo;{search}&rdquo;</div>
        )}

        {filteredSections.map((section, sectionIndex) => {
          const st = states[section.key];
          if (!st) return null;
          const fieldGroups = groupFields(section.fields);
          const orderIndex = sectionOrder.indexOf(section.key);
          return (
            <div key={section.key} ref={(el) => { sectionRefs.current[section.key] = el; }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden scroll-mt-6">

              {/* Section header */}
              <div className="flex items-stretch">
                <div className="flex flex-col border-r border-gray-100 bg-gray-50/80">
                  <button type="button" disabled={orderIndex <= 0} onClick={() => moveSection(section.key, -1)}
                    className="px-2.5 py-2 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move up">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button type="button" disabled={orderIndex >= sectionOrder.length - 1} onClick={() => moveSection(section.key, 1)}
                    className="px-2.5 py-2 text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move down">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <button type="button" onClick={() => toggleSection(section.key)}
                  className="flex-1 flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        <span className="text-gray-400 font-normal mr-2">#{sectionIndex + 1}</span>
                        {section.label}
                      </p>
                      {section.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{section.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {st.saved && (
                      <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                        <Check className="w-3 h-3" /> Saved
                      </span>
                    )}
                    <ChevronDown className={cn("w-4 h-4 text-gray-300 transition-transform", st.expanded && "rotate-180")} />
                  </div>
                </button>
              </div>

              {/* Expanded body — grouped fields */}
              {st.expanded && (
                <div className="border-t border-gray-100 px-5 py-5 space-y-6">
                  {fieldGroups.map((group) => (
                    <div key={group.group} className="rounded-xl border border-gray-100 overflow-hidden">
                      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{group.label}</p>
                      </div>
                      <div className="p-4 space-y-4">
                        {group.fields.map((field) => (
                          <div key={field.key}>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                              {field.label}
                              {field.hint && <span className="ml-2 text-gray-400 font-normal">{field.hint}</span>}
                            </label>

                            {field.type === "items" ? (
                              <ItemsEditor
                                value={st.arrays[field.key] ?? []}
                                onChange={(items) => updateArray(section.key, field.key, items)}
                                itemFields={field.itemFields ?? []}
                              />
                            ) : (
                              <FieldInput
                                field={field}
                                value={st.values[field.key] ?? ""}
                                onChange={(v) => updateValue(section.key, field.key, v)}
                                onImagePick={() => setImagePickerMeta({ sectionKey: section.key, fieldKey: field.key })}
                                t={t}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {st.error && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2">{st.error}</p>
                  )}

                  <div className="flex items-center justify-end pt-1">
                    <button type="button" onClick={() => saveSection(section.key, section)} disabled={st.saving}
                      className="px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition">
                      {st.saving ? t("saving") : t("save")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Image picker modal */}
      {imagePickerMeta && (
        <MediaPickerModal
          onSelect={(url) => { updateValue(imagePickerMeta.sectionKey, imagePickerMeta.fieldKey, url); setImagePickerMeta(null); }}
          onClose={() => setImagePickerMeta(null)}
        />
      )}
    </div>
  );
}
