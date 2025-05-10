"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/helpers"; 

/** 
 * cn.ts 
   import { type ClassValue, clsx } from 'clsx'
   import { twMerge } from 'tailwind-merge'

   export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
   }

  * index.ts
    export * from './cn'
*/

type TProps = {
  children: React.ReactNode;
  animation?: "fadeIn" | "blurIn" | "blurInUp";
  delay?: number;
  duration?: number;
  className?: string;
  fontSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  textColor?: string;
  letterSpacing?: "normal" | "wide" | "wider" | "widest" | "tight" | "tighter";
};

export function OptimizedTextAnimate({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 0.5,
  className,
  fontSize = "base",
  fontWeight = "normal",
  textColor,
  letterSpacing = "normal",
}: TProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay * 1000 || 0);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay]);

  const fontSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
  };

  const fontWeightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const letterSpacingClasses = {
    normal: "tracking-normal",
    wide: "tracking-wide",
    wider: "tracking-wider",
    widest: "tracking-widest",
    tight: "tracking-tight",
    tighter: "tracking-tighter",
  };

  const animationClasses = {
    fadeIn: "transition-opacity duration-500 ease-in-out",
    blurIn: "transition-all duration-500 ease-in-out",
    blurInUp: "transition-all duration-500 ease-in-out transform",
  };

  const visibilityClasses = {
    fadeIn: isVisible ? "opacity-100" : "opacity-0",
    blurIn: isVisible ? "opacity-100 blur-none" : "opacity-0 blur-[8px]",
    blurInUp: isVisible
      ? "opacity-100 blur-none translate-y-0"
      : "opacity-0 blur-[8px] translate-y-4",
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        animationClasses[animation],
        visibilityClasses[animation],
        fontSizeClasses[fontSize],
        fontWeightClasses[fontWeight],
        letterSpacingClasses[letterSpacing],
        textColor && `text-${textColor}`,
        className
      )}
      style={{ transitionDuration: `${duration}s` }}
    >
      {children}
    </div>
  );
}
