"use client";

import { motion } from "motion/react";
import { type ReactNode, forwardRef, useRef } from "react";
import { useMousePosition } from "../../../hooks/use-mouse-position";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

export interface TiltCardProps {
  /** Content to render inside the tilting card. */
  children: ReactNode;
  /** Maximum tilt angle in degrees. Defaults to 15. */
  maxTilt?: number;
  /** CSS perspective value in pixels. Defaults to 1000. */
  perspective?: number;
  /** Scale factor on hover. Defaults to 1.02. */
  scale?: number;
  /** Show a reflective glare overlay on hover. Defaults to false. */
  glare?: boolean;
  /** Disable the tilt effect. Defaults to false. */
  disabled?: boolean;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

export const TiltCard = forwardRef<HTMLDivElement, TiltCardProps>(
  (
    {
      children,
      maxTilt = 15,
      perspective = 1000,
      scale = 1.02,
      glare = false,
      disabled = false,
      className,
      id,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;

    const mouse = useMousePosition(ref);
    const prefersReducedMotion = useReducedMotion();

    const isActive = !disabled && !prefersReducedMotion;

    const rotateX = isActive && mouse.isHovering ? -mouse.y * maxTilt : 0;
    const rotateY = isActive && mouse.isHovering ? mouse.x * maxTilt : 0;
    const currentScale = isActive && mouse.isHovering ? scale : 1;

    // Glare position: map normalized mouse coords (-1..1) to percentage (0..100)
    const glareX = ((mouse.x + 1) / 2) * 100;
    const glareY = ((mouse.y + 1) / 2) * 100;

    return (
      <div
        ref={ref}
        id={id}
        className={cn("relative", className)}
        style={{ perspective: `${perspective}px` }}
        data-tilt-card=""
        {...rest}
      >
        <motion.div
          className="relative h-full w-full"
          animate={{
            rotateX,
            rotateY,
            scale: currentScale,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
          {glare && isActive && mouse.isHovering && (
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
              style={{
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
              }}
              aria-hidden="true"
            />
          )}
        </motion.div>
      </div>
    );
  },
);

TiltCard.displayName = "TiltCard";
