"use client";

import Image from "next/image";
import { useId } from "react";
import { cn } from "@/lib/utils";

type DecorVariant = "hero" | "page" | "minimal" | "footer";

interface BackgroundDecorProps {
  variant?: DecorVariant;
  /** Show Fasnacht character outlines on sides */
  showFigures?: boolean;
  /** Show traditional costume symbol banner (client asset) */
  showCostumeSymbols?: boolean;
  /** Show soft pastel mesh glow */
  showMesh?: boolean;
  /** Show light confetti dots */
  showConfetti?: boolean;
  /** Show crisscross sewing-dash outlines (Nähnaht style) */
  showStitchDashes?: boolean;
  className?: string;
}

/**
 * Client background layers — Fasnacht figure outlines in periwinkle/silver-gold tone
 * (not yellow gold). Uses mix-blend-mode: screen so black areas disappear on light bg.
 */
/** Crisscross dashed stitch lines — periwinkle, like client Nähnaht background */
function StitchDashOverlay({ className, opacity = 0.12 }: { className?: string; opacity?: number }) {
  const id = useId().replace(/:/g, "");
  const patternA = `stitch-a-${id}`;
  const patternB = `stitch-b-${id}`;

  return (
    <svg className={cn("absolute inset-0 h-full w-full pointer-events-none", className)} aria-hidden style={{ opacity }}>
      <defs>
        <pattern id={patternA} width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
          <line x1="0" y1="60" x2="95" y2="60" stroke="#B5A896" strokeWidth="2" strokeDasharray="6 10" strokeLinecap="round" />
        </pattern>
        <pattern id={patternB} width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
          <line x1="0" y1="60" x2="95" y2="60" stroke="#B5A896" strokeWidth="2" strokeDasharray="6 10" strokeLinecap="round" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternA})`} />
      <rect width="100%" height="100%" fill={`url(#${patternB})`} />
    </svg>
  );
}

