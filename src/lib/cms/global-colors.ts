import { getSiteSetting } from "@/lib/cms/content";
import { GLOBAL_COLOR_GROUPS } from "@/lib/cms/color-config";

export type GlobalColors = Record<string, string>;

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace("#", "");
  if (h.length !== 6) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("")}`;
}

function mix(hexA: string, hexB: string, weightB: number): string {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) return hexA;
  const w = Math.max(0, Math.min(1, weightB));
  return rgbToHex(a[0] * (1 - w) + b[0] * w, a[1] * (1 - w) + b[1] * w, a[2] * (1 - w) + b[2] * w);
}

/** Derive full site palette from the 8 editable base colors */
export function expandPalette(base: GlobalColors): GlobalColors {
  const p = { ...base };
  const white = "#ffffff";
  const black = "#000000";

  if (p["--color-periwinkle-light"] && p["--color-periwinkle"]) {
    p["--color-periwinkle-lighter"] = mix(p["--color-periwinkle-light"], white, 0.45);
    p["--color-periwinkle-dark"] = mix(p["--color-periwinkle"], black, 0.18);
    p["--color-periwinkle-deep"] = mix(p["--color-periwinkle"], black, 0.32);
  }

  if (p["--color-gold-light"] && p["--color-gold"]) {
    p["--color-gold-lighter"] = mix(p["--color-gold-light"], white, 0.35);
    p["--color-gold-dark"] = mix(p["--color-gold"], black, 0.12);
    p["--color-gold-deeper"] = mix(p["--color-gold"], black, 0.22);
    p["--color-gold-muted"] = mix(p["--color-gold-light"], p["--color-gold"], 0.4);
  }

  if (p["--color-offwhite"]) {
    p["--color-offwhite-warm"] = mix(p["--color-offwhite"], p["--color-gold-light"] ?? "#f3ede4", 0.25);
    p["--color-sand"] = mix(p["--color-offwhite"], p["--color-gold"] ?? "#d4c9b8", 0.35);
    p["--color-sand-light"] = mix(p["--color-offwhite"], p["--color-gold-light"] ?? "#f3ede4", 0.5);
  }

  if (p["--color-stone"]) {
    p["--color-stone-light"] = mix(p["--color-stone"], white, 0.4);
    p["--color-warmgrey"] = mix(p["--color-stone"], black, 0.15);
  }

  if (p["--color-charcoal"]) {
    p["--color-charcoal-lighter"] = mix(p["--color-charcoal-light"] ?? p["--color-charcoal"], white, 0.35);
  }

  return p;
}

export async function getGlobalColors(): Promise<GlobalColors> {
  const defaults: GlobalColors = {};
  GLOBAL_COLOR_GROUPS.forEach((g) =>
    g.colors.forEach((c) => { defaults[c.cssVar] = c.defaultValue; })
  );

  const saved = await getSiteSetting<GlobalColors>("global_colors", {});
  return expandPalette({ ...defaults, ...saved });
}

export function buildColorStyleTag(colors: GlobalColors): string {
  const expanded = expandPalette(colors);
  const vars = Object.entries(expanded)
    .filter(([, v]) => v && v !== "")
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `:root {\n${vars}\n}`;
}
