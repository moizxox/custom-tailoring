"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { BRAND_COLOR_SWATCHES } from "@/lib/cms/color-config";

export interface ColorSwatch {
  label: string;
  value: string;
  cssVar?: string;
}

interface Props {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  swatches?: ColorSwatch[];
  showHex?: boolean;
}

export const BRAND_SWATCHES: ColorSwatch[] = BRAND_COLOR_SWATCHES;

export default function ColorPicker({ value, onChange, label, swatches = BRAND_SWATCHES, showHex = true }: Props) {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(value || "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHex(value || "");
  }, [value]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  function handleHexChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setHex(v);
    if (/^#[0-9A-Fa-f]{6}$/.test(v) || v === "transparent" || v === "") {
      onChange(v);
    }
  }

  function selectSwatch(color: string) {
    setHex(color);
    onChange(color);
    setOpen(false);
  }

  const displayColor = value === "transparent" ? "transparent" : (value?.startsWith("#") ? value : "#ffffff");

  return (
    <div ref={containerRef} className="relative inline-block">
      {label && <span className="block text-xs font-medium text-gray-700 mb-1.5">{label}</span>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-9 h-9 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors shadow-sm flex-shrink-0 overflow-hidden"
          title={value || "Pick a color"}
          style={{ backgroundColor: displayColor }}
          aria-label="Open color picker"
        >
          {(!value || value === "transparent") && (
            <svg viewBox="0 0 36 36" className="w-full h-full text-gray-400">
              <line x1="0" y1="36" x2="36" y2="0" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
        </button>
        {showHex && (
          <input
            type="text"
            value={hex}
            onChange={handleHexChange}
            placeholder="#000000"
            maxLength={20}
            className="w-28 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
          />
        )}
        {value && value !== "" && value !== "transparent" && (
          <button
            type="button"
            onClick={() => { setHex(""); onChange(""); }}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xs"
            title="Clear"
          >
            ✕
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-56">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Brand colors</p>
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {swatches.map((swatch) => (
              <button
                key={swatch.value}
                type="button"
                onClick={() => selectSwatch(swatch.value)}
                title={swatch.label}
                className={`w-9 h-9 rounded-md border-2 transition-all hover:scale-110 hover:shadow-md ${
                  value === swatch.value ? "border-violet-500 ring-2 ring-violet-200" : "border-gray-200 hover:border-gray-400"
                } overflow-hidden flex-shrink-0`}
                style={{ backgroundColor: swatch.value === "transparent" ? undefined : swatch.value }}
              >
                {swatch.value === "transparent" && (
                  <svg viewBox="0 0 36 36" className="w-full h-full text-gray-300">
                    <line x1="0" y1="36" x2="36" y2="0" stroke="currentColor" strokeWidth="2.5" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Custom color</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={displayColor === "transparent" ? "#ffffff" : (displayColor || "#ffffff")}
                onChange={(e) => { setHex(e.target.value); onChange(e.target.value); }}
                className="w-9 h-9 rounded cursor-pointer border border-gray-200"
              />
              <input
                type="text"
                value={hex}
                onChange={handleHexChange}
                placeholder="#000000"
                maxLength={20}
                className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
