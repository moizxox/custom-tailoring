"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface SideSketchFiguresProps {
  className?: string;
  opacity?: string;
  width?: string;
}

/** Side-only Fasnacht sketches — clipped so inner figures never appear in the page center */
export function SideSketchFigures({
  className,
  opacity = "opacity-[0.05]",
  width = "w-[min(40vw,560px)]",
}: SideSketchFiguresProps) {
  const edgeMask = {
    left: "[mask-image:linear-gradient(to_right,black_0%,black_30%,transparent_52%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,black_30%,transparent_52%)]",
    right: "[mask-image:linear-gradient(to_left,black_0%,black_30%,transparent_52%)] [-webkit-mask-image:linear-gradient(to_left,black_0%,black_30%,transparent_52%)]",
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none", className)} aria-hidden>
      <div
        className={cn(
          "absolute left-[4%] top-1/2 -translate-y-1/2",
          width,
          "aspect-[3/5]",
          opacity,
          "hidden md:block",
          edgeMask.left,
        )}
      >
        <Image
          src="/images/backgrounds/figuren-left-sketch.png"
          alt=""
          fill
          className="object-contain object-left outline-figure-gold outline-figure-strong"
          sizes="(max-width: 768px) 38vw, 480px"
        />
      </div>

      <div
        className={cn(
          "absolute right-[4%] top-1/2 -translate-y-1/2",
          width,
          "aspect-[3/5]",
          opacity,
          "hidden md:block",
          edgeMask.right,
        )}
      >
        <Image
          src="/images/backgrounds/figuren-right-sketch.png"
          alt=""
          fill
          className="object-contain object-right outline-figure-gold outline-figure-strong"
          sizes="(max-width: 768px) 38vw, 480px"
        />
      </div>
    </div>
  );
}
