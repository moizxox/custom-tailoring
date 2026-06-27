import { cn } from "@/lib/utils";

interface SoftConfettiCirclesProps {
  className?: string;
}

/** Large soft pastel circles — big round confetti behind hero sections */
export function SoftConfettiCircles({ className }: SoftConfettiCirclesProps) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)} aria-hidden>
      <div className="absolute top-[2%] left-[6%] w-[min(44vw,340px)] h-[min(44vw,340px)] rounded-full bg-periwinkle-light/30 blur-[88px]" />
      <div className="absolute top-[12%] right-[4%] w-[min(40vw,300px)] h-[min(40vw,300px)] rounded-full bg-gold-lighter/35 blur-[80px]" />
      <div className="absolute bottom-[8%] left-[18%] w-[min(38vw,280px)] h-[min(38vw,280px)] rounded-full bg-periwinkle-lighter/40 blur-[76px]" />
      <div className="absolute top-[38%] right-[16%] w-[min(30vw,220px)] h-[min(30vw,220px)] rounded-full bg-sand-light/40 blur-[68px]" />
      <div className="absolute bottom-[4%] right-[10%] w-[min(34vw,260px)] h-[min(34vw,260px)] rounded-full bg-periwinkle/25 blur-[72px]" />
      <div className="absolute top-[55%] left-[42%] w-[min(24vw,180px)] h-[min(24vw,180px)] rounded-full bg-gold-muted/30 blur-[64px]" />
    </div>
  );
}
