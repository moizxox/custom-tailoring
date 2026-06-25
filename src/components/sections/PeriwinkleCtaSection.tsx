import Link from "next/link";

interface PeriwinkleCtaSectionProps {
  heading?: string;
  text?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function PeriwinkleCtaSection({
  heading = "Haben Sie Fragen?",
  text = "Wir beraten Sie gerne persönlich. Buchen Sie ein kostenloses Erstgespräch.",
  primaryLabel = "Termin buchen",
  primaryHref = "/termin",
  secondaryLabel = "Nachricht senden",
  secondaryHref = "/kontakt",
}: PeriwinkleCtaSectionProps) {
  return (
    <section className="py-16 bg-periwinkle-lighter">
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
    </section>
  );
}
