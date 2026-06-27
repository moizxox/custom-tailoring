"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface PhotoSlide {
  src: string;
  alt: string;
}

interface PhotoSliderProps {
  slides: PhotoSlide[];
  className?: string;
  autoPlayMs?: number;
}

export function PhotoSlider({ slides, className, autoPlayMs = 5500 }: PhotoSliderProps) {
  const [active, setActive] = useState(0);
  const count = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActive((index + count) % count);
    },
    [count],
  );

  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);
  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);

  useEffect(() => {
    if (count <= 1 || autoPlayMs <= 0) return;
    const timer = window.setInterval(() => goTo(active + 1), autoPlayMs);
    return () => window.clearInterval(timer);
  }, [active, autoPlayMs, count, goTo]);

  if (count === 0) return null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-light/80 shadow-card bg-stone-light/30">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              index === active ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
            aria-hidden={index !== active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={index === 0}
            />
          </div>
        ))}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-white/70 shadow-soft flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-white transition-all duration-200"
              aria-label="Vorheriges Bild"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-white/70 shadow-soft flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-white transition-all duration-200"
              aria-label="Nächstes Bild"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Bildauswahl">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Bild ${index + 1}`}
              onClick={() => goTo(index)}
              className={cn(
                "rounded-full transition-all duration-300",
                index === active ? "w-6 h-2 bg-periwinkle-dark" : "w-2 h-2 bg-stone hover:bg-periwinkle-light",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
