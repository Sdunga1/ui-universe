"use client";

import { motion } from "motion/react";
import { type ReactNode, forwardRef, useRef } from "react";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

export interface GradientTextProps {
  /** Text content to render with a gradient. */
  children: ReactNode;
  /** Array of CSS color values for the gradient stops. */
  colors?: string[];
  /** Animation cycle duration in seconds. */
  speed?: number;
  /** Enable animated gradient sweep. */
  animate?: boolean;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

export const GradientText = forwardRef<HTMLSpanElement, GradientTextProps>(
  (
    {
      children,
      colors = ["#ee502c", "#f97316", "#eab308", "#ee502c"],
      speed = 3,
      animate = true,
      className,
      id,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLSpanElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLSpanElement>) ?? internalRef;

    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animate && !prefersReducedMotion;

    const gradientStr = `linear-gradient(90deg, ${colors.join(", ")})`;

    const baseStyle: React.CSSProperties = {
      backgroundImage: gradientStr,
      backgroundSize: "200% auto",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
    };

    if (!shouldAnimate) {
      return (
        <span
          ref={ref}
          id={id}
          className={cn("uiu-gradient-text", className)}
          data-component="gradient-text"
          style={baseStyle}
          {...rest}
        >
          {children}
        </span>
      );
    }

    return (
      <motion.span
        ref={ref}
        id={id}
        className={cn("uiu-gradient-text", className)}
        data-component="gradient-text"
        style={baseStyle}
        animate={{ backgroundPosition: ["0% center", "200% center"] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
        {...rest}
      >
        {children}
      </motion.span>
    );
  },
);

GradientText.displayName = "GradientText";
