export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

export type AnimationVariant =
  | "light"
  | "dark"
  | "stroke"
  | "glassmorphic"
  | "neon"
  | "rainbow"
  | "crystal"
  | "trace"
  | "fade"
  | "segment"
  | "stagger"
  | "retro"
  | "morph"
  | "3d"
  | "glitch"
  | "liquid"
  | "magnetic"
  | "stagger-triangles"
  | "rotate-segments"
  | "wave"
  | "pulse"
  | "hover-lift"
  | "hover-glow"
  | "hover-rotate"
  | "tooltip-fade"
  | "tooltip-scale"
  | "tooltip-slide"
  | "none";

export interface ShieldLogoProps {
  className?: string;
  size?: LogoSize;
  width?: number;
  height?: number;
  fill?: string;
  fillOutline?: string;
  fillTop?: string;
  fillLeft?: string;
  fillRight?: string;
  bgFill?: string;
  animated?: boolean;
  animationVariant?: AnimationVariant;
  hasLink?: boolean;
  linkTo?: string;
  tooltipContent?: string;
  hasTooltip?: boolean;
  onAnimationComplete?: () => void;
}

export const sizeMap: Record<LogoSize, { width: number; height: number }> = {
  xs: { width: 32, height: 32 },
  sm: { width: 48, height: 48 },
  md: { width: 64, height: 64 },
  lg: { width: 96, height: 96 },
  xl: { width: 128, height: 128 },
} as const;
