/** Product categories used in admin and on product cards. */
export const PRODUCT_CATEGORIES = [
  "Basler Fasnachtskostüme",
  "Fasnachtskostüme (Lager)",
  "Kinder Fasnachtskostüme (Lager)",
  "Zubehör",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const DEFAULT_PRODUCT_CATEGORY: ProductCategory = "Basler Fasnachtskostüme";
