import type { CostumeCategory } from "./customers";

export interface MeasurementField {
  key: string;
  letter: string;
  label: string;
  unit: string;
  hint?: string;
  required?: boolean;
}

/** Letter-coded fields matching the client's Massblatt diagrams (A–O, K1/K2, etc.)
 *  None are hard-required — garment type determines which values matter.
 */
const LETTER_FIELDS: MeasurementField[] = [
  { key: "o", letter: "O", label: "Körpergrösse", unit: "cm" },
  { key: "a", letter: "A", label: "Hals (oben)", unit: "cm" },
  { key: "b", letter: "B", label: "Hals (unten)", unit: "cm" },
  { key: "c1", letter: "C1", label: "Schulterbreite", unit: "cm" },
  { key: "c2", letter: "C2", label: "Rückenbreite", unit: "cm" },
  { key: "d", letter: "D", label: "Brustumfang", unit: "cm" },
  { key: "e", letter: "E", label: "Taillenumfang", unit: "cm" },
  { key: "f1", letter: "F1", label: "Hüfte (vorne)", unit: "cm" },
  { key: "f2", letter: "F2", label: "Hüfte (hinten)", unit: "cm" },
  { key: "g", letter: "G", label: "Oberschenkelumfang", unit: "cm" },
  { key: "h", letter: "H", label: "Knieumfang", unit: "cm" },
  { key: "i1", letter: "I1", label: "Innenbeinlänge (links)", unit: "cm" },
  { key: "i2", letter: "I2", label: "Innenbeinlänge (rechts)", unit: "cm", hint: "Falls abweichend" },
  { key: "k1a", letter: "K1a", label: "Seitenlänge (vorne)", unit: "cm" },
  { key: "k1b", letter: "K1b", label: "Seitenlänge (seitlich)", unit: "cm" },
  { key: "k1c", letter: "K1c", label: "Seitenlänge (hinten)", unit: "cm" },
  { key: "k2a", letter: "K2a", label: "Mitte (vorne)", unit: "cm" },
  { key: "k2b", letter: "K2b", label: "Mitte (seitlich)", unit: "cm" },
  { key: "k2c", letter: "K2c", label: "Mitte (hinten)", unit: "cm" },
  { key: "l", letter: "L", label: "Armlänge", unit: "cm" },
  { key: "m", letter: "M", label: "Handgelenkumfang", unit: "cm" },
  { key: "n", letter: "N", label: "Oberarmumfang", unit: "cm" },
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
