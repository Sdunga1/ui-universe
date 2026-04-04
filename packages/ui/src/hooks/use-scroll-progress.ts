"use client";

import { type RefObject, useEffect, useState } from "react";

/**
 * Returns a 0-1 value representing how far an element has scrolled
 * through the viewport. 0 = element just entered bottom, 1 = element
 * has passed through completely.
 *
 * Used by: TextReveal
 */
export function useScrollProgress(ref: RefObject<Element | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Element enters at bottom of viewport (progress=0)
      // Element exits at top of viewport (progress=1)
      const start = windowHeight;
      const end = -rect.height;
      const current = rect.top;

      const rawProgress = (start - current) / (start - end);
      setProgress(Math.min(1, Math.max(0, rawProgress)));
    };

    handleScroll(); // Initial calculation
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [ref]);

  return progress;
}
