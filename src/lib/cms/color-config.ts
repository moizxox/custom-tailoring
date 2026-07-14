/**
 * Simplified global palette — 2 editable colors per family (light + main).
 * Other CSS variables are auto-derived in global-colors.ts.
 */

export interface GlobalColorConfig {
  cssVar: string;
  label: string;
  description?: string;
  defaultValue: string;
}

/** Only these are shown in Settings → Colors */
export const GLOBAL_COLOR_GROUPS: { group: string; colors: GlobalColorConfig[] }[] = [
  {
    group: "Periwinkle",
    colors: [
      { cssVar: "--color-periwinkle-light", label: "Periwinkle light", defaultValue: "#e8eaf7", description: "Soft backgrounds & tints" },
      { cssVar: "--color-periwinkle", label: "Periwinkle", defaultValue: "#9da5d0", description: "Buttons, accents, highlights" },
    ],
  },
  {
    group: "Gold",
    colors: [
      { cssVar: "--color-gold-light", label: "Gold light", defaultValue: "#f3ede4", description: "Secondary surfaces" },
      { cssVar: "--color-gold", label: "Gold", defaultValue: "#d4c9b8", description: "Labels, dividers, accents" },
    ],
  },
  {
    group: "Neutrals",
    colors: [
      { cssVar: "--color-offwhite", label: "Off-white", defaultValue: "#f8f6f3", description: "Page background" },
      { cssVar: "--color-stone", label: "Stone", defaultValue: "#d0cbc4", description: "Borders & subtle fills" },
    ],
  },
  {
    group: "Text",
    colors: [
      { cssVar: "--color-charcoal", label: "Text", defaultValue: "#2c2a28", description: "Headings & body" },
      { cssVar: "--color-charcoal-light", label: "Text muted", defaultValue: "#5a5754", description: "Subtext & secondary copy" },
    ],
  },
];

/** Compact swatches for section-level color pickers */
export const BRAND_COLOR_SWATCHES = [
  { label: "Periwinkle light", value: "#e8eaf7" },
  { label: "Periwinkle", value: "#9da5d0" },
  { label: "Gold light", value: "#f3ede4" },
  { label: "Gold", value: "#d4c9b8" },
  { label: "Off-white", value: "#f8f6f3" },
  { label: "Stone", value: "#d0cbc4" },
  { label: "Text", value: "#2c2a28" },
  { label: "Text muted", value: "#5a5754" },
  { label: "White", value: "#ffffff" },
  { label: "Transparent", value: "transparent" },
];
