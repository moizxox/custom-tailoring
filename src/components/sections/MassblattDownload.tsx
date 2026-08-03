import Link from "next/link";
import {
  MASSBLATT_LAYOUT_PDF_HREF,
  MASSBLATT_PDF_HREF,
} from "@/lib/massblatt";

interface MassblattDownloadProps {
  available: boolean;
  /** Alternate one-page layout PDF */
  layoutAvailable?: boolean;
  className?: string;
}

/** Public Massblatt PDF download — only shown when files exist under public/documents/. */
export function MassblattDownload({
  available,
  layoutAvailable = false,
  className,
}: MassblattDownloadProps) {
  if (!available && !layoutAvailable) {
    return (
      <p className={className ?? "font-sans text-sm text-charcoal-lighter"}>
        Das Massblatt-PDF wird hier zum Download bereitgestellt, sobald es hinterlegt ist.
        Kundinnen und Kunden mit Auftrag nutzen den{" "}
        <Link href="/kundenbereich/login" className="text-periwinkle-dark hover:underline">
          Kundenbereich
        </Link>{" "}
        für die digitale Masseingabe.
      </p>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
        {available && (
          <a
            href={MASSBLATT_PDF_HREF}
            download
            className="btn-outline-dark inline-flex justify-center text-sm"
          >
            Massformular als PDF herunterladen
          </a>
        )}
        {layoutAvailable && (
          <a
            href={MASSBLATT_LAYOUT_PDF_HREF}
            download
            className="btn-outline-dark inline-flex justify-center text-sm"
          >
            Alternativlayout (1 Seite)
          </a>
        )}
      </div>
      <p className="font-sans text-xs text-charcoal-lighter mt-3">
        Oder Masse digital im{" "}
        <Link href="/kundenbereich/login" className="text-periwinkle-dark hover:underline">
          Kundenbereich
        </Link>{" "}
        erfassen.
      </p>
    </div>
  );
}
