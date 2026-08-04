import { renderModularSection } from "@/components/cms/FlexiblePageSections";
import { isModularSectionKey } from "@/lib/cms/modular-sections";
import {
  filterVisibleSectionKeys,
  getPageHiddenSections,
  getPageSectionOrder,
} from "@/lib/cms/section-order";

type SectionRenderer = () => React.ReactNode;

/**
 * Renders a page's native section map in CMS order, respecting hide settings,
 * and interleaving modular flex_* building blocks where they appear in the order.
 */
export async function renderOrderedPageSections(
  pageSlug: string,
  renderers: Record<string, SectionRenderer>,
): Promise<React.ReactNode[]> {
  const [order, hidden] = await Promise.all([
    getPageSectionOrder(pageSlug),
    getPageHiddenSections(pageSlug),
  ]);
  const visibleOrder = filterVisibleSectionKeys(order, hidden);

  return Promise.all(
    visibleOrder.map(async (key) => {
      if (key in renderers) {
        return <div key={key}>{renderers[key]()}</div>;
      }
      if (isModularSectionKey(key)) {
        const node = await renderModularSection(pageSlug, key);
        return node ? <div key={key}>{node}</div> : null;
      }
      return null;
    }),
  );
}
