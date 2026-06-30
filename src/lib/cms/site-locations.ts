import { getSiteSetting } from "@/lib/cms/content";
import { ATELIER_LOCATIONS, type AtelierLocation } from "@/lib/site-content";

/** Atelier locations — Admin Settings `location_*` keys merged with defaults (maps embeds, etc.). */
export async function getAtelierLocations(): Promise<AtelierLocation[]> {
  const [pratteln, therwil] = await Promise.all([
    getSiteSetting<Partial<AtelierLocation>>("location_pratteln", {}),
    getSiteSetting<Partial<AtelierLocation>>("location_therwil", {}),
  ]);

  return ATELIER_LOCATIONS.map((loc) => {
    const saved = loc.id === "pratteln" ? pratteln : loc.id === "therwil" ? therwil : {};
    return { ...loc, ...saved, id: loc.id };
  });
}
