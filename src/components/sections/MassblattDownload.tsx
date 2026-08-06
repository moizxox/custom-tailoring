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
  /**
   * When false, only show a hint that PDFs are in the Kundenbereich
   * (used on the public Massfertigung page).
   */
  showDownloads?: boolean;
}

/** Massblatt PDF downloads — for Kundenbereich only (authenticated routes). */
export function MassblattDownload({
  available,
  layoutAvailable = false,
  className,
  showDownloads = true,
}: MassblattDownloadProps) {
  if (!showDownloads) {
    return (
      <p className={className ?? "font-sans text-sm text-charcoal-lighter"}>
        Massformulare zum Ausfüllen finden Sie nach dem Login im{" "}
        <Link href="/kundenbereich/login" className="text-periwinkle-dark hover:underline">
          Kundenbereich
        </Link>
        .
      </p>
    );
  }

  if (!available && !layoutAvailable) {
    return (
      <p className={className ?? "font-sans text-sm text-charcoal-lighter"}>
        Das Massblatt-PDF wird hier bereitgestellt, sobald es hinterlegt ist.
        Sie können Ihre Masse auch digital in diesem Formular erfassen.
      </p>
    );
  }

  return (
    <div className={className}>
      <p className="font-sans text-xs text-charcoal-light mb-3">
        Massformular als PDF herunterladen (nur für Sie sichtbar):
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
        {available && (
          <a
            href={MASSBLATT_PDF_HREF}
            className="btn-outline-dark inline-flex justify-center text-sm"
          >
            Massformular als PDF
          </a>
        )}
        {layoutAvailable && (
          <a
            href={MASSBLATT_LAYOUT_PDF_HREF}
            className="btn-outline-dark inline-flex justify-center text-sm"
          >
            Alternativlayout (1 Seite)
          </a>
        )}
      </div>
    </div>
  );
}
