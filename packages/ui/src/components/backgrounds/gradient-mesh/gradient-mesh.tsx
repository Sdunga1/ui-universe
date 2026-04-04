"use client";

import { forwardRef, useMemo, useRef } from "react";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

export interface GradientMeshProps {
  /** Array of CSS color values for gradient blobs. */
  colors?: string[];
  /** Animation cycle duration in seconds. */
  speed?: number;
  /** Blur amount in pixels for the soft mesh effect. */
  blur?: number;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

interface BlobPosition {
  x: string;
  y: string;
  kx: string;
  ky: string;
}

const DEFAULT_BLOB: BlobPosition = { x: "20%", y: "20%", kx: "30%", ky: "60%" };

const BLOB_POSITIONS: BlobPosition[] = [
  DEFAULT_BLOB,
  { x: "70%", y: "30%", kx: "20%", ky: "70%" },
  { x: "40%", y: "70%", kx: "70%", ky: "20%" },
  { x: "80%", y: "60%", kx: "10%", ky: "40%" },
];

function buildKeyframes(colors: string[]): string {
  return colors
    .map((_, i) => {
      const pos = BLOB_POSITIONS[i % BLOB_POSITIONS.length] ?? DEFAULT_BLOB;
      return `@keyframes ui-mesh-blob-${i}{0%,100%{transform:translate(0,0)}33%{transform:translate(${pos.kx},calc(-1*${pos.ky}))}66%{transform:translate(calc(-1*${pos.kx}),${pos.ky})}}`;
    })
    .join("");
}

export const GradientMesh = forwardRef<HTMLDivElement, GradientMeshProps>(
  (
    {
      colors = ["#ee502c", "#f97316", "#8b5cf6", "#06b6d4"],
      speed = 8,
      blur = 80,
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

    const keyframes = useMemo(() => buildKeyframes(colors), [colors]);

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
          data-component="gradient-mesh"
          {...rest}
        >
          {colors.map((color, i) => {
            const pos = BLOB_POSITIONS[i % BLOB_POSITIONS.length] ?? DEFAULT_BLOB;
            return (
              <div
                key={`mesh-blob-${color}`}
                style={{
                  position: "absolute",
                  top: pos.y,
                  left: pos.x,
                  width: "60%",
                  height: "60%",
                  borderRadius: "50%",
                  background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
                  filter: `blur(${blur}px)`,
                  ...(shouldAnimate
                    ? {
                        animation: `ui-mesh-blob-${i} ${speed + i * 1.5}s ease-in-out infinite`,
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

GradientMesh.displayName = "GradientMesh";
