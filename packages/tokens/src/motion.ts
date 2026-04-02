import type { CubicBezier, MotionPresetConfig } from "./types";

// ---------------------------------------------------------------------------
// Easing Curves
// ---------------------------------------------------------------------------
export const easing = {
  smooth: [0.25, 0.1, 0.25, 1.0] as const,
  snappy: [0.6, 0.05, 0.01, 0.9] as const,
  dramatic: [0.16, 1, 0.3, 1] as const,
  decel: [0.0, 0.0, 0.2, 1.0] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  linear: [0, 0, 1, 1] as const,
} as const satisfies Record<string, CubicBezier>;

export type EasingName = keyof typeof easing;

// ---------------------------------------------------------------------------
// Durations (ms)
// ---------------------------------------------------------------------------
export const duration = {
  instant: 100,
  fast: 200,
  normal: 400,
  slow: 600,
  dramatic: 1000,
} as const;

export type DurationName = keyof typeof duration;

// ---------------------------------------------------------------------------
// Stagger Intervals (ms)
// ---------------------------------------------------------------------------
export const stagger = {
  tight: 40,
  normal: 80,
  relaxed: 150,
  dramatic: 250,
} as const;

export type StaggerName = keyof typeof stagger;

// ---------------------------------------------------------------------------
// Distances (px)
// ---------------------------------------------------------------------------
export const distance = {
  subtle: 8,
  normal: 24,
  pronounced: 48,
  dramatic: 80,
} as const;

export type DistanceName = keyof typeof distance;

// ---------------------------------------------------------------------------
// Composable Motion Presets
//
// Each preset is a complete { initial, animate, transition } object
// ready to spread into Motion components.
// ---------------------------------------------------------------------------
export const presets = {
  fadeUp: {
    initial: { opacity: 0, y: distance.normal },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.normal / 1000, ease: easing.decel },
  },

  fadeDown: {
    initial: { opacity: 0, y: -distance.normal },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.normal / 1000, ease: easing.decel },
  },

  fadeLeft: {
    initial: { opacity: 0, x: distance.normal },
    animate: { opacity: 1, x: 0 },
    transition: { duration: duration.normal / 1000, ease: easing.dramatic },
  },

  fadeRight: {
    initial: { opacity: 0, x: -distance.normal },
    animate: { opacity: 1, x: 0 },
    transition: { duration: duration.normal / 1000, ease: easing.dramatic },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: duration.normal / 1000, ease: easing.smooth },
  },

  popIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: duration.fast / 1000, ease: easing.spring },
  },

  blur: {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    transition: { duration: duration.slow / 1000, ease: easing.decel },
  },

  slideUp: {
    initial: { opacity: 0, y: distance.dramatic },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.slow / 1000, ease: easing.dramatic },
  },

  slideDown: {
    initial: { opacity: 0, y: -distance.dramatic },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.slow / 1000, ease: easing.dramatic },
  },
} as const satisfies Record<string, MotionPresetConfig>;

export type MotionPresetName = keyof typeof presets;

// ---------------------------------------------------------------------------
// Unified motion token object
// ---------------------------------------------------------------------------
export const motion = {
  easing,
  duration,
  stagger,
  distance,
  presets,
} as const;
