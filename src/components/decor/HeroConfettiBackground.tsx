"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroConfettiBackgroundProps {
  className?: string;
}

/** Hero background — soft gradient, konfetti, and Fasnacht figure sketches */
export function HeroConfettiBackground({ className }: HeroConfettiBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none bg-offwhite-warm", className)} aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-periwinkle-lighter/30 via-offwhite/30 to-sand-light/30 backdrop-blur-sm" />

      <div className="absolute inset-0 opacity-[0.5]">
        <Image src="/images/backgrounds/konfetti.png" alt="" fill className="object-cover mix-blend-screen brightness-[1.04] contrast-[1.08]" sizes="100vw" priority />
      </div>

      <div className="absolute left-[-80px] top-1/2 -translate-y-1/2 -translate-x-[18%] w-[min(52vw,700px)] aspect-[3/5] opacity-[0.05] [mask-image:linear-gradient(to_right,black_58%,transparent_80%)] [-webkit-mask-image:linear-gradient(to_right,black_58%,transparent_80%)]">
        <Image
          src="/images/backgrounds/figuren-left-sketch.png"
          alt=""
          fill
          className="object-contain object-left outline-figure-gold outline-figure-strong outline-figure-hero"
          sizes="(max-width: 768px) 40vw, 520px"
        />
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[18%] w-[min(52vw,700px)] aspect-[3/5] opacity-[0.05] [mask-image:linear-gradient(to_left,black_58%,transparent_80%)] [-webkit-mask-image:linear-gradient(to_left,black_58%,transparent_80%)]">
        <Image
          src="/images/backgrounds/figuren-right-sketch.png"
          alt=""
          fill
          className="object-contain object-right outline-figure-gold outline-figure-strong outline-figure-hero"
          sizes="(max-width: 768px) 40vw, 520px"
        />
      </div>
    </div>
  );
}
