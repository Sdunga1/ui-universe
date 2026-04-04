"use client";

import { AnimatePresence, motion } from "motion/react";
import { type MouseEvent, type ReactNode, forwardRef, useCallback, useRef, useState } from "react";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface RippleClickProps {
  /** Content to wrap with the ripple effect. */
  children: ReactNode;
  /** Ripple color. Defaults to "rgba(255,255,255,0.3)". */
  color?: string;
  /** Ripple animation duration in milliseconds. Defaults to 600. */
  duration?: number;
  /** Disable the ripple effect. Defaults to false. */
  disabled?: boolean;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

let rippleCounter = 0;

export const RippleClick = forwardRef<HTMLDivElement, RippleClickProps>(
  (
    {
      children,
      color = "rgba(255,255,255,0.3)",
      duration = 600,
      disabled = false,
      className,
      id,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;

    const [ripples, setRipples] = useState<Ripple[]>([]);
    const prefersReducedMotion = useReducedMotion();

    const isActive = !disabled && !prefersReducedMotion;

    const handleClick = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        if (!isActive) return;

        const element = ref.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 2;

        const newRipple: Ripple = {
          id: ++rippleCounter,
          x,
          y,
          size,
        };

        setRipples((prev) => [...prev, newRipple]);

        // Clean up after animation
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, duration);
      },
      [isActive, ref, duration],
    );

    return (
      <div
        ref={ref}
        id={id}
        className={cn("relative overflow-hidden", className)}
        onClick={handleClick}
        data-ripple-click=""
        {...rest}
      >
        {children}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="pointer-events-none absolute rounded-full"
              style={{
                left: ripple.x - ripple.size / 2,
                top: ripple.y - ripple.size / 2,
                width: ripple.size,
                height: ripple.size,
                backgroundColor: color,
              }}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration / 1000, ease: "easeOut" }}
              aria-hidden="true"
            />
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

RippleClick.displayName = "RippleClick";
