/** Authenticated portal download routes (not public static files). */
export const MASSBLATT_PDF_HREF = "/kundenbereich/api/documents/massblatt.pdf";
export const MASSBLATT_LAYOUT_PDF_HREF =
  "/kundenbereich/api/documents/massblatt-layout.pdf";

const ALLOWED_FILES = new Set(["massblatt.pdf", "massblatt-layout.pdf"]);

export function isAllowedMassblattFile(name: string): boolean {
  return ALLOWED_FILES.has(name);
}
