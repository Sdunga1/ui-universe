"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "../../../hooks/use-in-view";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

export interface CounterProps {
  /** Starting number. */
  from?: number;
  /** Target number to count to. */
  to: number;
  /** Animation duration in milliseconds. */
  duration?: number;
  /** Number of decimal places to display. */
  decimals?: number;
  /** Thousands separator character. */
  separator?: string;
  /** Text prepended to the number (e.g., "$"). */
  prefix?: string;
  /** Text appended to the number (e.g., "%"). */
  suffix?: string;
  /** Start counting when the element enters the viewport. */
  triggerOnView?: boolean;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

/**
 * Format a number with thousands separators and decimal places.
 */
function formatNumber(value: number, decimals: number, separator: string): string {
  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");

  // Add thousands separator
  const formatted = (intPart ?? "").replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return decPart !== undefined ? `${formatted}.${decPart}` : formatted;
}

/**
 * Deceleration easing: fast at start, slow at end.
 * Matches the easing.decel token [0.0, 0.0, 0.2, 1.0] approximation.
 */
function easeOutDecel(t: number): number {
  return 1 - (1 - t) ** 3;
}

export const Counter = forwardRef<HTMLSpanElement, CounterProps>(
  (
    {
      from = 0,
      to,
      duration = 2000,
      decimals = 0,
      separator = ",",
      prefix = "",
      suffix = "",
      triggerOnView = true,
      className,
      id,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLSpanElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLSpanElement>) ?? internalRef;

    const prefersReducedMotion = useReducedMotion();
    const isInView = useInView(ref, { threshold: 0.2, once: true });
    const [currentValue, setCurrentValue] = useState(from);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const shouldStart = triggerOnView ? isInView : true;

    const animateCount = useCallback(
      (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutDecel(progress);

        const value = from + (to - from) * easedProgress;
        setCurrentValue(value);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateCount);
        }
      },
      [from, to, duration],
    );

    useEffect(() => {
      if (prefersReducedMotion) {
        setCurrentValue(to);
        return;
      }

      if (!shouldStart) return;

      startTimeRef.current = null;
      animationRef.current = requestAnimationFrame(animateCount);

      return () => {
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [shouldStart, prefersReducedMotion, animateCount, to]);

    const displayValue = prefersReducedMotion ? to : currentValue;
    const formattedValue = formatNumber(displayValue, decimals, separator);

    return (
      <span
        ref={ref}
        id={id}
        className={cn("uiu-counter", "tabular-nums", className)}
        data-component="counter"
        aria-label={`${prefix}${formatNumber(to, decimals, separator)}${suffix}`}
        {...rest}
      >
        {prefix}
        {formattedValue}
        {suffix}
      </span>
    );
  },
);

Counter.displayName = "Counter";
