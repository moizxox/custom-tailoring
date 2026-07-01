import { revalidatePath } from "next/cache";
import { PAGE_SCHEMAS } from "@/lib/cms/page-schemas";

/** Bust the cached HTML for one CMS page on the public site. */
export function revalidateCmsPage(slug: string) {
  const page = PAGE_SCHEMAS.find((p) => p.slug === slug);
  if (page) {
    revalidatePath(page.path);
  }
}

/** Shop product list and detail pages. */
export function revalidateShopPage(slug?: string) {
  revalidatePath("/shop");
  if (slug) revalidatePath(`/shop/${slug}`);
}

/** Nav/footer live in the site layout — refresh layout + all public pages. */
export function revalidateSiteShell() {
  revalidatePath("/", "layout");
  for (const page of PAGE_SCHEMAS) {
    revalidatePath(page.path);
  }
}
