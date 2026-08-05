import type { CostumeCategory } from "./customers";

export interface MeasurementField {
  key: string;
  letter: string;
  label: string;
  unit: string;
  hint?: string;
  required?: boolean;
}

/** Personal / fit details from the revised Linvara Massformular */
export interface PersonalMeasurementInfo {
  firstName: string;
  lastName: string;
  groupName?: string;
  bodyShape?: "female" | "male";
  birthYear?: string;
  heightCm?: string;
  sizeTop?: string;
  sizeBottom?: string;
  email?: string;
  phone?: string;
  guardianContact?: string;
  underClothes?: string[];
  underClothesOther?: string;
  handedness?: "left" | "right";
  measuredAt?: string;
  measuredPerInstructions?: boolean;
  consent?: boolean;
}

export const UNDER_CLOTHES_OPTIONS = [
  { value: "unterhemd", label: "Unterhemd" },
  { value: "tshirt", label: "T-Shirt / Hemd" },
  { value: "thermoshirt", label: "Thermoshirt" },
  { value: "pullover", label: "Pullover" },
  { value: "fleecejacke", label: "Fleecejacke" },
  { value: "leichte-jacke", label: "leichte Jacke" },
  { value: "mehrere-schichten", label: "mehrere Schichten" },
  { value: "andere", label: "Andere" },
] as const;

/**
 * Letter-coded body measurements aligned with Linvara Massformular
 * (private/documents/massblatt.pdf).
 * None are hard-required — garment type determines which values matter.
 */
const LETTER_FIELDS: MeasurementField[] = [
  { key: "a", letter: "A", label: "Kopfumfang", unit: "cm" },
  { key: "b", letter: "B", label: "Halsumfang", unit: "cm" },
  { key: "c1", letter: "C1", label: "Schulterbreite vorne", unit: "cm" },
  { key: "c2", letter: "C2", label: "Schulterbreite hinten", unit: "cm" },
  { key: "d", letter: "D", label: "Brustumfang", unit: "cm" },
  { key: "e", letter: "E", label: "Taillenumfang", unit: "cm" },
  { key: "f1", letter: "F1", label: "Bundumfang auf Bauchnabelhöhe", unit: "cm" },
  { key: "f2", letter: "F2", label: "Hüftumfang", unit: "cm" },
  { key: "g", letter: "G", label: "Oberschenkelumfang", unit: "cm" },
  { key: "h", letter: "H", label: "Wadenumfang", unit: "cm" },
  { key: "i1", letter: "I1", label: "Ab Bundhöhe bis Knie", unit: "cm" },
  { key: "i2", letter: "I2", label: "Ab Bundhöhe bis Knöchel", unit: "cm" },
  {
    key: "k1a",
    letter: "K1a",
    label: "Mitte Schulter über Brust bis angezeigte Linie",
    unit: "cm",
  },
  {
    key: "k1b",
    letter: "K1b",
    label: "Mitte Schulter über Brust bis Kniehöhe",
    unit: "cm",
  },
  {
    key: "k1c",
    letter: "K1c",
    label: "Mitte Schulter über Brust bis Knöchel",
    unit: "cm",
  },
  { key: "k2a", letter: "K2a", label: "Nackenmitte bis Bundhöhe", unit: "cm" },
  {
    key: "k2b",
    letter: "K2b",
    label: "Nackenmitte bis Höhe der Kniekehlen",
    unit: "cm",
  },
  { key: "k2c", letter: "K2c", label: "Nackenmitte bis Knöchel", unit: "cm" },
  { key: "n", letter: "N", label: "Armlochumfang", unit: "cm" },
  { key: "m", letter: "M", label: "Oberarmumfang", unit: "cm" },
  { key: "l", letter: "L", label: "Ärmellänge", unit: "cm" },
  { key: "o", letter: "O", label: "Körpergrösse", unit: "cm" },
];

export const MEASUREMENT_LETTER_KEYS = new Set(LETTER_FIELDS.map((f) => f.key));

export function getFieldsForCategory(category: CostumeCategory): MeasurementField[] {
  void category;
  return LETTER_FIELDS;
}

