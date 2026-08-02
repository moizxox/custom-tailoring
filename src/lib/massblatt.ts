import { access } from "fs/promises";
import path from "path";

/** Public URL once the PDF is placed at public/documents/massblatt.pdf */
export const MASSBLATT_PDF_HREF = "/documents/massblatt.pdf";

export async function massblattPdfAvailable(): Promise<boolean> {
  try {
    await access(path.join(process.cwd(), "public", "documents", "massblatt.pdf"));
    return true;
  } catch {
    return false;
  }
}
