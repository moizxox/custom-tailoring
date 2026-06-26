"use client";

import Image from "next/image";
import { BG_IMAGES } from "@/lib/assets";
import { cn } from "@/lib/utils";

interface ConfettiOverlayProps {
  opacityClassName: string;
  imageClassName?: string;
  className?: string;
  priority?: boolean;
}

export function ConfettiOverlay({
  opacityClassName,
  imageClassName,
  className,
  priority = false,
}: ConfettiOverlayProps) {
  return (
    <div className={cn("absolute inset-0", opacityClassName, className)}>
      <Image
        src={BG_IMAGES.confettiSoft}
        alt=""
        fill
        className={cn("object-cover mix-blend-screen", imageClassName)}
        sizes="100vw"
        priority={priority}
      />
    </div>
  );
}
