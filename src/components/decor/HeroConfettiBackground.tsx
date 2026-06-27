"use client";

import { cn } from "@/lib/utils";
import { ConfettiOverlay } from "@/components/decor/ConfettiOverlay";
import { SideSketchFigures } from "@/components/decor/SideSketchFigures";

interface HeroConfettiBackgroundProps {
  className?: string;
  sketchOpacity?: string;
}

/** Hero background — soft gradient, konfetti, and side Fasnacht figure sketches */
export function HeroConfettiBackground({ className, sketchOpacity = "opacity-[0.08]" }: HeroConfettiBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none bg-offwhite", className)} aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-periwinkle-lighter/45 via-offwhite/40 to-periwinkle-lighter/25 backdrop-blur-sm" />

      <ConfettiOverlay opacityClassName="opacity-[0.5]" imageClassName="brightness-[1.04] contrast-[1.08]" priority />

      <SideSketchFigures opacity={sketchOpacity} width="w-[min(22vw,320px)]" />
    </div>
  );
}
