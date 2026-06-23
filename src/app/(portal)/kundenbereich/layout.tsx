import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kundenbereich",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      {children}
      <footer className="border-t border-stone-light/60 py-4 text-center mt-auto">
        <p className="text-[10px] font-sans text-charcoal-lighter">
          Geschützter Bereich · Nur für Kundinnen und Kunden mit laufendem Auftrag
        </p>
      </footer>
    </div>
  );
}
