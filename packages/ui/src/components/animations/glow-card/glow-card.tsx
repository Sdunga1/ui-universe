"use client";

import { motion } from "motion/react";
import { type ReactNode, forwardRef, useRef } from "react";
import { useMousePosition } from "../../../hooks/use-mouse-position";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

export interface GlowCardProps {
  /** Content to render inside the glowing card. */
  children: ReactNode;
  /** Color of the glow effect. Defaults to "#ee502c". */
  glowColor?: string;
  /** Diameter of the glow in pixels. Defaults to 200. */
  glowSize?: number;
  /** Border radius of the card. Defaults to "0". */
  borderRadius?: string;
  /** Disable the glow effect. Defaults to false. */
  disabled?: boolean;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

export const GlowCard = forwardRef<HTMLDivElement, GlowCardProps>(
  (
    {
      children,
      glowColor = "#ee502c",
      glowSize = 200,
      borderRadius = "0",
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

    // Convert normalized mouse coords (-1..1) to percentage position
    const glowX = ((mouse.x + 1) / 2) * 100;
    const glowY = ((mouse.y + 1) / 2) * 100;

    const half = glowSize / 2;

    // The outer wrapper acts as the glow border — a radial gradient that follows the cursor
    const staticBg = `radial-gradient(circle at 50% 50%, ${glowColor}44 0%, transparent ${half}px)`;
    const dynamicBg = `radial-gradient(circle at ${glowX}% ${glowY}%, ${glowColor} 0%, transparent ${half}px)`;

    return (
      <motion.div
        ref={ref}
        id={id}
        className={cn("relative p-px", className)}
        style={{
          borderRadius,
          background: isActive && mouse.isHovering ? dynamicBg : staticBg,
        }}
        animate={{
          opacity: isActive && mouse.isHovering ? 1 : 0.5,
        }}
        transition={{ duration: 0.2 }}
        data-glow-card=""
        {...rest}
      >
        {/* Outer glow (blurred shadow behind) */}
        <motion.div
          className="pointer-events-none absolute -inset-1"
          style={{
            borderRadius,
            background: isActive && mouse.isHovering ? dynamicBg : "transparent",
            filter: "blur(12px)",
          }}
          animate={{
            opacity: isActive && mouse.isHovering ? 0.6 : 0,
          }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        />
        {/* Content sits inside with solid background — glow peeks through as a 1px border */}
        <div className="relative overflow-hidden bg-[var(--card)]" style={{ borderRadius }}>
          {children}
        </div>
      </motion.div>
    );
  },
);

GlowCard.displayName = "GlowCard";
