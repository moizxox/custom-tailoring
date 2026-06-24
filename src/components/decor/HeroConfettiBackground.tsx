"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroConfettiBackgroundProps {
  className?: string;
}

/** Hero background — plain surface with konfetti overlay only */
export function HeroConfettiBackground({ className }: HeroConfettiBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none ", className)} aria-hidden>
      <div className="absolute inset-0 opacity-[0.5]">
        <Image src="/images/backgrounds/konfetti.png" alt="" fill className="object-cover mix-blend-screen brightness-[1.04] contrast-[1.08]" sizes="100vw" priority />
      </div>
    </div>
  );
}
