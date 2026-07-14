"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { CmsSection, FieldType } from "@/lib/cms/page-schemas";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import ColorPicker from "@/components/admin/ColorPicker";
import {
  ChevronDown, ChevronRight, Type, AlignLeft, Image as ImageIcon,
  Link as LinkIcon, Hash, Palette, ToggleLeft, ToggleRight,
  List, Sliders, CheckCircle2, AlertCircle, Loader2
} from "lucide-react";

interface Props {
  pageSlug: string;
  section: CmsSection;
  initialContent: Record<string, unknown>;
}

const FIELD_TYPE_META: Record<FieldType, { icon: React.ElementType; badge: string; color: string }> = {
  text:     { icon: Type,         badge: "Text",      color: "bg-blue-50 text-blue-600 border-blue-100" },
  textarea: { icon: AlignLeft,    badge: "Textarea",  color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  richtext: { icon: AlignLeft,    badge: "Rich",      color: "bg-purple-50 text-purple-600 border-purple-100" },
  image:    { icon: ImageIcon,    badge: "Image",     color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  url:      { icon: LinkIcon,     badge: "URL",       color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
  array:    { icon: List,         badge: "Array",     color: "bg-orange-50 text-orange-600 border-orange-100" },
  select:   { icon: Sliders,      badge: "Select",    color: "bg-amber-50 text-amber-600 border-amber-100" },
  number:   { icon: Hash,         badge: "Number",    color: "bg-rose-50 text-rose-600 border-rose-100" },
  color:    { icon: Palette,      badge: "Color",     color: "bg-pink-50 text-pink-600 border-pink-100" },
  icon:     { icon: ImageIcon,    badge: "Icon",      color: "bg-violet-50 text-violet-600 border-violet-100" },
  toggle:   { icon: ToggleLeft,   badge: "Toggle",    color: "bg-teal-50 text-teal-600 border-teal-100" },
  items:    { icon: List,         badge: "Items",     color: "bg-slate-50 text-slate-600 border-slate-100" },
};

export default function PageSectionEditor({ pageSlug, section, initialContent }: Props) {
  const t = useTranslations("editor");
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(
      section.fields.map((f) => {
        const raw = initialContent[f.key];
        if (typeof raw === "string") return [f.key, raw];
        if (typeof raw === "number") return [f.key, String(raw)];
        if (typeof raw === "object" && raw !== null) return [f.key, JSON.stringify(raw, null, 2)];
        return [f.key, ""];
      })
    )
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [imagePickerField, setImagePickerField] = useState<string | null>(null);

  function handleChange(key: string, value: string) {
    setSaved(false);
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/admin/api/pages/${pageSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionKey: section.key, content: parseContent(values, section) }),
      });
      if (!res.ok) throw new Error("save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError(t("saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  const hasChanges = section.fields.some((f) => {
    const orig = initialContent[f.key];
    const origStr = orig === undefined || orig === null
      ? ""
      : typeof orig === "string" ? orig
      : typeof orig === "number" ? String(orig)
      : JSON.stringify(orig, null, 2);
    return (values[f.key] ?? "") !== origStr;
  });

  return (
    <>
      <div className={`bg-white rounded-xl border overflow-hidden transition-all duration-200 ${
        hasChanges ? "border-violet-300 shadow-sm shadow-violet-100" : "border-gray-200"
      }`}>
        {/* Section header */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50/70 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            {expanded
              ? <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              : <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            }
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">{section.label}</p>
                {hasChanges && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-violet-100 text-violet-600 text-[10px] font-semibold rounded-full uppercase tracking-wide">
                    Unsaved
                  </span>
                )}
              </div>
              {section.description && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">{section.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
            <span className="text-xs text-gray-400">{section.fields.length} field{section.fields.length !== 1 ? "s" : ""}</span>
          </div>
        </button>

        {expanded && (
          <div className="border-t border-gray-100">
            {/* Field grid — group by field type visually */}
            <div className="divide-y divide-gray-50">
              {section.fields.map((field) => {
                const meta = FIELD_TYPE_META[field.type] ?? FIELD_TYPE_META.text;
                const FieldIcon = meta.icon;

                return (
                  <div key={field.key} className="px-5 py-4 group">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <FieldIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        {field.label}
                        {field.hint && (
                          <span className="text-gray-400 font-normal">{field.hint}</span>
                        )}
                      </label>
                      <span className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${meta.color}`}>
                        {meta.badge}
                      </span>
                    </div>

                    {/* Field input based on type */}
                    {field.type === "toggle" ? (
                      <button
                        type="button"
                        onClick={() => handleChange(field.key, values[field.key] === "true" ? "false" : "true")}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all ${
                          values[field.key] === "true"
                            ? "bg-violet-50 border-violet-200 text-violet-700"
                            : "bg-gray-50 border-gray-200 text-gray-500"
                        }`}
                      >
                        {values[field.key] === "true"
                          ? <ToggleRight className="w-5 h-5 text-violet-500" />
                          : <ToggleLeft className="w-5 h-5 text-gray-400" />
                        }
                        <span className="text-sm font-medium">
                          {values[field.key] === "true" ? "Enabled" : "Disabled"}
                        </span>
                      </button>
                    ) : field.type === "color" ? (
                      <div className="flex items-center gap-3">
                        <ColorPicker
                          value={values[field.key] ?? ""}
                          onChange={(v) => handleChange(field.key, v)}
                        />
                        {values[field.key] && (
                          <span className="text-xs text-gray-500 font-mono">{values[field.key]}</span>
                        )}
                      </div>
                    ) : field.type === "textarea" || field.type === "richtext" ? (
                      <textarea
                        rows={4}
                        value={values[field.key] ?? ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all resize-y bg-gray-50/30 focus:bg-white"
                      />
                    ) : field.type === "array" ? (
                      <textarea
                        rows={6}
                        value={values[field.key] ?? ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder ?? t("arrayPlaceholder")}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all resize-y bg-gray-50/30 focus:bg-white"
                      />
                    ) : field.type === "image" ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={values[field.key] ?? ""}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={t("imagePlaceholder")}
                            className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all bg-gray-50/30 focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setImagePickerField(field.key)}
                            className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors whitespace-nowrap"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            {t("chooseImage")}
                          </button>
                        </div>
                        {/* Inline image preview */}
                        {values[field.key] && values[field.key].startsWith("http") && (
                          <div className="relative w-full max-w-xs h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <Image
                              src={values[field.key]}
                              alt="Preview"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                      </div>
                    ) : field.type === "select" ? (
                      <select
                        value={values[field.key] ?? ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all bg-gray-50/30 focus:bg-white appearance-none"
                      >
                        <option value="">{t("selectPlaceholder")}</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    ) : field.type === "number" ? (
                      <input
                        type="number"
                        value={values[field.key] ?? ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all bg-gray-50/30 focus:bg-white"
                      />
                    ) : (
                      <input
                        type={field.type === "url" ? "url" : "text"}
                        value={values[field.key] ?? ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all bg-gray-50/30 focus:bg-white"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Save bar */}
            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-h-[28px]">
                {saved && (
                  <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t("saved")}
                  </span>
                )}
                {error && (
                  <span className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-60 ${
                  hasChanges
                    ? "bg-violet-600 hover:bg-violet-700 shadow-sm shadow-violet-200"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {saving ? t("saving") : t("save")}
              </button>
            </div>
          </div>
        )}
      </div>

      {imagePickerField && (
        <MediaPickerModal
          onSelect={(url) => {
            handleChange(imagePickerField, url);
            setImagePickerField(null);
          }}
          onClose={() => setImagePickerField(null)}
        />
      )}
    </>
  );
}

function parseContent(
  values: Record<string, string>,
  section: CmsSection
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const field of section.fields) {
    const v = values[field.key] ?? "";
    if (field.type === "array") {
      try {
        result[field.key] = JSON.parse(v);
      } catch {
        result[field.key] = v;
      }
    } else if (field.type === "number") {
      const n = parseFloat(v);
      result[field.key] = Number.isFinite(n) ? n : v;
    } else if (field.type === "toggle") {
      result[field.key] = v === "true";
    } else {
      result[field.key] = v;
    }
  }
  return result;
}
