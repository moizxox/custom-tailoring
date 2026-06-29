"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { CmsSection } from "@/lib/cms/page-schemas";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

interface Props {
  pageSlug: string;
  section: CmsSection;
  initialContent: Record<string, unknown>;
}

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

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Section header */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div>
            <p className="text-sm font-semibold text-gray-900">{section.label}</p>
            {section.description && (
              <p className="text-xs text-gray-400 mt-0.5">{section.description}</p>
            )}
          </div>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {expanded && (
          <div className="border-t border-gray-200 px-5 py-5 space-y-4">
            {section.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {field.label}
                  {field.hint && <span className="ml-2 text-gray-400 font-normal">{field.hint}</span>}
                </label>

                {field.type === "textarea" || field.type === "richtext" ? (
                  <textarea
                    rows={4}
                    value={values[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition resize-y"
                  />
                ) : field.type === "array" ? (
                  <textarea
                    rows={6}
                    value={values[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder ?? t("arrayPlaceholder")}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition resize-y"
                  />
                ) : field.type === "image" ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={values[field.key] ?? ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={t("imagePlaceholder")}
                      className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePickerField(field.key)}
                      className="px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                      {t("chooseImage")}
                    </button>
                  </div>
                ) : field.type === "select" ? (
                  <select
                    value={values[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition bg-white"
                  >
                    <option value="">{t("selectPlaceholder")}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "number" ? (
                  <input
                    type="number"
                    value={values[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
                  />
                ) : (
                  <input
                    type={field.type === "url" ? "url" : "text"}
                    value={values[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition"
                  />
                )}
              </div>
            ))}

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2">{error}</p>
            )}

            <div className="flex items-center justify-between pt-1">
              {saved && (
                <span className="text-xs text-green-600 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t("saved")}
                </span>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="ml-auto px-4 py-2 bg-periwinkle-600 hover:bg-periwinkle-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
              >
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
    } else {
      result[field.key] = v;
    }
  }
  return result;
}
