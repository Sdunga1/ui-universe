"use client";

import { type MotionPresetName, presets } from "@ui-universe/tokens";
import type { MotionPresetConfig } from "@ui-universe/tokens";
import { useMemo } from "react";
import { useReducedMotion } from "./use-reduced-motion";

interface UseMotionPresetOptions {
  preset?: MotionPresetName;
  delay?: number;
  custom?: Partial<MotionPresetConfig>;
}

interface MotionValues {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  transition: Record<string, unknown>;
}

export function useMotionPreset({
  preset = "fadeUp",
  delay,
  custom,
}: UseMotionPresetOptions = {}): MotionValues {
  const prefersReducedMotion = useReducedMotion();

  return useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.01 },
      };
    }

    const base = presets[preset];

    const initial = custom?.initial ? { ...base.initial, ...custom.initial } : base.initial;
    const animate = custom?.animate ? { ...base.animate, ...custom.animate } : base.animate;
    const transition = {
      ...base.transition,
      ...custom?.transition,
      ...(delay !== undefined ? { delay: delay / 1000 } : {}),
    };

    return {
      initial: { ...initial },
      animate: { ...animate },
      transition,
    };
  }, [preset, delay, custom, prefersReducedMotion]);
}
