import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
interface AcfGalleryPreview {
  acf_fc_layout: "gallery_preview";
  section_label?: string;
  heading: string;
  heading_accent?: string;
  subtext?: string;
  show_cta: boolean;
  cta_label?: string;
  cta_url?: string;
  preview_items?: { src: string; category: string; title: string }[];
}

const PREVIEW_ITEMS = [
  {
    src: "/images/gallery/schloesslischraenzer-major.jpeg",
    category: "Major",
    title: "Schlösslischränzer Major",
  },
  {
    src: "/images/gallery/gwuerztraminer-2026.jpeg",
    category: "Guggenmusik",
    title: "Gwürztraminer Waageclique",
  },
  {
    src: "/images/gallery/waageclique-edelwaggis.jpeg",
    category: "Clique",
    title: "Edelwaggis Waageclique",
  },
];

const DEFAULT_DATA: AcfGalleryPreview = {
  acf_fc_layout: "gallery_preview",
  section_label: "Unsere Handwerkskunst",
  heading: "Jedes Kostüm",
  heading_accent: "ein Unikat.",
  subtext:
    "Von der Guggenmusik bis zur Einzelanfertigung — jedes Projekt erzählt eine eigene Geschichte. Ein Einblick in unsere Arbeit.",
  show_cta: true,
  cta_label: "Zur Galerie",
  cta_url: "/galerie",
};

interface GalleryPreviewProps {
  acf?: Partial<AcfGalleryPreview>;
}

export function GalleryPreview({ acf }: GalleryPreviewProps) {
  const data = { ...DEFAULT_DATA, ...acf };
  const previewItems = Array.isArray(acf?.preview_items) && acf.preview_items.length > 0
    ? acf.preview_items
    : PREVIEW_ITEMS;

  return (
    <section className="py-24 section-bg-white">
      <div className="container-site">
        <div className="text-center mb-12">
          {data.section_label && (
            <div className="divider-ornament justify-center mb-5">
              <span>{data.section_label}</span>
            </div>
          )}
          <h2 className="section-heading mb-4">
            {data.heading} {data.heading_accent && <em className="italic text-periwinkle-dark">{data.heading_accent}</em>}
          </h2>
          {data.subtext && <p className="section-subtext max-w-md mx-auto">{data.subtext}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {previewItems.map((item) => (
            <Link
              key={item.src}
              href="/galerie"
              className={cn(
                "group relative overflow-hidden rounded-2xl",
                "border border-stone-light hover:border-periwinkle-light",
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
              )}
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-charcoal/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-flex text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full mb-2">
                    {item.category}
                  </span>
                  <p className="font-serif text-lg text-white">{item.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

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
