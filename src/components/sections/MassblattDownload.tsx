import Link from "next/link";

interface MassblattDownloadProps {
  available: boolean;
  className?: string;
}

/** Public Massblatt PDF download — only shown when the file exists under public/documents/. */
export function MassblattDownload({ available, className }: MassblattDownloadProps) {
  if (!available) {
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
      <a
        href="/documents/massblatt.pdf"
        download
        className="btn-outline-dark inline-flex justify-center text-sm"
      >
        Massblatt als PDF herunterladen
      </a>
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
