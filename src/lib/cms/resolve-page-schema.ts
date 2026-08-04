import { prisma } from "@/lib/db/prisma";
import {
  buildCustomPageSchema,
  getPageSchema,
  type CmsPageSchema,
} from "@/lib/cms/page-schemas";

/**
 * Fixed PAGE_SCHEMAS first; otherwise a CustomPage row gets the shared Flex pool.
 * Used by order/content APIs and section-order helpers.
 */
export async function resolvePageSchema(slug: string): Promise<CmsPageSchema | undefined> {
  const fixed = getPageSchema(slug);
  if (fixed) return fixed;
  try {
    const custom = await prisma.customPage.findUnique({
      where: { slug },
      select: { slug: true, title: true },
    });
    if (!custom) return undefined;
    return buildCustomPageSchema(custom.slug, custom.title);
  } catch {
    return undefined;
  }
}
