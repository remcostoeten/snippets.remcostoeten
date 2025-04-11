import { cn } from "@/helpers";
import { ReactNode } from "react";

// Component Props
type TProps = {
  children: ReactNode;
  className?: string;
  before?: string;
  after?: string;
  emojiCategory?: string;
  emojiIndex?: number;
};

/**
 * Basic text formatting components
 */
export const I = ({ children, className }: TProps) => (
  <span className={cn("italic", className)}>{children}</span>
);

export const U = ({ children, className }: TProps) => (
  <span className={cn("underline underline-offset-4", className)}>
    {children}
  </span>
);

export const B = ({ children, className }: TProps) => (
  <span className={cn("font-bold", className)}>{children}</span>
);

export const Pulse = ({ children, className }: TProps) => (
  <span className={cn("animate-pulse", className)}>{children}</span>
);

export const Ping = ({ children, className }: TProps) => (
  <span className={cn("animate-ping", className)}>{children}</span>
);
