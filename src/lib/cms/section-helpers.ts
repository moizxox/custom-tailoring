import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import type { CmsDocumentSection } from "@/components/sections/CmsDocumentSections";
import { parseSectionAppearance } from "@/lib/cms/section-appearance";

export function splitParagraphs(text: string): string[] {
  return text.split(/\n\n+/).filter(Boolean);
}

export function splitLines(text: string): string[] {
  return text.split(/\n/).map((l) => l.trim()).filter(Boolean);
}

export async function getCmsItemsSection<T extends Record<string, string>>(
  pageSlug: string,
  sectionKey: string,
  itemsKey = "items",
): Promise<T[]> {
  const defaults = getDefaultSectionContent(pageSlug, sectionKey);
  const content = await getCmsContent(pageSlug, sectionKey, {});
  const merged: Record<string, unknown> = { ...defaults, ...content };
  const items = merged[itemsKey];
  if (Array.isArray(items) && items.length > 0) return items as T[];
  const fallback = defaults[itemsKey];
  return Array.isArray(fallback) ? (fallback as T[]) : [];
}

export async function getCmsDocumentSections(
  pageSlug: string,
  sectionKey = "sections",
): Promise<{ intro?: string; sections: CmsDocumentSection[]; appearance: ReturnType<typeof parseSectionAppearance> }> {
  const defaults = getDefaultSectionContent(pageSlug, sectionKey);
  const content = await getCmsContent(pageSlug, sectionKey, {});
  const merged: Record<string, unknown> = { ...defaults, ...content };
  const raw = merged.items;
  const items = Array.isArray(raw) ? raw : [];
  return {
    intro: typeof merged.intro === "string" ? merged.intro : undefined,
    appearance: parseSectionAppearance(merged),
    sections: items.map((item) => {
      const row = item as Record<string, string>;
      return {
        title: row.title ?? "",
        headingTag: row.headingTag,
        body: row.body ?? "",
      };
    }),
  };
}

export function mapContentBlock(content: Record<string, unknown>) {
  const paragraphs = typeof content.paragraphs === "string" ? splitParagraphs(content.paragraphs) : [];
  return {
    label: typeof content.label === "string" ? content.label : undefined,
    heading: typeof content.heading === "string" ? content.heading : "",
    headingAccent: typeof content.headingAccent === "string" ? content.headingAccent : undefined,
    paragraphs,
    imageSrc: typeof content.imageSrc === "string" ? content.imageSrc : "",
    imageAlt: typeof content.imageAlt === "string" ? content.imageAlt : "",
    imagePosition: content.imagePosition === "left" ? ("left" as const) : ("right" as const),
    ctaLabel: typeof content.ctaLabel === "string" ? content.ctaLabel : undefined,
    ctaHref: typeof content.ctaUrl === "string" ? content.ctaUrl : typeof content.ctaHref === "string" ? content.ctaHref : undefined,
    appearance: parseSectionAppearance(content),
  };
}
