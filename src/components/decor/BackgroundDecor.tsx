import Image from "next/image";
import { cn } from "@/lib/utils";

type DecorVariant = "hero" | "page" | "minimal";

interface BackgroundDecorProps {
  variant?: DecorVariant;
  /** Show Fasnacht character outlines on sides */
  showFigures?: boolean;
  /** Show soft pastel mesh glow */
  showMesh?: boolean;
  /** Show light confetti dots */
  showConfetti?: boolean;
  className?: string;
}

/**
 * Client background layers — Fasnacht figure outlines in periwinkle/silver-gold tone
 * (not yellow gold). Uses mix-blend-mode: screen so black areas disappear on light bg.
 */
export function BackgroundDecor({
  variant = "hero",
  showFigures = true,
  showMesh = true,
  showConfetti = variant === "hero",
  className,
}: BackgroundDecorProps) {
  const figureOpacity =
    variant === "hero" ? "opacity-[0.22]" : variant === "page" ? "opacity-[0.14]" : "opacity-[0.08]";

  const figureWidth =
    variant === "hero"
      ? "w-[min(42vw,520px)]"
      : variant === "page"
        ? "w-[min(32vw,380px)]"
        : "w-[min(24vw,280px)]";

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none", className)}
      aria-hidden
    >
      {/* Soft pastel mesh — very subtle ambient color */}
      {showMesh && (
        <div
          className={cn(
            "absolute inset-0",
            variant === "hero" ? "opacity-[0.12]" : "opacity-[0.08]"
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

      {/* Confetti — whisper-light */}
      {showConfetti && (
        <div className="absolute inset-0 opacity-[0.06]">
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
              "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[8%]",
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
              "absolute right-0 top-1/2 -translate-y-1/2 translate-x-[8%]",
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
      <div className="absolute -top-24 right-[5%] w-[480px] h-[480px] rounded-full bg-periwinkle-lighter/40 blur-[100px]" />
      <div className="absolute bottom-0 left-[15%] w-[320px] h-[240px] rounded-full bg-mist-lighter/35 blur-[80px]" />
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
