import type { WpPage, WpProduct, WpPost, WpMenu } from "@/types";

// ─── Config ──────────────────────────────────────────────────────────────────

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WP_URL || "https://cms.kostuemschneiderei.ch";

const WP_API = `${WP_BASE_URL}/wp-json/wp/v2`;
const WC_API = `${WP_BASE_URL}/wp-json/wc/v3`;

const WC_KEY = process.env.WC_CONSUMER_KEY || "";
const WC_SECRET = process.env.WC_CONSUMER_SECRET || "";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function fetchWP<T>(endpoint: string): Promise<T> {
  const url = `${WP_API}${endpoint}`;
  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`WP API error: ${res.status} ${url}`);
  }

  return res.json() as Promise<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizePage(raw: any): WpPage {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title?.rendered ?? "",
    content: raw.content?.rendered ?? "",
    excerpt: raw.excerpt?.rendered ?? "",
    featuredImage: raw._embedded?.["wp:featuredmedia"]?.[0]
      ? {
          id: raw._embedded["wp:featuredmedia"][0].id,
          src: raw._embedded["wp:featuredmedia"][0].source_url,
          alt: raw._embedded["wp:featuredmedia"][0].alt_text ?? "",
          width: raw._embedded["wp:featuredmedia"][0].media_details?.width ?? 0,
          height:
            raw._embedded["wp:featuredmedia"][0].media_details?.height ?? 0,
        }
      : null,
    acf: raw.acf ?? {},
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeProduct(raw: any): WpProduct {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description ?? "",
    shortDescription: raw.short_description ?? "",
    price: raw.price ?? "",
    regularPrice: raw.regular_price ?? "",
    salePrice: raw.sale_price ?? "",
    images: (raw.images ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (img: any) => ({
        id: img.id,
        src: img.src,
        alt: img.alt ?? "",
        width: 0,
        height: 0,
      })
    ),
    categories: (raw.categories ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c: any) => ({ id: c.id, name: c.name, slug: c.slug })
    ),
    inStock: raw.stock_status === "instock",
  };
}

// ─── Pages ───────────────────────────────────────────────────────────────────

export async function getPage(slug: string): Promise<WpPage | null> {
  // In dev without a WP backend, return mock data
  if (!WP_BASE_URL.startsWith("https://cms.")) {
    return getMockPage(slug);
  }

  try {
    const pages = await fetchWP<unknown[]>(
      `/pages?slug=${slug}&_embed=wp:featuredmedia`
    );
    if (!pages.length) return null;
    return sanitizePage(pages[0]);
  } catch {
    return getMockPage(slug);
  }
}

export async function getPages(): Promise<WpPage[]> {
  try {
    const pages = await fetchWP<unknown[]>(
      "/pages?per_page=100&_embed=wp:featuredmedia"
    );
    return pages.map(sanitizePage);
  } catch {
    return [];
  }
}

// ─── Products (WooCommerce) ───────────────────────────────────────────────────

export async function getProducts(perPage = 20): Promise<WpProduct[]> {
  if (!WC_KEY) return getMockProducts();

  try {
    const url = `${WC_API}/products?per_page=${perPage}&consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`;
    const res = await fetch(url, { next: { revalidate: 120 } });
    if (!res.ok) throw new Error("WooCommerce error");
    const raw = await res.json();
    return raw.map(sanitizeProduct);
  } catch {
    return getMockProducts();
  }
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export async function getPosts(perPage = 10): Promise<WpPost[]> {
  try {
    const posts = await fetchWP<unknown[]>(
      `/posts?per_page=${perPage}&_embed=wp:featuredmedia`
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return posts.map((raw: any) => ({
      id: raw.id,
      slug: raw.slug,
      title: raw.title?.rendered ?? "",
      content: raw.content?.rendered ?? "",
      excerpt: raw.excerpt?.rendered ?? "",
      date: raw.date ?? "",
      featuredImage: raw._embedded?.["wp:featuredmedia"]?.[0]
        ? {
            id: raw._embedded["wp:featuredmedia"][0].id,
            src: raw._embedded["wp:featuredmedia"][0].source_url,
            alt: raw._embedded["wp:featuredmedia"][0].alt_text ?? "",
            width: 0,
            height: 0,
          }
        : null,
      categories: (raw._embedded?.["wp:term"]?.[0] ?? []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) => ({ id: c.id, name: c.name, slug: c.slug })
      ),
    }));
  } catch {
    return [];
  }
}

// ─── Navigation Menu ─────────────────────────────────────────────────────────

export async function getMenu(location = "primary"): Promise<WpMenu | null> {
  try {
    const menus = await fetchWP<unknown[]>(`/menus?location=${location}`);
    if (!menus.length) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const menu = menus[0] as any;
    return {
      id: menu.id,
      name: menu.name,
      items: (menu.items ?? []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any): import("@/types").WpMenuItem => ({
          id: item.id,
          title: item.title,
          url: item.url,
          slug: item.object_slug,
          children: [],
        })
      ),
    };
  } catch {
    return null;
  }
}

// ─── Mock / Fallback Data ─────────────────────────────────────────────────────

function getMockPage(slug: string): WpPage {
  const pages: Record<string, Partial<WpPage>> = {
    homepage: {
      title: "Ihre Kostüme. Unser Handwerk.",
      content: "",
      excerpt:
        "Wir begleiten Guggenmusiken, Cliquen und Einzelpersonen von der Idee bis zur letzten Naht.",
    },
    leistungen: { title: "Leistungen", content: "" },
    galerie: { title: "Galerie", content: "" },
    kontakt: { title: "Kontakt", content: "" },
  };

  return {
    id: 0,
    slug,
    title: pages[slug]?.title ?? slug,
    content: pages[slug]?.content ?? "",
    excerpt: pages[slug]?.excerpt ?? "",
    featuredImage: null,
    acf: {},
  };
}

function getMockProducts(): WpProduct[] {
  return [
    {
      id: 1,
      slug: "guggenmusik-kostüm",
      name: "Guggenmusik Kostüm",
      description: "Massgeschneidertes Kostüm für Guggenmusiken",
      shortDescription: "Individuell gefertigt",
      price: "CHF 350",
      regularPrice: "CHF 350",
      salePrice: "",
      images: [],
      categories: [{ id: 1, name: "Guggenmusik", slug: "guggenmusik" }],
      inStock: true,
    },
    {
      id: 2,
      slug: "einzelkostüm",
      name: "Einzelkostüm",
      description: "Massgeschneidertes Einzelkostüm für besondere Anlässe",
      shortDescription: "Massanfertigung",
      price: "CHF 480",
      regularPrice: "CHF 480",
      salePrice: "",
      images: [],
      categories: [{ id: 2, name: "Einzelperson", slug: "einzelperson" }],
      inStock: true,
    },
  ];
}
