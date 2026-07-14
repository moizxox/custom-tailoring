/** Section background styles used across the site */
export const SECTION_GRADIENT_OPTIONS = [
  { value: "default", label: "Default (white)" },
  { value: "clean", label: "Off-white clean" },
  { value: "lavender", label: "Lavender tint" },
  { value: "mint", label: "Mint tint" },
  { value: "blush", label: "Blush tint" },
  { value: "sky", label: "Sky tint" },
  { value: "card-gradient", label: "Card gradient" },
  { value: "card-gradient-glass", label: "Glass gradient" },
  { value: "section-tint", label: "Soft vertical gradient" },
] as const;

export type SectionGradientStyle = (typeof SECTION_GRADIENT_OPTIONS)[number]["value"];

export const GRADIENT_CLASS_MAP: Record<SectionGradientStyle, string> = {
  default: "section-bg-white",
  clean: "section-bg-clean",
  lavender: "section-bg-lavender",
  mint: "section-bg-mint",
  blush: "section-bg-blush",
  sky: "section-bg-sky",
  "card-gradient": "card-gradient",
  "card-gradient-glass": "card-gradient-glass",
  "section-tint": "bg-section-tint",
};

export interface SectionAppearance {
  useCustomBg: boolean;
  bgColor?: string;
  showKonfetti: boolean;
  gradientStyle: SectionGradientStyle;
  textColor?: string;
  accentColor?: string;
}

export function parseBool(value: unknown): boolean {
  return value === true || value === "true";
}

export function parseSectionAppearance(content?: Record<string, unknown> | null): SectionAppearance {
  const raw = content ?? {};
  const gradient = String(raw.gradientStyle ?? "default") as SectionGradientStyle;
  const validGradient = gradient in GRADIENT_CLASS_MAP ? gradient : "default";

  return {
    useCustomBg: parseBool(raw.useCustomBg),
    bgColor: typeof raw.bgColor === "string" && raw.bgColor.trim() ? raw.bgColor : undefined,
    showKonfetti: parseBool(raw.showKonfetti),
    gradientStyle: validGradient,
    textColor: typeof raw.textColor === "string" && raw.textColor.trim() ? raw.textColor : undefined,
    accentColor: typeof raw.accentColor === "string" && raw.accentColor.trim() ? raw.accentColor : undefined,
  };
}
