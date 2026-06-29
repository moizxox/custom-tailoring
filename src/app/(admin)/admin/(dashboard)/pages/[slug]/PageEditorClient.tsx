"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { CmsSection, CmsField } from "@/lib/cms/page-schemas";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { cn } from "@/lib/utils";

interface SectionState {
  values: Record<string, string>;
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
  pageIcon: string;
}

function fieldToString(raw: unknown): string {
  if (typeof raw === "string") return raw;
  if (typeof raw === "number") return String(raw);
  if (typeof raw === "object" && raw !== null) return JSON.stringify(raw, null, 2);
  return "";
}

function parseContent(values: Record<string, string>, section: CmsSection): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const field of section.fields) {
    const v = values[field.key] ?? "";
    if (field.type === "array") {
      try { result[field.key] = JSON.parse(v); } catch { result[field.key] = v; }
    } else if (field.type === "number") {
      const n = parseFloat(v);
      result[field.key] = Number.isFinite(n) ? n : v;
    } else {
      result[field.key] = v;
    }
  }
  return result;
}

function FieldInput({
  field,
  value,
  onChange,
  onImagePick,
  t,
}: {
  field: CmsField;
  value: string;
  onChange: (v: string) => void;
  onImagePick: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const base = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-periwinkle-400 focus:border-transparent transition bg-gray-50 focus:bg-white";

  if (field.type === "textarea" || field.type === "richtext") {
    return (
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={cn(base, "resize-y")}
      />
    );
  }
  if (field.type === "array") {
    return (
      <textarea
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? t("arrayPlaceholder")}
        className={cn(base, "resize-y font-mono text-xs")}
      />
    );
  }
  if (field.type === "image") {
    return (
      <div className="flex gap-2">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0" />
        )}
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t("imagePlaceholder")}
            className={cn(base, "flex-1")}
          />
          <button
            type="button"
            onClick={onImagePick}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap bg-white"
          >
            {t("chooseImage")}
          </button>
        </div>
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(base)}
      >
        <option value="">{t("selectPlaceholder")}</option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }
  if (field.type === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={base}
      />
    );
  }
  if (field.type === "color") {
    return (
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className={cn(base, "flex-1 font-mono")}
        />
      </div>
    );
  }
  if (field.type === "toggle") {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={value === "true"}
        onClick={() => onChange(value === "true" ? "false" : "true")}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-periwinkle-400 focus:ring-offset-2",
          value === "true" ? "bg-periwinkle-600" : "bg-gray-200"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
            value === "true" ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    );
  }
  if (field.type === "icon") {
    const COMMON_ICONS = [
      "⭐", "✨", "🎯", "💎", "🌟", "🔥", "💡", "🎨", "🪡", "✂️",
      "👗", "🎭", "🧵", "📍", "🏆", "💼", "📞", "📧", "📍", "🌍",
    ];
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {COMMON_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => onChange(icon)}
              className={cn(
                "w-9 h-9 text-lg rounded-lg border transition-colors hover:border-periwinkle-400",
                value === icon
                  ? "border-periwinkle-500 bg-periwinkle-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              )}
            >
              {icon}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste any emoji or icon code"
          className={cn(base, "font-mono")}
        />
      </div>
    );
  }
  return (
    <input
      type={field.type === "url" ? "url" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className={base}
    />
  );
}

export default function PageEditorClient({ pageSlug, sections, initialContents, pageLabel, pageIcon }: Props) {
  const t = useTranslations("editor");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [imagePickerMeta, setImagePickerMeta] = useState<{ sectionKey: string; fieldKey: string } | null>(null);
  const [search, setSearch] = useState("");

  const [states, setStates] = useState<Record<string, SectionState>>(() => {
    const map: Record<string, SectionState> = {};
    for (const sec of sections) {
      const content = initialContents[sec.key] ?? {};
      map[sec.key] = {
        values: Object.fromEntries(sec.fields.map((f) => [f.key, fieldToString(content[f.key])])),
        saving: false,
        saved: false,
        error: "",
        expanded: false,
      };
    }
    return map;
  });

  const updateValue = useCallback((sectionKey: string, fieldKey: string, value: string) => {
    setStates((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        saved: false,
        values: { ...prev[sectionKey].values, [fieldKey]: value },
      },
    }));
  }, []);

  const toggleSection = useCallback((key: string) => {
    setStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], expanded: !prev[key].expanded },
    }));
  }, []);

  const saveSection = useCallback(async (sectionKey: string, section: CmsSection) => {
    setStates((prev) => ({ ...prev, [sectionKey]: { ...prev[sectionKey], saving: true, error: "" } }));
    try {
      const res = await fetch(`/admin/api/pages/${pageSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey,
          content: parseContent(states[sectionKey].values, section),
        }),
      });
      if (!res.ok) throw new Error("save failed");
      setStates((prev) => ({ ...prev, [sectionKey]: { ...prev[sectionKey], saving: false, saved: true, error: "" } }));
      setTimeout(() => {
        setStates((prev) => ({ ...prev, [sectionKey]: { ...prev[sectionKey], saved: false } }));
      }, 3000);
    } catch {
      setStates((prev) => ({
        ...prev,
        [sectionKey]: { ...prev[sectionKey], saving: false, error: t("saveFailed") },
      }));
    }
  }, [pageSlug, states, t]);

  const scrollToSection = (key: string) => {
    setStates((prev) => ({ ...prev, [key]: { ...prev[key], expanded: true } }));
    setTimeout(() => {
      sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const filteredSections = sections.filter((s) =>
    !search || s.label.toLowerCase().includes(search.toLowerCase()) ||
    s.fields.some((f) => f.label.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex gap-6 min-h-full">
      {/* ── Sticky sidebar ──────────────────────────────────────────────── */}
      <aside className="hidden xl:flex flex-col w-56 shrink-0">
        <div className="sticky top-6 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1 mb-3">
            {pageIcon} {pageLabel}
          </p>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find section…"
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-periwinkle-400 bg-gray-50 focus:bg-white transition"
            />
          </div>

          <nav className="space-y-0.5">
            {sections.map((sec) => {
              const isMatch = !search || sec.label.toLowerCase().includes(search.toLowerCase()) ||
                sec.fields.some((f) => f.label.toLowerCase().includes(search.toLowerCase()));
              const st = states[sec.key];
              return (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() => scrollToSection(sec.key)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between gap-2",
                    isMatch
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-300 hover:bg-gray-50",
                    st?.expanded && "bg-periwinkle-50 text-periwinkle-700 font-medium"
                  )}
                >
                  <span className="truncate">{sec.label}</span>
                  {st?.saved && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 px-1">{sections.length} sections</p>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Mobile search */}
        <div className="xl:hidden relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sections…"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-periwinkle-400 bg-gray-50 focus:bg-white transition"
          />
        </div>

        {filteredSections.length === 0 && (
          <div className="text-center py-16 text-sm text-gray-400">
            No sections match "{search}"
          </div>
        )}

        {filteredSections.map((section) => {
          const st = states[section.key];
          if (!st) return null;

          return (
            <div
              key={section.key}
              ref={(el) => { sectionRefs.current[section.key] = el; }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden scroll-mt-6"
            >
              {/* Section header — click to collapse/expand */}
              <button
                type="button"
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={cn("w-4 h-4 text-gray-300 shrink-0 transition-transform duration-200", st.expanded ? "rotate-180" : "")}
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{section.label}</p>
                    {section.description && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{section.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {st.saved && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Saved
                    </span>
                  )}
                  <span className="text-[10px] text-gray-300">{section.fields.length} fields</span>
                </div>
              </button>

              {st.expanded && (
                <div className="border-t border-gray-100 px-5 py-5 space-y-4">
                  {section.fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        {field.label}
                        {field.hint && (
                          <span className="ml-2 text-gray-400 font-normal">{field.hint}</span>
                        )}
                      </label>
                      <FieldInput
                        field={field}
                        value={st.values[field.key] ?? ""}
                        onChange={(v) => updateValue(section.key, field.key, v)}
                        onImagePick={() => setImagePickerMeta({ sectionKey: section.key, fieldKey: field.key })}
                        t={t}
                      />
                    </div>
                  ))}

                  {st.error && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2">
                      {st.error}
                    </p>
                  )}

                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => saveSection(section.key, section)}
                      disabled={st.saving}
                      className="px-5 py-2 bg-periwinkle-600 hover:bg-periwinkle-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
                    >
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
          onSelect={(url) => {
            updateValue(imagePickerMeta.sectionKey, imagePickerMeta.fieldKey, url);
            setImagePickerMeta(null);
          }}
          onClose={() => setImagePickerMeta(null)}
        />
      )}
    </div>
  );
}
