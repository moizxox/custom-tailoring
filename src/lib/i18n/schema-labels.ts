import type { CmsField, CmsPageSchema, CmsSection } from "@/lib/cms/page-schemas";

export type SchemaTranslator = {
  has: (key: string) => boolean;
  (key: string, values?: Record<string, string | number>): string;
};

function fieldLabel(t: SchemaTranslator, slug: string, sectionKey: string, field: CmsField): string {
  const key = `${slug}.${sectionKey}.fields.${field.key}.label`;
  return t.has(key) ? t(key) : field.label;
}

function fieldHint(t: SchemaTranslator, slug: string, sectionKey: string, field: CmsField): string | undefined {
  if (!field.hint) return undefined;
  const key = `${slug}.${sectionKey}.fields.${field.key}.hint`;
  return t.has(key) ? t(key) : field.hint;
}

export function localizeSection(
  t: SchemaTranslator,
  slug: string,
  section: CmsSection
): CmsSection {
  const sectionLabelKey = `${slug}.${section.key}.label`;
  const sectionDescKey = `${slug}.${section.key}.description`;

  return {
    ...section,
    label: t.has(sectionLabelKey) ? t(sectionLabelKey) : section.label,
    description: section.description
      ? t.has(sectionDescKey)
        ? t(sectionDescKey)
        : section.description
      : undefined,
    fields: section.fields.map((field) => ({
      ...field,
      label: fieldLabel(t, slug, section.key, field),
      hint: fieldHint(t, slug, section.key, field),
    })),
  };
}

export function localizePageSchema(t: SchemaTranslator, schema: CmsPageSchema): CmsPageSchema {
  const pageLabelKey = `${schema.slug}.label`;

  return {
    ...schema,
    label: t.has(pageLabelKey) ? t(pageLabelKey) : schema.label,
    sections: schema.sections.map((section) => localizeSection(t, schema.slug, section)),
  };
}
