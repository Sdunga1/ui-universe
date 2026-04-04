"use client";

import { type ComponentPropsWithoutRef, forwardRef, useRef } from "react";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  /** Button label / content. */
  children: React.ReactNode;
  /** Color of the shimmer highlight. Defaults to "rgba(255,255,255,0.1)". */
  shimmerColor?: string;
  /** Width of the shimmer gradient band. Defaults to "200%". */
  shimmerWidth?: string;
  /** Duration of the shimmer sweep in seconds. Defaults to 1.5. */
  duration?: number;
}

const SHIMMER_KEYFRAMES = `
@keyframes ui-shimmer-sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      children,
      shimmerColor = "rgba(255,255,255,0.1)",
      shimmerWidth = "200%",
      duration = 1.5,
      className,
      id,
      style,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLButtonElement>) ?? internalRef;

    const prefersReducedMotion = useReducedMotion();

    return (
      <>
        <style>{SHIMMER_KEYFRAMES}</style>
        <button
          ref={ref}
          id={id}
          className={cn(
            "group relative inline-flex items-center justify-center overflow-hidden rounded-lg px-6 py-3 font-semibold transition-opacity",
            prefersReducedMotion && "hover:opacity-90",
            className,
          )}
          style={style}
          data-shimmer-button=""
          {...rest}
        >
          {/* Shimmer overlay */}
          {!prefersReducedMotion && (
            <span
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
              aria-hidden="true"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
                width: shimmerWidth,
                animation: `ui-shimmer-sweep ${duration}s ease-in-out infinite`,
                animationPlayState: "paused",
              }}
            >
              <style>{`
                    [data-shimmer-button]:hover [aria-hidden="true"] {
                      animation-play-state: running !important;
                    }
                  `}</style>
            </span>
          )}
          {/* Content sits above the shimmer */}
          <span className="relative z-10">{children}</span>
        </button>
      </>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";
