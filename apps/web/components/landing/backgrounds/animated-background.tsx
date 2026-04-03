"use client";

import { useEffect, useState } from "react";
import { MeteorsBackground } from "./meteors-background";
import { ParticlesBackground } from "./particles-background";
import { SpaceObjectsBackground } from "./space-objects-background";
import { SweepLinesBackground } from "./sweep-lines-background";
import { WorldMapBackground } from "./world-map-background";

export function AnimatedBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <WorldMapBackground reducedMotion={reducedMotion} />
      <SweepLinesBackground reducedMotion={reducedMotion} />
      <SpaceObjectsBackground reducedMotion={reducedMotion} />
      <ParticlesBackground reducedMotion={reducedMotion} />
      <MeteorsBackground reducedMotion={reducedMotion} />
    </div>
  );
}
