"use client";

import type { DistanceName, MotionPresetName } from "@ui-universe/tokens";
import { distance as distanceTokens } from "@ui-universe/tokens";
import { motion } from "motion/react";
import { type ReactNode, forwardRef, useMemo, useRef } from "react";
import { useInView } from "../../../hooks/use-in-view";
import { useMotionPreset } from "../../../hooks/use-motion-preset";
import { cn } from "../../../lib/utils";

/** Maps a slide direction to its default motion preset. */
const directionPresetMap: Record<SlideDirection, MotionPresetName> = {
  left: "fadeLeft",
  right: "fadeRight",
  up: "fadeUp",
  down: "fadeDown",
};

/** Maps a slide direction to the transform axis it operates on. */
const directionAxisMap: Record<SlideDirection, "x" | "y"> = {
  left: "x",
  right: "x",
  up: "y",
  down: "y",
};

/**
 * Returns the signed pixel value for the given direction.
 * Positive = element starts offset to the right / below.
 * Negative = element starts offset to the left / above.
 */
function resolveSignedDistance(direction: SlideDirection, pixels: number): number {
  switch (direction) {
    case "left":
      return pixels;
    case "right":
      return -pixels;
    case "up":
      return pixels;
    case "down":
      return -pixels;
  }
}

type SlideDirection = "left" | "right" | "up" | "down";

export interface SlideInProps {
  /** Content to animate. */
  children: ReactNode;
  /** Direction to slide in from. Defaults to "left". */
  direction?: SlideDirection;
  /** Slide distance -- use a token name ('subtle', 'normal', 'pronounced', 'dramatic') or a pixel value. Defaults to "normal". */
  distance?: DistanceName | number;
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

export const SlideIn = forwardRef<HTMLDivElement, SlideInProps>(
  (
    {
      direction = "left",
      distance = "normal",
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

    const preset = directionPresetMap[direction];
    const axis = directionAxisMap[direction];

    const custom = useMemo(() => {
      const resolvedPixels = typeof distance === "string" ? distanceTokens[distance] : distance;

      const signed = resolveSignedDistance(direction, resolvedPixels);

      return {
        initial: { [axis]: signed },
        animate: { [axis]: 0 },
      };
    }, [direction, distance, axis]);

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

SlideIn.displayName = "SlideIn";
