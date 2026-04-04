"use client";

import type { MotionPresetName } from "@ui-universe/tokens";
import { motion } from "motion/react";
import { type ReactNode, forwardRef, useMemo, useRef } from "react";
import { useInView } from "../../../hooks/use-in-view";
import { useMotionPreset } from "../../../hooks/use-motion-preset";
import { cn } from "../../../lib/utils";

/** Default initial scale value for the scaleIn animation. */
const DEFAULT_SCALE = 0.92;

export interface ScaleInProps {
  /** Content to animate. */
  children: ReactNode;
  /** Motion preset from the token system. Defaults to "scaleIn". */
  preset?: MotionPresetName;
  /** Initial scale value before animation (0-1). Defaults to 0.92. */
  scale?: number;
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

export const ScaleIn = forwardRef<HTMLDivElement, ScaleInProps>(
  (
    {
      preset = "scaleIn",
      scale = DEFAULT_SCALE,
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

    const custom = useMemo(
      () => (scale !== DEFAULT_SCALE ? { initial: { scale }, animate: { scale: 1 } } : undefined),
      [scale],
    );

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

ScaleIn.displayName = "ScaleIn";
