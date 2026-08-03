import { access } from "fs/promises";
import path from "path";

/** Primary Linvara Massformular (final 2-page PDF). */
export const MASSBLATT_PDF_HREF = "/documents/massblatt.pdf";

/** Alternate one-page layout with freely arranged fields. */
export const MASSBLATT_LAYOUT_PDF_HREF = "/documents/massblatt-layout.pdf";

async function fileExists(relativeUnderPublic: string): Promise<boolean> {
  try {
    await access(path.join(process.cwd(), "public", ...relativeUnderPublic.split("/")));
    return true;
  } catch {
    return false;
  }
}

export async function massblattPdfAvailable(): Promise<boolean> {
  return fileExists("documents/massblatt.pdf");
}

export async function massblattLayoutPdfAvailable(): Promise<boolean> {
  return fileExists("documents/massblatt-layout.pdf");
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
