import Image from "next/image";
import { cn } from "@/lib/utils";

interface ContentPlaceholderSectionProps {
  label?: string;
  heading: string;
  headingAccent?: string;
  body?: string;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  className?: string;
}

export function ContentPlaceholderSection({
  label,
  heading,
  headingAccent,
  body = "Hier können Sie später einen Text einfügen. Beschreiben Sie Ihr Angebot, Ihre Geschichte oder weitere Details zu diesem Abschnitt.",
  imageSrc,
  imageAlt = "",
  imagePosition = "right",
  className,
}: ContentPlaceholderSectionProps) {
  const renderHeading = () => {
    if (!headingAccent || !heading.includes(headingAccent)) return heading;
    const parts = heading.split(headingAccent);
    return (
      <>
        {parts[0]}
        <em className="not-italic italic text-periwinkle-dark">{headingAccent}</em>
        {parts[1]}
      </>
    );
  };

  const imageBlock = imageSrc ? (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-light shadow-soft">
      <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
    </div>
  ) : (
    <div className="relative aspect-[4/3] rounded-2xl border border-dashed border-stone bg-offwhite flex items-center justify-center">
      <p className="font-sans text-sm text-charcoal-lighter px-6 text-center">Foto-Platzhalter</p>
    </div>
  );

  const textBlock = (
    <div>
      {label && <p className="section-label mb-4">{label}</p>}
      <h2 className="font-serif text-3xl text-charcoal mb-5 leading-snug">{renderHeading()}</h2>
      <p className="font-sans text-sm text-charcoal-light leading-relaxed">{body}</p>
    </div>
  );

  return (
    <section className={cn("py-20 bg-offwhite-warm", className)}>
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
    </section>
  );
}
