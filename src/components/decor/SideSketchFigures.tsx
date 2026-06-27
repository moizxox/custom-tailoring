"use client";

import Image from "next/image";
import { BG_IMAGES } from "@/lib/assets";
import { cn } from "@/lib/utils";

interface SideSketchFiguresProps {
  className?: string;
  opacity?: string;
  width?: string;
}

/** Side Fasnacht sketch strips — full vertical stack, faded only toward page center */
export function SideSketchFigures({ className, opacity = "opacity-[0.10]", width = "w-[min(20vw,300px)]" }: SideSketchFiguresProps) {
  const edgeMask = {
    left: "[mask-image:linear-gradient(to_right,black_0%,black_80%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,black_80%,transparent_98%)]",
    right: "[mask-image:linear-gradient(to_left,black_0%,black_80%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_left,black_0%,black_80%,transparent_98%)]",
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none", className)} aria-hidden>
      <div className={cn("absolute left-[3%] inset-y-6 lg:inset-y-4", width, opacity, "hidden md:block", edgeMask.left)}>
        <Image
          src={BG_IMAGES.figuresSideLeftSketch}
          alt=""
          fill
          className="object-contain object-left outline-figure-gold outline-figure-strong"
          sizes="(max-width: 768px) 22vw, 300px"
        />
      </div>

      <div className={cn("absolute right-[3%] inset-y-6 lg:inset-y-4", width, opacity, "hidden md:block", edgeMask.right)}>
        <Image
          src={BG_IMAGES.figuresSideRightSketch}
          alt=""
          fill
          className="object-contain object-right outline-figure-gold outline-figure-strong"
          sizes="(max-width: 768px) 22vw, 300px"
        />
      </div>
    </div>
  );
}
