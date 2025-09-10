"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, PanInfo, easeOut } from "framer-motion";
import { cn } from "@/helpers";
import {
  getColorScheme,
  getRandomColorScheme,
  TColorScheme,
} from "./config";
import React from "react";

interface SimpleDotPatternProps {
  colors: number[][];
  dotSize?: number;
}

function SimpleDotPattern({ colors, dotSize = 2 }: SimpleDotPatternProps) {
  return (
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]}, ${colors[0][3]}) 1px, transparent 1px), 
                          radial-gradient(circle, rgba(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]}, ${colors[1][3]}) 1px, transparent 1px)`,
        backgroundSize: `${dotSize * 4}px ${dotSize * 4}px, ${dotSize * 6}px ${dotSize * 6}px`,
        backgroundPosition: "0 0, 10px 10px",
      }}
    />
  );
}

interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  radius?: number;
  color?: string;
  colorSchemeIdentifier?: string | number;
  delay?: number;
}

const CardSpotlight = React.memo<CardSpotlightProps>(({
  children,
  radius = 350,
  color,
  className,
  colorSchemeIdentifier,
  delay = 0,
  ...props
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  const colorScheme: TColorScheme = useMemo(() =>
    colorSchemeIdentifier === "random"
      ? getRandomColorScheme()
      : getColorScheme(colorSchemeIdentifier || 0),
    [colorSchemeIdentifier]
  );

  const spotlightColor = useMemo(() =>
    color ||
      `rgba(${colorScheme.colors[0][0]}, ${colorScheme.colors[0][1]}, ${colorScheme.colors[0][2]}, 0.7)`,
    [color, colorScheme]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const div = divRef.current;
    if (div) {
      const rect = div.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  const fadeInVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: easeOut,
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  }), [delay]);

  const childVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  }), []);

  const handlePan = (event: any, info: PanInfo) => {
    console.log(info.offset.x, info.offset.y)
  }

  return (
    <motion.div
      ref={divRef}
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      className={cn(
        "group/spotlight rounded-md relative border border-neutral-800 bg-black dark:border-neutral-800 overflow-hidden",
        className
      )}
// @ts-ignore
      onDrag={handlePan}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        className="pointer-events-none absolute z-0 transition-all duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 100%)`,
          inset: "-1px",
          borderRadius: "0.375rem",
          transform: `scale(${isHovering ? 1 : 0.9})`,
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <SimpleDotPattern
            colors={[
              [...colorScheme.colors[0], 0.15],
              [...colorScheme.colors[1], 0.15],
            ]}
            dotSize={2}
          />
        </div>
      </div>
      <motion.div variants={childVariants}>{children}</motion.div>
    </motion.div>
  );
});

export { CardSpotlight };
