"use client";

import { forwardRef, useMemo, useRef } from "react";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

export interface AuroraProps {
  /** Array of CSS color values with alpha for translucent aurora layers. */
  colors?: string[];
  /** Animation cycle duration in seconds. */
  speed?: number;
  /** Blur amount in pixels. */
  blur?: number;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

interface LayerConfig {
  width: string;
  height: string;
  top: string;
  left: string;
  rotateRange: number;
  translateX: string;
  translateY: string;
}

const DEFAULT_LAYER: LayerConfig = {
  width: "150%",
  height: "60%",
  top: "10%",
  left: "-25%",
  rotateRange: 15,
  translateX: "10%",
  translateY: "5%",
};

const LAYER_CONFIGS: LayerConfig[] = [
  DEFAULT_LAYER,
  {
    width: "120%",
    height: "50%",
    top: "20%",
    left: "-10%",
    rotateRange: -20,
    translateX: "-15%",
    translateY: "10%",
  },
  {
    width: "140%",
    height: "55%",
    top: "15%",
    left: "-20%",
    rotateRange: 12,
    translateX: "8%",
    translateY: "-8%",
  },
  {
    width: "130%",
    height: "45%",
    top: "25%",
    left: "-15%",
    rotateRange: -18,
    translateX: "-12%",
    translateY: "6%",
  },
];

function buildKeyframes(count: number): string {
  return Array.from({ length: count })
    .map((_, i) => {
      const cfg = LAYER_CONFIGS[i % LAYER_CONFIGS.length] ?? DEFAULT_LAYER;
      return `@keyframes ui-aurora-layer-${i}{0%,100%{transform:rotate(0deg) translate(0,0)}33%{transform:rotate(${cfg.rotateRange}deg) translate(${cfg.translateX},${cfg.translateY})}66%{transform:rotate(${-cfg.rotateRange * 0.5}deg) translate(${cfg.translateX === "10%" ? "-8%" : "10%"},${cfg.translateY})}}`;
    })
    .join("");
}

export const Aurora = forwardRef<HTMLDivElement, AuroraProps>(
  (
    {
      colors = ["#ee502c80", "#8b5cf680", "#06b6d480"],
      speed = 6,
      blur = 60,
      className,
      id,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;
    const reducedMotion = useReducedMotion();
    const shouldAnimate = !reducedMotion;

    const keyframes = useMemo(() => buildKeyframes(colors.length), [colors.length]);

    return (
      <>
        {shouldAnimate && <style>{keyframes}</style>}
        <div
          ref={ref}
          id={id}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full overflow-hidden",
            className,
          )}
          data-component="aurora"
          {...rest}
        >
          {colors.map((color, i) => {
            const cfg = LAYER_CONFIGS[i % LAYER_CONFIGS.length] ?? DEFAULT_LAYER;
            return (
              <div
                key={`aurora-layer-${color}`}
                style={{
                  position: "absolute",
                  width: cfg.width,
                  height: cfg.height,
                  top: cfg.top,
                  left: cfg.left,
                  borderRadius: "50%",
                  background: `radial-gradient(ellipse at center, ${color}, transparent 60%)`,
                  filter: `blur(${blur}px)`,
                  mixBlendMode: "normal",
                  ...(shouldAnimate
                    ? {
                        animation: `ui-aurora-layer-${i} ${speed + i * 2}s ease-in-out infinite`,
                      }
                    : {}),
                }}
              />
            );
          })}
        </div>
      </>
    );
  },
);

Aurora.displayName = "Aurora";
