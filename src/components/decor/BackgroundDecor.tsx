import Image from "next/image";
import { useId } from "react";
import { cn } from "@/lib/utils";

type DecorVariant = "hero" | "page" | "minimal" | "footer";

interface BackgroundDecorProps {
  variant?: DecorVariant;
  /** Show Fasnacht character outlines on sides */
  showFigures?: boolean;
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
    <svg
      className={cn("absolute inset-0 h-full w-full pointer-events-none", className)}
      aria-hidden
      style={{ opacity }}
    >
      <defs>
        <pattern id={patternA} width="140" height="140" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
          <line x1="0" y1="70" x2="90" y2="70" stroke="#7880B8" strokeWidth="1" strokeDasharray="5 12" strokeLinecap="round" />
        </pattern>
        <pattern id={patternB} width="140" height="140" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
          <line x1="0" y1="70" x2="90" y2="70" stroke="#7880B8" strokeWidth="1" strokeDasharray="5 12" strokeLinecap="round" />
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
  showMesh = true,
  showConfetti = variant === "hero",
  showStitchDashes = variant === "footer",
  className,
}: BackgroundDecorProps) {
  const figureOpacity =
    variant === "hero"
      ? "opacity-[0.22]"
      : variant === "page"
        ? "opacity-[0.14]"
        : variant === "footer"
          ? "opacity-[0.11]"
          : "opacity-[0.08]";

  const figureWidth =
    variant === "hero"
      ? "w-[min(42vw,520px)]"
      : variant === "page"
        ? "w-[min(32vw,380px)]"
        : variant === "footer"
          ? "w-[min(28vw,340px)]"
          : "w-[min(24vw,280px)]";

  const figurePosition =
    variant === "footer"
      ? { left: "bottom-0 -translate-x-[10%] translate-y-[18%]", right: "bottom-0 translate-x-[10%] translate-y-[18%]" }
      : { left: "top-1/2 -translate-y-1/2 -translate-x-[8%]", right: "top-1/2 -translate-y-1/2 translate-x-[8%]" };

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none", className)}
      aria-hidden
    >
      {/* Sewing-dash crisscross — Nähnaht style */}
      {showStitchDashes && <StitchDashOverlay opacity={variant === "footer" ? 0.14 : 0.1} />}

      {/* Soft pastel mesh — very subtle ambient color */}
      {showMesh && (
        <div
          className={cn(
            "absolute inset-0",
            variant === "hero" ? "opacity-[0.12]" : variant === "footer" ? "opacity-[0.1]" : "opacity-[0.08]"
          )}
        >
          <Image
            src="/images/backgrounds/pastel-mesh.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={variant === "hero"}
          />
        </div>
      )}

      {/* Confetti — whisper-light (footer gets a touch more) */}
      {showConfetti && (
        <div className={cn("absolute inset-0", variant === "footer" ? "opacity-[0.05]" : "opacity-[0.06]")}>
          <Image
            src="/images/backgrounds/confetti-pastel.png"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {/* Fasnacht figure outlines — left column */}
      {showFigures && (
        <>
          <div
            className={cn(
              "absolute left-0",
              figurePosition.left,
              figureWidth,
              "aspect-[3/5]",
              figureOpacity
            )}
          >
            <Image
              src="/images/backgrounds/figuren-left.png"
              alt=""
              fill
              className="object-contain object-left outline-figure-periwinkle"
              sizes="(max-width: 768px) 40vw, 520px"
            />
          </div>

          {/* Right column */}
          <div
            className={cn(
              "absolute right-0",
              figurePosition.right,
              figureWidth,
              "aspect-[3/5]",
              figureOpacity
            )}
          >
            <Image
              src="/images/backgrounds/figuren-right.png"
              alt=""
              fill
              className="object-contain object-right outline-figure-periwinkle"
              sizes="(max-width: 768px) 40vw, 520px"
            />
          </div>
        </>
      )}

      {/* Ambient periwinkle + mist glow orbs */}
      <div
        className={cn(
          "absolute rounded-full bg-periwinkle-lighter/40 blur-[100px]",
          variant === "footer"
            ? "top-0 right-[8%] w-[400px] h-[280px]"
            : "-top-24 right-[5%] w-[480px] h-[480px]"
        )}
      />
      <div
        className={cn(
          "absolute rounded-full bg-mist-lighter/35 blur-[80px]",
          variant === "footer"
            ? "bottom-12 left-[20%] w-[360px] h-[260px] bg-mist-light/45"
            : "bottom-0 left-[15%] w-[320px] h-[240px]"
        )}
      />
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
  const position =
    side === "left"
      ? "left-0 -translate-x-[15%]"
      : side === "right"
        ? "right-0 translate-x-[15%]"
        : "left-1/2 -translate-x-1/2";

  return (
    <div
      className={cn(
        "absolute top-1/2 -translate-y-1/2 w-[min(55vw,640px)] aspect-[4/3] opacity-[0.18] hidden lg:block",
        position,
        className
      )}
      aria-hidden
    >
      <Image src={src} alt="" fill className="object-contain outline-measurement-periwinkle" sizes="640px" />
    </div>
  );
}
