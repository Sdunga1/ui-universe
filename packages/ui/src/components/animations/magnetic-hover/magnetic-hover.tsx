"use client";

import { motion } from "motion/react";
import { type ReactNode, forwardRef, useRef } from "react";
import { useMousePosition } from "../../../hooks/use-mouse-position";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

export interface MagneticHoverProps {
  /** Content to apply the magnetic effect to. */
  children: ReactNode;
  /** Pull strength toward cursor (0-1). Defaults to 0.3. */
  strength?: number;
  /** Activation radius in pixels. Defaults to 200. */
  radius?: number;
  /** Disable the magnetic effect. Defaults to false. */
  disabled?: boolean;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

export const MagneticHover = forwardRef<HTMLDivElement, MagneticHoverProps>(
  (
    { children, strength = 0.3, radius = 200, disabled = false, className, id, ...rest },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;

    const mouse = useMousePosition(ref);
    const prefersReducedMotion = useReducedMotion();

    const isActive = !disabled && !prefersReducedMotion;

    return (
      <motion.div
        ref={ref}
        id={id}
        className={cn("inline-block", className)}
        animate={
          isActive && mouse.isHovering
            ? { x: mouse.x * strength * 60, y: mouse.y * strength * 60 }
            : { x: 0, y: 0 }
        }
        transition={{ type: "spring", stiffness: 180, damping: 12, mass: 0.1 }}
        data-magnetic-hover=""
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);

MagneticHover.displayName = "MagneticHover";
