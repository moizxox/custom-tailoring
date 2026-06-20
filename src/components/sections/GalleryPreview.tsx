import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AcfGalleryPreview } from "@/types";

// ─── Gallery items — no external images; uses sewing SVGs + gradients ─────────
// Replace icon_slug + gradient with real WpImage when WP media is connected
const DEFAULT_ITEMS = [
  {
    id: "massanfertigung",
    category: "Massanfertigung",
    title: "Kostüm im Detail",
    description: "Jedes Kostüm wird nach Ihren Massen gefertigt.",
    icon: "tailor-dummy-fashion-sewing-tailoring.svg",
    gradient: "from-periwinkle-lighter to-sand-light",
  },
  {
    id: "stoffe",
    category: "Stoffe & Materialien",
    title: "Edle Stoffe",
    description: "Hochwertige Materialien aus unserer Auswahl.",
    icon: "fabric-cloth-sewing-tailoring.svg",
    gradient: "from-sand-light to-stone-light",
  },
  {
    id: "handwerk",
    category: "Design & Beratung",
    title: "Handwerk & Kreativität",
    description: "Von der Skizze zum fertigen Unikat.",
    icon: "pencil-sewing-tailoring-drawing.svg",
    gradient: "from-periwinkle-lighter to-offwhite-warm",
  },
];

const DEFAULT_DATA: AcfGalleryPreview = {
  acf_fc_layout: "gallery_preview",
  section_label: "Unsere Handwerkskunst",
  heading: "Jedes Kostüm",
  heading_accent: "ein Unikat.",
  show_cta: true,
  cta_label: "Zur Galerie",
  cta_url: "/galerie",
  items: [],
};

interface GalleryPreviewProps {
  acf?: Partial<AcfGalleryPreview>;
}

export function GalleryPreview({ acf }: GalleryPreviewProps) {
  const data = { ...DEFAULT_DATA, ...acf };

  return (
    <section className="py-24 bg-offwhite">
      <div className="container-site">
        {/* Header */}
        <div className="text-center mb-12">
          {data.section_label && (
            <div className="divider-ornament justify-center mb-5">
              <span>{data.section_label}</span>
            </div>
          )}
          <h2 className="section-heading mb-4">
            {data.heading}{" "}
            {data.heading_accent && (
              <em className="not-italic italic text-periwinkle-dark">
                {data.heading_accent}
              </em>
            )}
          </h2>
          {data.subtext && (
            <p className="section-subtext max-w-md mx-auto">{data.subtext}</p>
          )}
        </div>

        {/* 3-column equal-height grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DEFAULT_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={`/galerie#${item.id}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl",
                "border border-stone-light hover:border-periwinkle-light",
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              )}
            >
              {/* Gradient background card — equal height for all */}
              <div
                className={cn(
                  "flex flex-col items-center justify-center text-center",
                  "bg-gradient-to-br",
                  item.gradient,
                  "h-72 p-8 gap-5"
                )}
              >
                {/* Icon circle */}
                <div className="w-20 h-20 rounded-full bg-white/70 flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={`/icons/sewing/${item.icon}`}
                    alt=""
                    width={40}
                    height={40}
                    className="icon-periwinkle"
                  />
                </div>

                {/* Category pill */}
                <span className="inline-flex items-center bg-white/80 text-periwinkle-deep text-[11px] font-sans font-semibold tracking-[0.15em] uppercase px-3 py-1 rounded-full">
                  {item.category}
                </span>

                {/* Title + desc */}
                <div>
                  <p className="font-serif text-xl text-charcoal mb-2">{item.title}</p>
                  <p className="font-sans text-[13px] text-charcoal-light leading-relaxed max-w-[200px] mx-auto">
                    {item.description}
                  </p>
                </div>

                {/* Hover arrow */}
                <div className="flex items-center gap-1.5 text-periwinkle-dark text-xs font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Mehr entdecken</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        {data.show_cta && data.cta_label && data.cta_url && (
          <div className="mt-10 flex justify-center">
            <Link href={data.cta_url} className="btn-outline-dark inline-flex items-center gap-2">
              {data.cta_label}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
