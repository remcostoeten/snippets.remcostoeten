import { cn } from "@/helpers";
import React from "react";

interface GradientTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span";
  variant?: "default" | "subtle" | "vibrant" | "chromatic";
}

const gradientVariants = {
  default: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
  subtle: "bg-gradient-to-r from-zinc-200/90 via-zinc-100 to-zinc-200/90",
  vibrant: "bg-gradient-to-r from-[#FF1CF7] via-[#b249f8] to-[#6699FF]",
  chromatic:
    "bg-[linear-gradient(90deg,rgb(255,255,255)_0%,rgb(200,200,200)_25%,rgb(255,255,255)_50%,rgb(200,200,200)_75%,rgb(255,255,255)_100%)]",
};

export function GradientText({
  children,
  as = "span",
  className,
  variant = "chromatic",
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
