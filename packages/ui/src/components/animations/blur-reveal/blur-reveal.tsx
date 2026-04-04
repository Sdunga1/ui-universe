"use client";

import type { MotionPresetName } from "@ui-universe/tokens";
import { motion } from "motion/react";
import { type ReactNode, forwardRef, useMemo, useRef } from "react";
import { useInView } from "../../../hooks/use-in-view";
import { useMotionPreset } from "../../../hooks/use-motion-preset";
import { cn } from "../../../lib/utils";

/** Default blur value used by the "blur" preset in the token system (px). */
const DEFAULT_PRESET_BLUR = 8;

export interface BlurRevealProps {
  /** Content to animate. */
  children: ReactNode;
  /** Initial blur amount in pixels. Defaults to 12. */
  blurAmount?: number;
  /** Custom delay in milliseconds. */
  delay?: number;
  /** Animate when element enters viewport. Defaults to true. */
  triggerOnView?: boolean;
  /** Fraction of element visible before triggering (0-1). Defaults to 0.2. */
  viewThreshold?: number;
  /** Only animate once. Defaults to true. */
  once?: boolean;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

export const BlurReveal = forwardRef<HTMLDivElement, BlurRevealProps>(
  (
    {
      blurAmount = 12,
      delay,
      triggerOnView = true,
      viewThreshold = 0.2,
      once = true,
      className,
      children,
      id,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;

    const isInView = useInView(ref, { threshold: viewThreshold, once });

    const preset: MotionPresetName = "blur";

    const custom = useMemo(() => {
      if (blurAmount === DEFAULT_PRESET_BLUR) return undefined;

      return {
        initial: { filter: `blur(${blurAmount}px)` },
        animate: { filter: "blur(0px)" },
      };
    }, [blurAmount]);

    const motionValues = useMotionPreset({ preset, delay, custom });

    const shouldAnimate = triggerOnView ? isInView : true;

    return (
      <motion.div
        ref={ref}
        id={id}
        className={cn(className)}
        initial={motionValues.initial}
        animate={shouldAnimate ? motionValues.animate : motionValues.initial}
        transition={motionValues.transition}
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);

BlurReveal.displayName = "BlurReveal";
