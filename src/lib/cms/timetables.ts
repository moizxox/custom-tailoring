import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { MEASUREMENT_TIMETABLES, type LocationId } from "@/lib/site-content";

export interface TimetableSlot {
  day: string;
  time: string;
  note?: string;
}

export interface CmsTimetable {
  locationId: LocationId;
  label: string;
  description: string;
  active: boolean;
  slots: TimetableSlot[];
}

function parseSlotLine(line: string): TimetableSlot | null {
  const match = line.trim().match(/^(.+?):\s*(.+?)(?:\s*\((.+)\))?$/);
  if (!match) return null;
  return { day: match[1].trim(), time: match[2].trim(), note: match[3]?.trim() };
}

function parseTimetableItem(item: Record<string, string>, locationId: LocationId): CmsTimetable {
  const fallback = MEASUREMENT_TIMETABLES[locationId];
  const slotsRaw = item.slots ?? "";
  const parsedSlots = splitSlots(slotsRaw);
  return {
    locationId,
    label: item.label || fallback.label,
    description: item.description || fallback.description,
    active: item.active !== "false",
    slots: parsedSlots.length > 0 ? parsedSlots : fallback.slots,
  };
}

function splitSlots(text: string): TimetableSlot[] {
  return text
    .split(/\n/)
    .map(parseSlotLine)
    .filter((s): s is TimetableSlot => s !== null);
}

export async function getMeasurementTimetables(): Promise<CmsTimetable[]> {
  const defaults = getDefaultSectionContent("termin", "timetables");
  const content = await getCmsContent("termin", "timetables", {});
  const merged: Record<string, unknown> = { ...defaults, ...content };
  const items = Array.isArray(merged.items) ? (merged.items as Record<string, string>[]) : [];

  if (items.length === 0) {
    return (["pratteln", "therwil"] as LocationId[]).map((id) => ({
      locationId: id,
      ...MEASUREMENT_TIMETABLES[id],
    }));
  }

  return items.map((item) => {
    const id = (item.locationId === "therwil" ? "therwil" : "pratteln") as LocationId;
    return parseTimetableItem(item, id);
  });
}
