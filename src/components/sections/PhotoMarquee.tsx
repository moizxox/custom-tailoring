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
    <section className={cn("relative py-6 overflow-hidden bg-offwhite border-y border-stone-light/60", className)} aria-label="Impressionen aus dem Atelier">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-offwhite to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-offwhite to-transparent z-10 pointer-events-none" />

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
    </section>
  );
}
