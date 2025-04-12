"use client";

import NumberFlow from "@number-flow/react";
import type { ComponentProps } from "react";

type Format = {
  notation?: "compact" | "standard";
};

interface AnimatedNumberProps
  extends Omit<ComponentProps<typeof NumberFlow>, "value" | "format"> {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: Format;
  locales?: Intl.LocalesArgument;
  transformTiming?: EffectTiming;
  spinTiming?: EffectTiming;
  opacityTiming?: EffectTiming;
}

export function AnimatedNumber({
  value,
  prefix,
  suffix,
  format,
  locales,
  transformTiming = { duration: 750, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
  spinTiming,
  opacityTiming = { duration: 350, easing: "ease-out" },
  ...props
}: AnimatedNumberProps) {
  return (
    <NumberFlow
      value={value}
      prefix={prefix}
      suffix={suffix}
      format={format}
      locales={locales}
      transformTiming={transformTiming}
      spinTiming={spinTiming || transformTiming}
      opacityTiming={opacityTiming}
      {...props}
    />
  );
}
