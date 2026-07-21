import Link from "next/link";
import { CmsSectionShell } from "@/components/cms/CmsSectionShell";
import type { SectionAppearance } from "@/lib/cms/section-appearance";

interface PeriwinkleCtaSectionProps {
  heading?: string;
  text?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  appearance?: SectionAppearance;
}

export function PeriwinkleCtaSection({
  heading = "Haben Sie Fragen?",
  text = "Wir beraten Sie gerne persönlich. Buchen Sie ein kostenloses Erstgespräch.",
  primaryLabel = "Termin buchen",
  primaryHref = "/termin",
  secondaryLabel = "Nachricht senden",
  secondaryHref = "/kontakt",
  appearance,
}: PeriwinkleCtaSectionProps) {
  return (
    <CmsSectionShell appearance={appearance} defaultClassName="bg-periwinkle-lighter" className="py-16">
      <div className="container-site text-center">
        <h2 className="font-serif text-3xl text-charcoal mb-3">{heading}</h2>
        <p className="font-sans text-sm text-charcoal-light mb-7 max-w-md mx-auto">{text}</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href={primaryHref} className="btn-primary">
            {primaryLabel}
          </Link>
          <Link href={secondaryHref} className="btn-outline-dark">
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </CmsSectionShell>
  );
}
