import type { CostumeCategory } from "./customers";

export interface MeasurementField {
  key: string;
  letter: string;
  label: string;
  unit: string;
  hint?: string;
  required?: boolean;
}

/** Letter-coded fields matching the client's Massblatt diagrams (A–O, K1/K2, etc.) */
const LETTER_FIELDS: MeasurementField[] = [
  { key: "o", letter: "O", label: "Körpergrösse", unit: "cm", required: true },
  { key: "a", letter: "A", label: "Hals (oben)", unit: "cm", required: true },
  { key: "b", letter: "B", label: "Hals (unten)", unit: "cm", required: true },
  { key: "c1", letter: "C1", label: "Schulterbreite", unit: "cm", required: true },
  { key: "c2", letter: "C2", label: "Rückenbreite", unit: "cm", required: true },
  { key: "d", letter: "D", label: "Brustumfang", unit: "cm", required: true },
  { key: "e", letter: "E", label: "Taillenumfang", unit: "cm", required: true },
  { key: "f1", letter: "F1", label: "Hüfte (vorne)", unit: "cm", required: true },
  { key: "f2", letter: "F2", label: "Hüfte (hinten)", unit: "cm", required: true },
  { key: "g", letter: "G", label: "Oberschenkelumfang", unit: "cm", required: true },
  { key: "h", letter: "H", label: "Knieumfang", unit: "cm", required: true },
  { key: "i1", letter: "I1", label: "Innenbeinlänge (links)", unit: "cm", required: true },
  { key: "i2", letter: "I2", label: "Innenbeinlänge (rechts)", unit: "cm", hint: "Falls abweichend" },
  { key: "k1a", letter: "K1a", label: "Seitenlänge (vorne)", unit: "cm", required: true },
  { key: "k1b", letter: "K1b", label: "Seitenlänge (seitlich)", unit: "cm", required: true },
  { key: "k1c", letter: "K1c", label: "Seitenlänge (hinten)", unit: "cm", required: true },
  { key: "k2a", letter: "K2a", label: "Mitte (vorne)", unit: "cm", required: true },
  { key: "k2b", letter: "K2b", label: "Mitte (seitlich)", unit: "cm", required: true },
  { key: "k2c", letter: "K2c", label: "Mitte (hinten)", unit: "cm", required: true },
  { key: "l", letter: "L", label: "Armlänge", unit: "cm", required: true },
  { key: "m", letter: "M", label: "Handgelenkumfang", unit: "cm" },
  { key: "n", letter: "N", label: "Oberarmumfang", unit: "cm", required: true },
];

const CHILD_OPTIONAL: Set<string> = new Set(["i2", "m", "k1c", "k2c"]);

export function getFieldsForCategory(category: CostumeCategory): MeasurementField[] {
  if (category === "Kinder") {
    return LETTER_FIELDS.map((field) =>
      CHILD_OPTIONAL.has(field.key) ? { ...field, required: false } : field
    );
  }
  return LETTER_FIELDS;
}

export function getRequiredFieldKeys(category: CostumeCategory): string[] {
  return getFieldsForCategory(category)
    .filter((f) => f.required)
    .map((f) => f.key);
}

export const MEASUREMENT_DIAGRAM: Record<CostumeCategory, string> = {
  Herren: "/images/figures/man-measurement.svg",
  Damen: "/images/figures/woman-measurement.svg",
  Kinder: "/images/figures/child-measurement.svg",
};
