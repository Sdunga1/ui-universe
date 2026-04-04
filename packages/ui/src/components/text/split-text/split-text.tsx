"use client";

import type { MotionPresetName, StaggerName } from "@ui-universe/tokens";
import { stagger as staggerTokens } from "@ui-universe/tokens";
import { motion } from "motion/react";
import { forwardRef, useMemo, useRef } from "react";
import { useInView } from "../../../hooks/use-in-view";
import { useMotionPreset } from "../../../hooks/use-motion-preset";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

export interface SplitTextProps {
  /** The text string to split and animate per-character. */
  text: string;
  /** Stagger delay between characters. Token name or raw ms value. */
  stagger?: StaggerName | number;
  /** Motion preset for each character's entrance. */
  preset?: MotionPresetName;
  /** Animate when element enters viewport. */
  triggerOnView?: boolean;
  /** Fraction of element visible before triggering (0-1). */
  viewThreshold?: number;
  /** Only animate once. */
  once?: boolean;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

export const SplitText = forwardRef<HTMLDivElement, SplitTextProps>(
  (
    {
      text,
      stagger = "normal",
      preset = "fadeUp",
      triggerOnView = true,
      viewThreshold = 0.2,
      once = true,
      className,
      id,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;

    const prefersReducedMotion = useReducedMotion();
    const isInView = useInView(ref, { threshold: viewThreshold, once });
    const motionValues = useMotionPreset({ preset });

    const shouldAnimate = triggerOnView ? isInView : true;

    // Resolve stagger value: token name or raw number
    const staggerMs = useMemo(() => {
      if (typeof stagger === "number") return stagger;
      return staggerTokens[stagger] ?? staggerTokens.normal;
    }, [stagger]);

    const characters = useMemo(() => text.split(""), [text]);

    if (prefersReducedMotion) {
      return (
        <div
          ref={ref}
          id={id}
          className={cn("uiu-split-text", className)}
          data-component="split-text"
          aria-label={text}
          {...rest}
        >
          {text}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        id={id}
        className={cn("uiu-split-text", className)}
        data-component="split-text"
        aria-label={text}
        {...rest}
      >
        {characters.map((char, i) => {
          // Spaces are rendered as non-animated spans to preserve layout
          if (char === " ") {
            return (
              <span key={`space-at-${String(i)}`} className="uiu-split-text-space">
                {"\u00A0"}
              </span>
            );
          }

          const charDelay = (i * staggerMs) / 1000;

          return (
            <motion.span
              key={`${char}-at-${String(i)}`}
              className="uiu-split-text-char"
              style={{ display: "inline-block" }}
              initial={motionValues.initial}
              animate={shouldAnimate ? motionValues.animate : motionValues.initial}
              transition={{
                ...motionValues.transition,
                delay: charDelay,
              }}
              data-index={i}
              aria-hidden="true"
            >
              {char}
            </motion.span>
          );
        })}
      </div>
    );
  },
);

SplitText.displayName = "SplitText";
