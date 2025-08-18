import { cn } from "@/helpers";
import type React from "react";

interface GradientTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span";
  variant?: "default" | "subtle" | "silver" | "chromatic";
}

const gradientVariants = {
  default: "bg-gradient-to-r from-neutral-500 via-neutral-600 to-neutral-700",
  subtle: "bg-gradient-to-r from-neutral-300 via-neutral-400 to-white/80",
  silver: "bg-gradient-to-r from-[#919191] via-[#747474] to-[#919191]",
  chromatic:
    "bg-[linear-gradient(90deg,rgb(240,240,240)_0%,rgb(180,180,180)_25%,rgb(220,220,220)_50%,rgb(180,180,180)_75%,rgb(240,240,240)_100%)]",
};

export function GradientText({
  children,
  as = "span",
  className,
  variant = "subtle",
  ...props
}: GradientTextProps) {
  const Component = as;

  return (
    <Component
      className={cn(
        "bg-clip-text text-transparent animate-gradient-x bg-300%",
        gradientVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
