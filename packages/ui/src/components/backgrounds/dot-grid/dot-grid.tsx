"use client";

import { forwardRef, useRef } from "react";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

export interface DotGridProps {
  /** Dot radius in pixels. */
  dotSize?: number;
  /** Space between dots in pixels. */
  gap?: number;
  /** Dot color (any CSS color value). */
  color?: string;
  /** Enable subtle drift animation. Defaults to true. */
  animate?: boolean;
  /** Apply radial fade mask (vignette). Defaults to true. */
  fade?: boolean;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

const KEYFRAMES =
  "@keyframes ui-dot-grid-drift{0%{background-position:0 0}100%{background-position:var(--dot-gap) var(--dot-gap)}}";

export const DotGrid = forwardRef<HTMLDivElement, DotGridProps>(
  (
    {
      dotSize = 1,
      gap = 24,
      color = "rgba(255,255,255,0.15)",
      animate = true,
      fade = true,
      className,
      id,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;
    const reducedMotion = useReducedMotion();
    const shouldAnimate = animate && !reducedMotion;

    return (
      <>
        {shouldAnimate && <style>{KEYFRAMES}</style>}
        <div
          ref={ref}
          id={id}
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
          style={{
            ["--dot-gap" as string]: `${gap}px`,
            background: `radial-gradient(circle, ${color} ${dotSize}px, transparent ${dotSize}px)`,
            backgroundSize: `${gap}px ${gap}px`,
            ...(shouldAnimate
              ? {
                  animation: `ui-dot-grid-drift ${Math.max(gap * 0.5, 8)}s linear infinite`,
                }
              : {}),
            ...(fade
              ? {
                  maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                  WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                }
              : {}),
          }}
          data-component="dot-grid"
          {...rest}
        />
      </>
    );
  },
);

DotGrid.displayName = "DotGrid";
