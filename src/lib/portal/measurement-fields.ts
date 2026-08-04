import type { CostumeCategory } from "./customers";

export interface MeasurementField {
  key: string;
  letter: string;
  label: string;
  unit: string;
  hint?: string;
  required?: boolean;
}

/**
 * Letter-coded body measurements aligned with Linvara Massformular
 * Aligned with Linvara Massformular (private/documents/massblatt.pdf).
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
