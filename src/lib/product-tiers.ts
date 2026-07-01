export const TIER_KEYS = ["einfach", "standard", "premium"] as const;
export type TierKey = (typeof TIER_KEYS)[number];

export const TIER_LABELS: Record<TierKey, string> = {
  einfach: "Einfach",
  standard: "Standard",
  premium: "Premium",
};

/** Bronze / silver / gold styling for quality tiers. */
export const TIER_STYLES: Record<
  TierKey,
  {
    pill: string;
    pillSelected: string;
    dot: string;
    accent: string;
    ring: string;
    border: string;
  }
> = {
  einfach: {
    pill: "border-[#c48a4a]/50 bg-[#c48a4a]/8 text-charcoal hover:border-[#c48a4a]/70",
    pillSelected: "border-[#b87333] bg-gradient-to-br from-[#d4a574] to-[#b87333] text-white shadow-[0_2px_14px_rgba(184,115,51,0.4)]",
    dot: "bg-[#b87333]",
    accent: "text-[#b87333]",
    ring: "ring-[#c48a4a]/30",
    border: "border-[#c48a4a]/45",
  },
  standard: {
    pill: "border-[#b8bcc4]/60 bg-[#b8bcc4]/10 text-charcoal hover:border-[#9aa0ab]/80",
    pillSelected: "border-[#9aa0ab] bg-gradient-to-br from-[#e8eaed] to-[#b8bcc4] text-charcoal shadow-[0_2px_14px_rgba(154,160,171,0.35)]",
    dot: "bg-[#9aa0ab]",
    accent: "text-[#7a808a]",
    ring: "ring-[#b8bcc4]/40",
    border: "border-[#b8bcc4]/55",
  },
  premium: {
    pill: "border-[#d4b84a]/50 bg-[#d4b84a]/8 text-charcoal hover:border-[#c9a227]/70",
    pillSelected: "border-[#c9a227] bg-gradient-to-br from-[#f0d878] to-[#c9a227] text-charcoal shadow-[0_2px_14px_rgba(201,162,39,0.4)]",
    dot: "bg-[#c9a227]",
    accent: "text-[#a8861e]",
    ring: "ring-[#d4b84a]/35",
    border: "border-[#d4b84a]/50",
  },
};

export interface TierOption {
  price: string;
  description?: string;
}

export type TierPricing = Partial<Record<TierKey, TierOption>>;

export interface ShopTierDefinition {
  name: string;
  tagline: string;
  features: string[];
}

export function tierLabelToKey(label: string): TierKey | null {
  const normalized = label.trim().toLowerCase();
  if (normalized === "einfach") return "einfach";
  if (normalized === "standard") return "standard";
  if (normalized === "premium") return "premium";
  return null;
}

export function parseTierPricing(raw: unknown): TierPricing {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as TierPricing;
}

export function parseGalleryUrls(raw: unknown, cover?: string | null): string[] {
  const urls: string[] = [];
  if (cover?.trim()) urls.push(cover.trim());
  if (Array.isArray(raw)) {
    for (const entry of raw) {
      if (typeof entry === "string" && entry.trim() && !urls.includes(entry.trim())) {
        urls.push(entry.trim());
      }
    }
  }
  return urls;
}

export function normalizeTierPricing(
  tierPricing: TierPricing | null | undefined,
  legacy: { tier?: string; price?: string },
): TierPricing {
  const parsed = tierPricing ?? {};
  const hasPricing = TIER_KEYS.some((key) => parsed[key]?.price?.trim());
  if (hasPricing) return parsed;

  const key = legacy.tier ? tierLabelToKey(legacy.tier) : null;
  if (key && legacy.price?.trim()) {
    return { [key]: { price: legacy.price.trim() } };
  }
  return {};
}

export function getEnabledTiers(pricing: TierPricing) {
  return TIER_KEYS.filter((key) => pricing[key]?.price?.trim()).map((key) => ({
    key,
    label: TIER_LABELS[key],
    option: pricing[key]!,
  }));
}

function extractNumericPrice(value: string): number | null {
  const match = value.replace(/['']/g, "").match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : null;
}

/** Short label for product cards, e.g. "ab CHF 290.–" or "CHF 640.– – 820.–" */
export function formatProductPriceLabel(pricing: TierPricing, fallback = ""): string {
  const tiers = getEnabledTiers(pricing);
  if (tiers.length === 0) return fallback;

  const amounts = tiers.map((tier) => extractNumericPrice(tier.option.price)).filter((n): n is number => n !== null);
  if (amounts.length === 0) return tiers[0].option.price;

  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  if (min === max) return tiers.find((tier) => extractNumericPrice(tier.option.price) === min)?.option.price ?? fallback;
  return `CHF ${min}.– – ${max}.–`;
}

export function buildStoredPriceLabel(pricing: TierPricing): string {
  return formatProductPriceLabel(pricing, "");
}

export function tierPricingFromForm(
  tiers: Record<TierKey, { price: string; description: string; enabled: boolean }>,
): TierPricing {
  const pricing: TierPricing = {};
  for (const key of TIER_KEYS) {
    const row = tiers[key];
    if (row.enabled && row.price.trim()) {
      pricing[key] = {
        price: row.price.trim(),
        ...(row.description.trim() ? { description: row.description.trim() } : {}),
      };
    }
  }
  return pricing;
}

export function emptyTierPricing(): Record<TierKey, { price: string; description: string; enabled: boolean }> {
  return {
    einfach: { price: "", description: "", enabled: false },
    standard: { price: "", description: "", enabled: false },
    premium: { price: "", description: "", enabled: false },
  };
}

export function tierPricingToForm(pricing: TierPricing) {
  const base = emptyTierPricing();
  for (const key of TIER_KEYS) {
    const option = pricing[key];
    if (option?.price?.trim()) {
      base[key] = {
        price: option.price,
        description: option.description ?? "",
        enabled: true,
      };
    }
  }
  return base;
}

export function mergeTierDefinitions(
  cmsTiers: ShopTierDefinition[],
  pricing: TierPricing,
): Array<ShopTierDefinition & { key: TierKey; price?: string; productDescription?: string; available: boolean }> {
  return TIER_KEYS.map((key) => {
    const cms = cmsTiers.find((tier) => tier.name.toLowerCase() === TIER_LABELS[key].toLowerCase());
    const option = pricing[key];
    return {
      key,
      name: TIER_LABELS[key],
      tagline: cms?.tagline ?? "",
      features: cms?.features ?? [],
      price: option?.price,
      productDescription: option?.description,
      available: Boolean(option?.price?.trim()),
    };
  });
}
