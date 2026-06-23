import type { CostumeCategory } from "./customers";

export interface MeasurementField {
  key: string;
  label: string;
  unit: string;
  hint?: string;
  required?: boolean;
}

const BASE_FIELDS: MeasurementField[] = [
  { key: "koerpergroesse", label: "Körpergrösse", unit: "cm", required: true },
  { key: "brust", label: "Brustumfang", unit: "cm", required: true },
  { key: "taille", label: "Taillenumfang", unit: "cm", required: true },
  { key: "huefte", label: "Hüftumfang", unit: "cm", required: true },
  { key: "schulterbreite", label: "Schulterbreite", unit: "cm", required: true },
  { key: "armlaenge", label: "Armlänge", unit: "cm", required: true },
  { key: "rueckenlaenge", label: "Rückenlänge", unit: "cm", required: true },
];

const EXTRA_BY_CATEGORY: Record<CostumeCategory, MeasurementField[]> = {
  Herren: [
    { key: "halsgrösse", label: "Halsumfang", unit: "cm" },
    { key: "innenbeinlaenge", label: "Innenbeinlänge", unit: "cm" },
  ],
  Damen: [
    { key: "halsgrösse", label: "Halsumfang", unit: "cm" },
    { key: "innenbeinlaenge", label: "Innenbeinlänge", unit: "cm" },
  ],
  Kinder: [
    { key: "halsgrösse", label: "Halsumfang", unit: "cm" },
    { key: "innenbeinlaenge", label: "Innenbeinlänge", unit: "cm", hint: "Optional bei Kleinkindern" },
  ],
};

export function getFieldsForCategory(category: CostumeCategory): MeasurementField[] {
  return [...BASE_FIELDS, ...EXTRA_BY_CATEGORY[category]];
}

export const MEASUREMENT_DIAGRAM: Record<CostumeCategory, string> = {
  Herren: "/images/figures/man-measurement.png",
  Damen: "/images/figures/woman-measurement.png",
  Kinder: "/images/figures/child-measurement.png",
};
