/**
 * Global color palette configuration — shared between server-side global-colors.ts
 * and client-side GlobalColorsEditor component.
 */

export interface GlobalColorConfig {
  cssVar: string;
  label: string;
  description?: string;
  defaultValue: string;
}

export const GLOBAL_COLOR_GROUPS: { group: string; colors: GlobalColorConfig[] }[] = [
  {
    group: "Primary — Periwinkle",
    colors: [
      { cssVar: "--color-periwinkle-lighter", label: "Periwinkle lighter", defaultValue: "#e8eaf7", description: "Section backgrounds" },
      { cssVar: "--color-periwinkle-light", label: "Periwinkle light", defaultValue: "#bcc2e4", description: "Borders, dividers" },
      { cssVar: "--color-periwinkle", label: "Periwinkle", defaultValue: "#9da5d0", description: "Primary buttons, highlights" },
      { cssVar: "--color-periwinkle-dark", label: "Periwinkle dark", defaultValue: "#7880b8", description: "Button hover" },
      { cssVar: "--color-periwinkle-deep", label: "Periwinkle deep", defaultValue: "#565ea0", description: "Accent headings, gradients" },
    ],
  },
  {
    group: "Accent — Gold",
    colors: [
      { cssVar: "--color-gold-lighter", label: "Gold lighter", defaultValue: "#f3ede4", description: "Secondary button bg" },
      { cssVar: "--color-gold-light", label: "Gold light", defaultValue: "#e5ddd0", description: "Hover states" },
      { cssVar: "--color-gold", label: "Gold", defaultValue: "#d4c9b8", description: "Accent elements" },
      { cssVar: "--color-gold-dark", label: "Gold dark", defaultValue: "#c4b8a6", description: "Section labels" },
      { cssVar: "--color-gold-deeper", label: "Gold deeper", defaultValue: "#b5a896", description: "Icon tints" },
      { cssVar: "--color-gold-muted", label: "Gold muted", defaultValue: "#ddd4c6", description: "Dashed lines, dividers" },
    ],
  },
  {
    group: "Neutrals",
    colors: [
      { cssVar: "--color-offwhite", label: "Off-white", defaultValue: "#f8f6f3", description: "Page background" },
      { cssVar: "--color-offwhite-warm", label: "Off-white warm", defaultValue: "#f2efe9", description: "Section tints" },
      { cssVar: "--color-sand", label: "Sand", defaultValue: "#e4d9cc", description: "Card backgrounds" },
      { cssVar: "--color-sand-light", label: "Sand light", defaultValue: "#f0e8df", description: "Hover backgrounds" },
      { cssVar: "--color-stone", label: "Stone", defaultValue: "#d0cbc4", description: "Border accents" },
      { cssVar: "--color-stone-light", label: "Stone light", defaultValue: "#e2dfdc", description: "Input borders" },
      { cssVar: "--color-warmgrey", label: "Warm grey", defaultValue: "#b5afa8", description: "Divider text" },
    ],
  },
  {
    group: "Text",
    colors: [
      { cssVar: "--color-charcoal", label: "Charcoal", defaultValue: "#2c2a28", description: "Main body text" },
      { cssVar: "--color-charcoal-light", label: "Charcoal light", defaultValue: "#5a5754", description: "Secondary text" },
      { cssVar: "--color-charcoal-lighter", label: "Charcoal lighter", defaultValue: "#8a8784", description: "Muted / placeholder text" },
    ],
  },
];
