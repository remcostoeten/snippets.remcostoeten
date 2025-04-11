"use client";

import { useRef, useState } from "react";
import { cn } from "@/helpers";

export const CardSpotlight = ({
  children,
  radius = 350,
  color = "#262626",
  className,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <div
      ref={divRef}
      className={cn(
        "group/spotlight p-10 rounded-md relative border border-neutral-800 bg-black dark:border-neutral-800 overflow-hidden",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {isHovering && (
        <div
          className="pointer-events-none absolute z-0 opacity-100 transition-opacity duration-500 ease-in-out"
          style={{
            background: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, ${color}, transparent 80%)`,
            inset: "-1px",
            borderRadius: "0.375rem",
          }}
        >
          {isHovering && (
            <div className="absolute inset-0 pointer-events-none">
              <SimpleDotPattern
                colors={[
                  [59, 130, 246],
                  [139, 92, 246],
                ]}
                dotSize={3}
              />
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

const SimpleDotPattern = ({
  colors = [
    [59, 130, 246],
    [139, 92, 246],
  ],
  dotSize = 3,
}: {
  colors?: number[][];
  dotSize?: number;
}) => {
  return (
    <div
      className="absolute inset-0 opacity-70"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]}, 0.8) 1px, transparent 1px), 
                          radial-gradient(circle, rgba(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]}, 0.8) 1px, transparent 1px)`,
        backgroundSize: `${dotSize * 4}px ${dotSize * 4}px, ${dotSize * 6}px ${
          dotSize * 6
        }px`,
        backgroundPosition: "0 0, 10px 10px",
      }}
    />
  );
};
