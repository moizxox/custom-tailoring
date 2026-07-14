import Image from "next/image";
import Link from "next/link";
import { AccentHeadingText } from "@/components/ui/AccentHeadingText";
import { CmsSectionShell } from "@/components/cms/CmsSectionShell";
import type { SectionAppearance } from "@/lib/cms/section-appearance";
import { cn } from "@/lib/utils";

interface ContentSectionProps {
  label?: string;
  heading: string;
  headingAccent?: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
  className?: string;
  ctaLabel?: string;
  ctaHref?: string;
  appearance?: SectionAppearance;
}

export function ContentSection({
  label,
  heading,
  headingAccent,
  paragraphs,
  imageSrc,
  imageAlt,
  imagePosition = "right",
  className,
  ctaLabel,
  ctaHref,
  appearance,
}: ContentSectionProps) {
  const renderHeading = () => (
    <AccentHeadingText heading={heading} accent={headingAccent} />
  );

  const textBlock = (
    <div>
      {label && <p className="section-label mb-4">{label}</p>}
      <h2 className="font-serif text-3xl text-charcoal mb-5 leading-snug">{renderHeading()}</h2>
      <div className="flex flex-col gap-4">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="font-sans text-sm text-charcoal-light leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="btn-primary inline-flex mt-7">
          {ctaLabel}
        </Link>
      )}
    </div>
  );

  const imageBlock = (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-light shadow-soft">
      <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
    </div>
  );

  return (
    <CmsSectionShell
      appearance={appearance}
      defaultClassName="section-bg-white"
      className={cn("py-20", className)}
    >
      <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {imagePosition === "left" ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </CmsSectionShell>
  );
}
