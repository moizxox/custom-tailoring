import { cn } from "@/lib/utils";
import { HeroConfettiBackground } from "@/components/decor/HeroConfettiBackground";
import { ConfettiOverlay } from "@/components/decor/ConfettiOverlay";
import { GRADIENT_CLASS_MAP, type SectionAppearance } from "@/lib/cms/section-appearance";

interface Props {
  appearance?: SectionAppearance;
  /** Fallback when gradientStyle is default */
  defaultClassName?: string;
  className?: string;
  children: React.ReactNode;
  /** Use full hero konfetti stack (gradient + figures) instead of overlay only */
  heroKonfetti?: boolean;
}

export function CmsSectionShell({
  appearance,
  defaultClassName = "section-bg-white",
  className,
  children,
  heroKonfetti = false,
}: Props) {
  const gradientClass = appearance?.gradientStyle && appearance.gradientStyle !== "default"
    ? GRADIENT_CLASS_MAP[appearance.gradientStyle]
    : defaultClassName;

  const customBg = appearance?.useCustomBg && appearance.bgColor
    ? { backgroundColor: appearance.bgColor }
    : undefined;

  return (
    <section
      className={cn("relative overflow-hidden", !customBg && gradientClass, className)}
      style={customBg}
    >
      {appearance?.showKonfetti && (
        heroKonfetti ? (
          <HeroConfettiBackground sketchOpacity="opacity-[0.5]" />
        ) : (
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <ConfettiOverlay opacityClassName="opacity-[0.35]" />
          </div>
        )
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
