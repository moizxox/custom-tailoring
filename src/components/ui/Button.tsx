import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type ButtonBaseProps = {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };

type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantClasses = {
  primary:
    "bg-periwinkle hover:bg-periwinkle-dark text-charcoal hover:text-white shadow-soft hover:shadow-periwinkle",
  secondary:
    "bg-gold-dark border border-gold-dark text-white hover:bg-gold hover:text-charcoal shadow-soft",
  ghost: "text-charcoal hover:bg-sand-light",
  outline:
    "border border-stone-light text-charcoal hover:border-periwinkle-light hover:text-periwinkle-deep",
};

const sizeClasses = {
  sm: "px-4 py-2 text-xs gap-1.5",
  md: "px-5 py-2.5 text-[13px] gap-2",
  lg: "px-7 py-3.5 text-sm gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-sans font-medium rounded-full transition-all duration-200 cursor-pointer",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if ((props as ButtonAsAnchor).as === "a") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as: _, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <a className={classes} {...anchorProps}>
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </a>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { as: _, ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
