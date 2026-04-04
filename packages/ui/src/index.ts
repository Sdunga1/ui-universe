// Primitives
export { MotionContainer, type MotionContainerProps } from "./primitives";
export { StaggerGroup, type StaggerGroupProps } from "./primitives";

// Hooks
export { useMotionPreset } from "./hooks";
export { useReducedMotion } from "./hooks";
export { useInView } from "./hooks";
export { useMousePosition } from "./hooks";
export { useInterval } from "./hooks";
export { useScrollProgress } from "./hooks";

// Utilities
export { cn } from "./lib/utils";

// Components — re-exported from category barrels
export * from "./components/animations";
export * from "./components/backgrounds";
export * from "./components/sections";
export * from "./components/text";
