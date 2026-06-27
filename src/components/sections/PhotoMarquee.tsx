import Image from "next/image";
import { cn } from "@/lib/utils";

const MARQUEE_PHOTOS = [
  { src: "/images/atelier/atelier-1.png", alt: "Atelier – Werkstatt" },
  { src: "/images/gallery/schloesslischraenzer-major.jpeg", alt: "Schlösslischränzer Major" },
  { src: "/images/atelier/atelier-2.jpg", alt: "Näharbeit im Atelier" },
  { src: "/images/gallery/gwuerztraminer-2026.jpeg", alt: "Gwürztraminer Waageclique" },
  { src: "/images/atelier/atelier-3.jpg", alt: "Stoffe und Materialien" },
  { src: "/images/gallery/waageclique-edelwaggis.jpeg", alt: "Edelwaggis Waageclique" },
  { src: "/images/gallery/baenkli-clique.jpeg", alt: "Bänkli Clique" },
  { src: "/images/gallery/waggis-clique.jpeg", alt: "Waggis Clique" },
] as const;

interface PhotoMarqueeProps {
  className?: string;
}

export function PhotoMarquee({ className }: PhotoMarqueeProps) {
  const track = [...MARQUEE_PHOTOS, ...MARQUEE_PHOTOS];

  return (
    <section
      className={cn("relative py-16 lg:py-20 section-bg-white border-t border-stone-light/50", className)}
      aria-label="Impressionen aus dem Atelier"
    >
      <div className="container-site text-center mb-10 lg:mb-12">
        <div className="divider-ornament justify-center mb-5">
          <span>Im Atelier</span>
        </div>
        <h2 className="section-heading mb-4">
          Wo Ihre Kostüme <em className="not-italic italic text-periwinkle-dark">entstehen</em>
        </h2>
        <p className="section-subtext max-w-lg mx-auto">
          Ein Blick hinter die Kulissen — Werkstatt, Stoffe und fertige Arbeiten aus unserem Atelier in Basel.
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

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
    </section>
  );
}
