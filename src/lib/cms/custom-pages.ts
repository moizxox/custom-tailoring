export interface CustomPageHero {
  label: string;
  title: string;
  titleAccent: string;
  subtitle: string;
}

export interface CustomPageBlock {
  id: string;
  title: string;
  body: string;
}

export interface CustomPageContent {
  hero: CustomPageHero;
  blocks: CustomPageBlock[];
}

export const EMPTY_CUSTOM_PAGE_CONTENT: CustomPageContent = {
  hero: {
    label: "",
    title: "",
    titleAccent: "",
    subtitle: "",
  },
  blocks: [],
};

export function slugifyPageTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function isValidCustomSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 2 && slug.length <= 80;
}

export function normalizeCustomPageContent(raw: unknown): CustomPageContent {
  if (!raw || typeof raw !== "object") return EMPTY_CUSTOM_PAGE_CONTENT;
  const data = raw as Record<string, unknown>;
  const heroRaw =
    data.hero && typeof data.hero === "object" ? (data.hero as Record<string, unknown>) : {};
  const blocksRaw = Array.isArray(data.blocks) ? data.blocks : [];

  return {
    hero: {
      label: typeof heroRaw.label === "string" ? heroRaw.label : "",
      title: typeof heroRaw.title === "string" ? heroRaw.title : "",
      titleAccent: typeof heroRaw.titleAccent === "string" ? heroRaw.titleAccent : "",
      subtitle: typeof heroRaw.subtitle === "string" ? heroRaw.subtitle : "",
    },
    blocks: blocksRaw
      .filter((b): b is Record<string, unknown> => !!b && typeof b === "object")
      .map((b, i) => ({
        id: typeof b.id === "string" && b.id ? b.id : `block-${i}`,
        title: typeof b.title === "string" ? b.title : "",
        body: typeof b.body === "string" ? b.body : "",
      })),
  };
}