export function BackgroundDecor({
  variant = "hero",
  showFigures = true,
  showCostumeSymbols = variant === "hero",
  showMesh = true,
  showConfetti = variant === "hero",
  showStitchDashes = variant === "footer",
  className,
}: BackgroundDecorProps) {
  const figureOpacity = variant === "hero" ? "opacity-[0.72]" : variant === "page" ? "opacity-[0.50]" : variant === "footer" ? "opacity-[0.24]" : "opacity-[0.14]";

  const figureWidth =
    variant === "hero" ? "w-[min(52vw,700px)]" : variant === "page" ? "w-[min(48vw,560px)]" : variant === "footer" ? "w-[min(38vw,460px)]" : "w-[min(30vw,360px)]";

  const figurePosition =
    variant === "footer"
      ? {
          left: "top-1/2 -translate-y-1/2 -translate-x-[14%]",
          right: "top-1/2 -translate-y-1/2 translate-x-[14%]",
        }
      : variant === "hero"
        ? {
            left: "top-1/2 -translate-y-1/2 -translate-x-[18%]",
            right: "top-1/2 -translate-y-1/2 translate-x-[18%]",
          }
        : {
            left: "top-1/2 -translate-y-1/2 -translate-x-[8%]",
            right: "top-1/2 -translate-y-1/2 translate-x-[8%]",
          };

  const figureVisibility = variant === "footer" ? "hidden md:block" : "";

  const figureFade =
    variant === "footer"
      ? { left: "[mask-image:linear-gradient(to_right,black_50%,transparent)]", right: "[mask-image:linear-gradient(to_left,black_50%,transparent)]" }
      : variant === "hero"
        ? {
            left: "[mask-image:linear-gradient(to_right,black_58%,transparent_80%)]",
            right: "[mask-image:linear-gradient(to_left,black_58%,transparent_80%)]",
          }
        : { left: "", right: "" };

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none", className)} aria-hidden>
      {/* Sewing-dash crisscross — Nähnaht style */}
      {showStitchDashes && <StitchDashOverlay opacity={variant === "footer" ? 0.22 : variant === "hero" ? 0.18 : 0.16} />}

      {/* Soft pastel mesh — warm tint only, no mint/green */}
      {showMesh && (
        <div className={cn("absolute inset-0", variant === "hero" ? "opacity-[0.16]" : variant === "footer" ? "opacity-[0.05]" : "opacity-[0.07]")}>
          <Image
            src="/images/backgrounds/pastel-mesh.png"
            alt=""
            fill
            className="object-cover object-center saturate-[0.65] hue-rotate-[-12deg]"
            sizes="100vw"
            priority={variant === "hero"}
          />
          {/* Warm wash — neutralises green/mint from mesh asset */}
          <div className="absolute inset-0 bg-gradient-to-br from-sand-light/30 via-offwhite/20 to-periwinkle-lighter/15" />
        </div>
      )}

      {/* Confetti — festive pastel dots (desaturated on hero to avoid mint tones) */}
      {showConfetti && (
        <div className={cn("absolute inset-0", variant === "hero" ? "opacity-[0.14]" : variant === "footer" ? "opacity-[0.04]" : "opacity-[0.05]")}>
          <Image
            src="/images/backgrounds/confetti-pastel.png"
            alt=""
            fill
            className={cn(
              "object-cover",
              variant === "hero"
                ? "saturate-[0.62] hue-rotate-[-18deg] brightness-[1.04] contrast-[1.15]"
                : "saturate-[0.7] hue-rotate-[-10deg]"
            )}
            sizes="100vw"
            priority={variant === "hero"}
          />
        </div>
      )}

      {/* Traditional costume symbols — hero: edge strips only (center stays clear) */}
      {showCostumeSymbols && variant === "hero" && (
        <>
          <div className="absolute left-0 right-0 bottom-8 h-[min(20vh,150px)] opacity-[0.52] hidden sm:block [mask-image:linear-gradient(to_right,black_0%,black_14%,transparent_28%,transparent_72%,black_86%,black_100%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,black_14%,transparent_28%,transparent_72%,black_86%,black_100%)]">
            <Image src="/images/backgrounds/costume-symbols-banner.png" alt="" fill className="object-contain object-bottom saturate-[0.95] contrast-[1.1]" sizes="100vw" />
          </div>

          <div className="absolute inset-y-0 left-0 w-[min(32vw,400px)] opacity-[0.18] hidden lg:block [mask-image:linear-gradient(to_right,black_0%,transparent_88%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,transparent_88%)]">
            <Image src="/images/backgrounds/pastel-symbols-mesh.png" alt="" fill className="object-cover object-left saturate-[0.8] hue-rotate-[-8deg] contrast-[1.08]" sizes="400px" />
          </div>
          <div className="absolute inset-y-0 right-0 w-[min(32vw,400px)] opacity-[0.18] hidden lg:block [mask-image:linear-gradient(to_left,black_0%,transparent_88%)] [-webkit-mask-image:linear-gradient(to_left,black_0%,transparent_88%)]">
            <Image src="/images/backgrounds/pastel-symbols-mesh.png" alt="" fill className="object-cover object-right saturate-[0.8] hue-rotate-[-8deg] contrast-[1.08]" sizes="400px" />
          </div>
        </>
      )}

      {/* Costume symbols — non-hero pages (subtle bottom band) */}
      {showCostumeSymbols && variant !== "hero" && (
        <div className="absolute left-0 right-0 bottom-0 pointer-events-none h-[min(16vh,120px)] opacity-[0.14]">
          <Image src="/images/backgrounds/costume-symbols-banner.png" alt="" fill className="object-contain object-bottom saturate-[0.85]" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-offwhite/80 via-offwhite/30 to-transparent" />
        </div>
      )}

      {/* Fasnacht figure outlines — left column */}
      {showFigures && (
        <>
          <div className={cn("absolute left-0", figurePosition.left, figureWidth, "aspect-[3/5]", figureOpacity, figureVisibility, figureFade.left)}>
            <Image
              src="/images/backgrounds/figuren-left.png"
              alt=""
              fill
              className="object-contain object-left outline-figure-gold outline-figure-strong outline-figure-hero"
              sizes="(max-width: 768px) 40vw, 520px"
            />
          </div>

          {/* Right column */}
          <div className={cn("absolute right-0", figurePosition.right, figureWidth, "aspect-[3/5]", figureOpacity, figureVisibility, figureFade.right)}>
            <Image
              src="/images/backgrounds/figuren-right.png"
              alt=""
              fill
              className="object-contain object-right outline-figure-gold outline-figure-strong outline-figure-hero"
              sizes="(max-width: 768px) 40vw, 520px"
            />
          </div>
        </>
      )}

      {/* Ambient glow — periwinkle + sand only (no mint) */}
      <div
        className={cn(
          "absolute rounded-full bg-periwinkle-lighter/35 blur-[100px]",
          variant === "footer" ? "top-0 right-[8%] w-[400px] h-[280px]" : "-top-24 right-[5%] w-[480px] h-[480px]",
        )}
      />
      <div
        className={cn(
          "absolute rounded-full blur-[80px]",
          variant === "footer" ? "bottom-12 left-[20%] w-[360px] h-[260px] bg-sand-light/40" : "bottom-0 left-[15%] w-[360px] h-[280px] bg-sand-light/35",
        )}
      />
      {variant === "hero" && <div className="absolute top-[20%] left-[30%] w-[400px] h-[300px] rounded-full bg-gold-lighter/15 blur-[90px]" />}
    </div>
  );
}

interface MeasurementOutlineProps {
  src: string;
  className?: string;
  side?: "left" | "right" | "center";
}

/** Measurement diagram — yellow lines recolored to periwinkle-dark via CSS */
export function MeasurementOutline({ src, className, side = "right" }: MeasurementOutlineProps) {
  const position = side === "left" ? "left-0 -translate-x-[15%]" : side === "right" ? "right-0 translate-x-[15%]" : "left-1/2 -translate-x-1/2";

  return (
    <div className={cn("absolute top-1/2 -translate-y-1/2 w-[min(55vw,640px)] aspect-[4/3] opacity-[0.18] hidden lg:block", position, className)} aria-hidden>
      <Image src={src} alt="" fill className="object-contain outline-measurement-periwinkle" sizes="640px" />
    </div>
  );
}
