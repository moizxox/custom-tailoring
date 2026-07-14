"use client";

import { useState } from "react";
import ColorPicker from "@/components/admin/ColorPicker";
import { GLOBAL_COLOR_GROUPS } from "@/lib/cms/color-config";
export type { GlobalColorConfig } from "@/lib/cms/color-config";
export { GLOBAL_COLOR_GROUPS };

interface Props {
  savedColors: Record<string, string>;
  onSave: (colors: Record<string, string>) => Promise<void>;
}

export default function GlobalColorsEditor({ savedColors, onSave }: Props) {
  const [colors, setColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    GLOBAL_COLOR_GROUPS.forEach((g) =>
      g.colors.forEach((c) => {
        initial[c.cssVar] = savedColors[c.cssVar] ?? c.defaultValue;
      })
    );
    return initial;
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function updateColor(cssVar: string, value: string) {
    setSaved(false);
    setColors((prev) => ({ ...prev, [cssVar]: value }));
  }

  function resetToDefaults() {
    const defaults: Record<string, string> = {};
    GLOBAL_COLOR_GROUPS.forEach((g) =>
      g.colors.forEach((c) => { defaults[c.cssVar] = c.defaultValue; })
    );
    setColors(defaults);
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await onSave(colors);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save colors.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-xs text-violet-700 leading-relaxed">
          These colors define your entire website palette. Changes are applied live across all pages. Use the brand swatches or enter a custom hex value. Publish the site to see the effect.
        </p>
      </div>

      {GLOBAL_COLOR_GROUPS.map((group) => (
        <div key={group.group} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{group.group}</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {group.colors.map((colorCfg) => (
              <div key={colorCfg.cssVar} className="flex items-center justify-between px-5 py-3 gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-7 h-7 rounded-md border border-gray-200 flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: colors[colorCfg.cssVar] ?? colorCfg.defaultValue }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">{colorCfg.label}</p>
                    {colorCfg.description && (
                      <p className="text-xs text-gray-400 truncate">{colorCfg.description}</p>
                    )}
                  </div>
                </div>
                <ColorPicker
                  value={colors[colorCfg.cssVar] ?? colorCfg.defaultValue}
                  onChange={(v) => updateColor(colorCfg.cssVar, v)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Palette preview */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Live palette preview</h3>
        <div className="flex flex-wrap gap-1.5">
          {GLOBAL_COLOR_GROUPS.flatMap((g) =>
            g.colors.map((c) => (
              <div
                key={c.cssVar}
                title={`${c.label}: ${colors[c.cssVar] ?? c.defaultValue}`}
                className="w-8 h-8 rounded-md border border-gray-200 shadow-sm"
                style={{ backgroundColor: colors[c.cssVar] ?? c.defaultValue }}
              />
            ))
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
        >
          {saving ? "Saving…" : "Save colors"}
        </button>
        <button
          type="button"
          onClick={resetToDefaults}
          className="px-4 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-lg transition"
        >
          Reset to defaults
        </button>
        {saved && (
          <span className="text-xs text-green-600 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Colors saved!
          </span>
        )}
      </div>
    </div>
  );
}
