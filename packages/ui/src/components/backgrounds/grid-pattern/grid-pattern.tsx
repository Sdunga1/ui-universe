"use client";

import { forwardRef, useId, useRef } from "react";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

export interface GridPatternProps {
  /** Grid cell size in pixels. */
  size?: number;
  /** Line color (any CSS color value). */
  strokeColor?: string;
  /** Line width in pixels. */
  strokeWidth?: number;
  /** Apply radial fade mask (vignette). Defaults to true. */
  fade?: boolean;
  /** Enable subtle pulse animation on stroke opacity. Defaults to true. */
  animate?: boolean;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

const PULSE_KEYFRAMES = "@keyframes ui-grid-pulse{0%,100%{opacity:1}50%{opacity:0.5}}";

export const GridPattern = forwardRef<HTMLDivElement, GridPatternProps>(
  (
    {
      size = 32,
      strokeColor = "rgba(255,255,255,0.08)",
      strokeWidth = 1,
      fade = true,
      animate = true,
      className,
      id,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;
    const patternId = useId();
    const reducedMotion = useReducedMotion();
    const shouldAnimate = animate && !reducedMotion;

    return (
      <>
        {shouldAnimate && <style>{PULSE_KEYFRAMES}</style>}
        <div
          ref={ref}
          id={id}
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
          style={{
            ...(fade
              ? {
                  maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                  WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                }
              : {}),
          }}
          data-component="grid-pattern"
          {...rest}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            style={
              shouldAnimate ? { animation: "ui-grid-pulse 4s ease-in-out infinite" } : undefined
            }
          >
            <title>Grid pattern background</title>
            <defs>
              <pattern id={patternId} width={size} height={size} patternUnits="userSpaceOnUse">
                <path
                  d={`M ${size} 0 L 0 0 0 ${size}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        </div>
      </>
    );
  },
);

GridPattern.displayName = "GridPattern";
