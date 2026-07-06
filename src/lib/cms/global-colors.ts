import { getSiteSetting } from "@/lib/cms/content";
import { GLOBAL_COLOR_GROUPS } from "@/lib/cms/color-config";

export type GlobalColors = Record<string, string>;

/** Returns saved global colors merged with CSS defaults. Safe for server components. */
export async function getGlobalColors(): Promise<GlobalColors> {
  const defaults: GlobalColors = {};
  GLOBAL_COLOR_GROUPS.forEach((g) =>
    g.colors.forEach((c) => { defaults[c.cssVar] = c.defaultValue; })
  );

  const saved = await getSiteSetting<GlobalColors>("global_colors", {});
  return { ...defaults, ...saved };
}

/** Builds a <style> tag string to inject CSS variable overrides. */
export function buildColorStyleTag(colors: GlobalColors): string {
  const vars = Object.entries(colors)
    .filter(([, v]) => v && v !== "")
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `:root {\n${vars}\n}`;
}
