import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "white" | "lavender" | "cream";
  padding?: "sm" | "md" | "lg" | "none";
}

const variantClasses = {
  white: "bg-white/85 backdrop-blur-md border border-white/70",
  lavender: "bg-lavender-lighter/80 backdrop-blur-md border border-lavender-light/50",
  cream: "bg-cream/90 backdrop-blur-sm border border-cream-deep",
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function GlassCard({
  variant = "white",
  padding = "md",
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-card",
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