export function getRequiredFieldKeys(_category: CostumeCategory): string[] {
  return [];
}

export const MEASUREMENT_DIAGRAM: Record<CostumeCategory, string> = {
  Herren: "/images/figures/man-measurement.svg",
  Damen: "/images/figures/woman-measurement.svg",
  Kinder: "/images/figures/child-measurement.svg",
};

const UNDER_LABEL: Record<string, string> = Object.fromEntries(
  UNDER_CLOTHES_OPTIONS.map((o) => [o.value, o.label]),
);

/** Format personal Massformular fields for CRM notes readability */
export function formatPersonalNotes(personal: PersonalMeasurementInfo): string {
  const lines: string[] = ["Persönliche Angaben (Massformular):"];
  lines.push(`Name: ${personal.firstName} ${personal.lastName}`.trim());
  if (personal.groupName) lines.push(`Gruppe / Verein: ${personal.groupName}`);
  if (personal.bodyShape === "female") lines.push("Körperform: weiblich");
  if (personal.bodyShape === "male") lines.push("Körperform: männlich");
  if (personal.birthYear) lines.push(`Geburtsjahr (Kinder): ${personal.birthYear}`);
  if (personal.heightCm) lines.push(`Körpergrösse: ${personal.heightCm} cm`);
  if (personal.sizeTop || personal.sizeBottom) {
    lines.push(
      `Konfektion: Oberteil ${personal.sizeTop || "—"} / Hose ${personal.sizeBottom || "—"}`,
    );
  }
  if (personal.email) lines.push(`E-Mail: ${personal.email}`);
  if (personal.phone) lines.push(`Telefon: ${personal.phone}`);
  if (personal.guardianContact) {
    lines.push(`Kontaktperson bei Minderjährigen: ${personal.guardianContact}`);
  }
  if (personal.underClothes?.length) {
    const labels = personal.underClothes.map((v) => UNDER_LABEL[v] ?? v);
    lines.push(`Kleidung unter dem Kostüm: ${labels.join(", ")}`);
  }
  if (personal.underClothesOther) {
    lines.push(`Andere Kleidung: ${personal.underClothesOther}`);
  }
  if (personal.handedness === "left") lines.push("Händigkeit: Linkshänder/in");
  if (personal.handedness === "right") lines.push("Händigkeit: Rechtshänder/in");
  if (personal.measuredAt) lines.push(`Datum der Massaufnahme: ${personal.measuredAt}`);
  if (personal.measuredPerInstructions) {
    lines.push("✓ Masse gemäss Anleitung aufgenommen");
  }
  if (personal.consent) {
    lines.push("✓ Einverständnis zur Verarbeitung der Angaben");
  }
  return lines.join("\n");
}

export function parsePersonalFromFormData(formData: FormData): PersonalMeasurementInfo {
  const str = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v.trim() : "";
  };
  const underClothes = formData
    .getAll("underClothes")
    .filter((v): v is string => typeof v === "string" && v.length > 0);

  const bodyShapeRaw = str("bodyShape");
  const handednessRaw = str("handedness");

  return {
    firstName: str("firstName"),
    lastName: str("lastName"),
    groupName: str("groupName") || undefined,
    bodyShape:
      bodyShapeRaw === "female" || bodyShapeRaw === "male" ? bodyShapeRaw : undefined,
    birthYear: str("birthYear") || undefined,
    heightCm: str("heightCm") || undefined,
    sizeTop: str("sizeTop") || undefined,
    sizeBottom: str("sizeBottom") || undefined,
    email: str("email") || undefined,
    phone: str("phone") || undefined,
    guardianContact: str("guardianContact") || undefined,
    underClothes: underClothes.length ? underClothes : undefined,
    underClothesOther: str("underClothesOther") || undefined,
    handedness:
      handednessRaw === "left" || handednessRaw === "right" ? handednessRaw : undefined,
    measuredAt: str("measuredAt") || undefined,
    measuredPerInstructions: formData.get("measuredPerInstructions") === "on",
    consent: formData.get("consent") === "on",
  };
}
