"use client";

import * as React from "react";

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(" ");
}

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical"; decorative?: boolean }
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      ...props
    },
    ref,
  ) => {
    const isHorizontal = orientation === "horizontal";

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        aria-hidden={decorative}
        className={cn(
          "shrink-0 bg-border",
          isHorizontal ? "h-[1px] w-full" : "h-full w-[1px]",
          className,
        )}
        style={{
          backgroundColor: "hsl(var(--border))",
          ...(isHorizontal
            ? { height: "1px", width: "100%" }
            : { height: "100%", width: "1px" }),
          ...props.style,
        }}
        {...props}
      />
    );
  },
);
Separator.displayName = "Separator";

export { Separator };
