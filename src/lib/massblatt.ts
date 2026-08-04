import { access } from "fs/promises";
import path from "path";

/** Authenticated portal download routes (not public static files). */
export const MASSBLATT_PDF_HREF = "/kundenbereich/api/documents/massblatt.pdf";
export const MASSBLATT_LAYOUT_PDF_HREF =
  "/kundenbereich/api/documents/massblatt-layout.pdf";

const ALLOWED_FILES = new Set(["massblatt.pdf", "massblatt-layout.pdf"]);

export function isAllowedMassblattFile(name: string): boolean {
  return ALLOWED_FILES.has(name);
}

/** Absolute path to a private Massblatt PDF (outside public/). */
export function getPrivateMassblattPath(filename: string): string | null {
  if (!isAllowedMassblattFile(filename)) return null;
  return path.join(process.cwd(), "private", "documents", filename);
}

async function privateFileExists(filename: string): Promise<boolean> {
  const full = getPrivateMassblattPath(filename);
  if (!full) return false;
  try {
    await access(full);
    return true;
  } catch {
    return false;
  }
}

export async function massblattPdfAvailable(): Promise<boolean> {
  return privateFileExists("massblatt.pdf");
}

export async function massblattLayoutPdfAvailable(): Promise<boolean> {
  return privateFileExists("massblatt-layout.pdf");
}

export async function getMassblattDownloads(): Promise<{
  primary: boolean;
  layout: boolean;
}> {
  const [primary, layout] = await Promise.all([
    massblattPdfAvailable(),
    massblattLayoutPdfAvailable(),
  ]);
  return { primary, layout };
}
