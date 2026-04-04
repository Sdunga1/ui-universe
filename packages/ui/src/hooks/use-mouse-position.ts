"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";

interface MousePosition {
  /** Normalized x position (-1 to 1, 0 = center) */
  x: number;
  /** Normalized y position (-1 to 1, 0 = center) */
  y: number;
  /** Whether the mouse is currently over the element */
  isHovering: boolean;
}

/**
 * Tracks mouse position relative to an element's bounds.
 * Returns normalized coordinates (-1 to 1) where 0,0 is the center.
 *
 * Used by: MagneticHover, TiltCard, GlowCard
 */
export function useMousePosition(ref: RefObject<Element | null>): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    isHovering: false,
  });

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;

      setPosition({ x, y, isHovering: true });
    },
    [ref],
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0, isHovering: false });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const el = element as HTMLElement;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, handleMouseMove, handleMouseLeave]);

  return position;
}
