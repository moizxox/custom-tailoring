"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { SideSketchFigures } from "@/components/decor/SideSketchFigures";

interface HeroConfettiBackgroundProps {
  className?: string;
}

/** Hero background — soft gradient, konfetti, and side Fasnacht figure sketches */
export function HeroConfettiBackground({ className }: HeroConfettiBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none bg-offwhite", className)} aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-periwinkle-lighter/30 via-offwhite/30 to-sand-light/30 backdrop-blur-sm" />

      <div className="absolute inset-0 opacity-[0.5]">
        <Image src="/images/backgrounds/konfetti.png" alt="" fill className="object-cover mix-blend-screen brightness-[1.04] contrast-[1.08]" sizes="100vw" priority />
      </div>

      <SideSketchFigures opacity="opacity-[0.08]" width="w-[min(22vw,320px)]" />
    </div>
  );
}
