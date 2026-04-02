export type CubicBezier = readonly [number, number, number, number];

export interface MotionPresetConfig {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  transition: {
    duration: number;
    ease: CubicBezier;
    delay?: number;
  };
}

export interface MotionTokens {
  easing: Record<string, CubicBezier>;
  duration: Record<string, number>;
  stagger: Record<string, number>;
  distance: Record<string, number>;
  presets: Record<string, MotionPresetConfig>;
}
