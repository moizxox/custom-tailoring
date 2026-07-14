import Image from "next/image";
import { cn } from "@/lib/utils";
import { CmsSectionShell } from "@/components/cms/CmsSectionShell";
import { parseSectionAppearance } from "@/lib/cms/section-appearance";

const CDN = "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei";
const MARQUEE_PHOTOS = [
  { src: `${CDN}/atelier/atelier-1.png`, alt: "Atelier – Werkstatt" },
  { src: `${CDN}/gallery/schloesslischraenzer-major.jpg`, alt: "Schlösslischränzer Major" },
  { src: `${CDN}/atelier/atelier-2.jpg`, alt: "Näharbeit im Atelier" },
  { src: `${CDN}/gallery/gwuerztraminer-2026.jpg`, alt: "Gwürztraminer Waageclique" },
  { src: `${CDN}/atelier/atelier-3.jpg`, alt: "Stoffe und Materialien" },
  { src: `${CDN}/gallery/waageclique-edelwaggis.jpg`, alt: "Edelwaggis Waageclique" },
  { src: `${CDN}/gallery/baenkli-clique.jpg`, alt: "Bänkli Clique" },
  { src: `${CDN}/gallery/waggis-clique.jpg`, alt: "Waggis Clique" },
];

interface PhotoMarqueeProps {
  className?: string;
  acf?: {
    section_label?: string;
    heading?: string;
    heading_accent?: string;
    subtext?: string;
    photos?: { src: string; alt: string }[];
  } & Record<string, unknown>;
}

const DEFAULT_COPY = {
  section_label: "Im Atelier",
  heading: "Wo Ihre Kostüme",
  heading_accent: "entstehen",
  subtext:
    "Ein Blick hinter die Kulissen — Werkstatt, Stoffe und fertige Arbeiten aus unserem Atelier in Basel.",
};

export function PhotoMarquee({ className, acf }: PhotoMarqueeProps) {
  const photos = Array.isArray(acf?.photos) && acf.photos.length > 0
    ? acf.photos
    : MARQUEE_PHOTOS;
  const track = [...photos, ...photos];
  const data = { ...DEFAULT_COPY, ...acf };
  const appearance = parseSectionAppearance(acf);

  return (
    <CmsSectionShell
      appearance={appearance}
      defaultClassName="section-bg-white"
      className={cn("py-16 lg:py-20 border-t border-stone-light/50", className)}
    >
      <div className="container-site text-center mb-10 lg:mb-12" aria-label="Impressionen aus dem Atelier">
        <div className="divider-ornament justify-center mb-5">
          <span>{data.section_label}</span>
        </div>
        <h2 className="section-heading mb-4">
          {data.heading}{" "}
          {data.heading_accent && (
            <span className="text-periwinkle-dark">{data.heading_accent}</span>
          )}
        </h2>
        <p className="section-subtext max-w-lg mx-auto">
          {data.subtext}
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
          {track.map((photo, index) => (
            <div
              key={`${photo.src}-${index}`}
              className="relative shrink-0 w-[min(72vw,420px)] h-56 sm:h-64 mx-2 sm:mx-3 rounded-2xl overflow-hidden border border-stone-light/70 shadow-soft"
            >
              <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="420px" priority={index < 4} />
            </div>
          ))}
        </div>
      </div>
    </CmsSectionShell>
  );
}
