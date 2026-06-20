import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AcfGalleryPreview, AcfGalleryItem } from "@/types";

// ─── Default ACF data ─────────────────────────────────────────────────────────
// Placeholders until real WP images are connected
const PLACEHOLDER_ITEMS: AcfGalleryItem[] = [
  {
    image: { id: 1, src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80", alt: "Massanfertigung Detail", width: 600, height: 800 },
    category: "Massanfertigung",
    title: "Kostüm im Detail",
  },
  {
    image: { id: 2, src: "https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=600&q=80", alt: "Stoffe & Materialien", width: 600, height: 800 },
    category: "Stoffe & Materialien",
    title: "Edle Stoffe",
  },
  {
    image: { id: 3, src: "https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=600&q=80", alt: "Design & Beratung", width: 600, height: 800 },
    category: "Design & Beratung",
    title: "Handwerk & Kreativität",
  },
];

const DEFAULT_DATA: AcfGalleryPreview = {
  acf_fc_layout: "gallery_preview",
  section_label: "Unsere Handwerkskunst",
  heading: "Jedes Kostüm ein Unikat.",
  show_cta: true,
  cta_label: "Zur Galerie",
  cta_url: "/galerie",
  items: PLACEHOLDER_ITEMS,
};

interface GalleryCardProps {
  item: AcfGalleryItem;
  index: number;
}

function GalleryCard({ item, index }: GalleryCardProps) {
  // Alternate heights for an editorial masonry feel
  const isTall = index === 1;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-stone-light",
        isTall ? "lg:row-span-2" : ""
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={cn("relative w-full", isTall ? "h-[520px] lg:h-full min-h-[480px]" : "h-[320px]")}>
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Category pill */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center bg-white/80 backdrop-blur-sm text-periwinkle-deep text-[11px] font-sans font-semibold tracking-[0.15em] uppercase px-3 py-1 rounded-full">
            {item.category}
          </span>
        </div>

        {/* Title on hover */}
        {item.title && (
          <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <p className="font-serif text-lg text-white leading-snug">{item.title}</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-white/70 text-xs font-sans">
              <span>Mehr entdecken</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
            {data.heading}
          </h2>
          {data.subtext && (
            <p className="section-subtext max-w-md mx-auto">{data.subtext}</p>
          )}
        </div>

        {/* 3-column editorial grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-rows-2 gap-4 auto-rows-[320px]">
          {data.items.map((item, index) => (
            <GalleryCard key={item.image.id} item={item} index={index} />
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
