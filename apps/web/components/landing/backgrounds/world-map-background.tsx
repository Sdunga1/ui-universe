"use client";

import { useEffect, useRef } from "react";
import { LAND_DOTS } from "./world-map-dots";

const ACCENT_RGB = "238, 80, 44";
const BASE_OPACITY = 0.05;
const HIGHLIGHT_EXTRA = 0.2;
const MAX_DPR = 2;

const C_NA = 0;
const C_SA = 1;
const C_EU = 2;
const C_AF = 3;
const C_AS = 4;
const C_OC = 5;
const C_AN = 6;
const CONTINENT_COUNT = 7;

const HIGHLIGHTABLE = [C_NA, C_SA, C_EU, C_AF, C_AS, C_OC];

// Classify a dot into a continent by its normalized position (0-10000)
// Boundaries tuned to avoid splitting continents during highlight animation
function classifyContinent(nx: number, ny: number): number {
  if (ny > 8500) return C_AN;
  // Oceania: Australia + NZ + Pacific islands (far right, southern half)
  if (nx >= 7200 && ny > 5000) return C_OC;
  // North America: includes Greenland, Alaska, Caribbean
  if (nx < 3500 && ny < 4300) return C_NA;
  // South America
  if (nx < 3700 && ny >= 4300) return C_SA;
  // Europe: includes UK, Iceland, Scandinavia, Mediterranean
  if (nx >= 3500 && nx < 5600 && ny < 2600) return C_EU;
  // Africa: extends east to ~60°E (Horn of Africa, Madagascar)
  // but only below the Europe/Turkey band
  if (nx >= 3500 && nx < 6200 && ny >= 2600 && ny < 8500) return C_AF;
  // Everything else is Asia
  return C_AS;
}

interface Dot {
  nx: number; // normalized x (0-10000)
  ny: number; // normalized y (0-10000)
  continent: number;
}

interface ContinentHighlight {
  continentIndex: number;
  startTime: number;
  fadeIn: number;
  hold: number;
  fadeOut: number;
}

function getHighlightIntensity(hl: ContinentHighlight, now: number): number {
  const elapsed = now - hl.startTime;
  if (elapsed < 0) return 0;
  if (elapsed < hl.fadeIn) return elapsed / hl.fadeIn;
  if (elapsed < hl.fadeIn + hl.hold) return 1;
  const fadeElapsed = elapsed - hl.fadeIn - hl.hold;
  if (fadeElapsed < hl.fadeOut) return 1 - fadeElapsed / hl.fadeOut;
  return 0;
}

function totalDuration(hl: ContinentHighlight): number {
  return hl.fadeIn + hl.hold + hl.fadeOut;
}

interface Props {
  reducedMotion: boolean;
}

export function WorldMapBackground({ reducedMotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    // Parse flat array into dot objects with continent classification
    const dots: Dot[] = [];
    for (let i = 0; i < LAND_DOTS.length; i += 2) {
      const nx = LAND_DOTS[i] ?? 0;
      const ny = LAND_DOTS[i + 1] ?? 0;
      dots.push({ nx, ny, continent: classifyContinent(nx, ny) });
    }

    // Group dots by continent
    const continentDots: number[][] = Array.from({ length: CONTINENT_COUNT }, () => []);
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      if (d) continentDots[d.continent]?.push(i);
    }

    let offscreen: HTMLCanvasElement | null = null;
    let dotSize = 0;
    // Minimum aspect ratio so the map doesn't squish on narrow screens
    const MIN_ASPECT = 1.8;
    let virtualW = 0;
    let drawOffsetX = 0;

    const buildOffscreen = (viewW: number, viewH: number) => {
      const cssViewW = viewW / dpr;
      const cssViewH = viewH / dpr;
      // Enforce minimum aspect ratio — draw wider than viewport if needed
      const cssDrawW = Math.max(cssViewW, cssViewH * MIN_ASPECT);
      drawOffsetX = (cssViewW - cssDrawW) / 2; // negative when wider
      virtualW = cssDrawW;

      const drawW = Math.round(cssDrawW * dpr);
      const drawH = viewH;

      offscreen = document.createElement("canvas");
      offscreen.width = drawW;
      offscreen.height = drawH;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      dotSize = Math.min(cssDrawW / 220, cssViewH / 110) * 0.38;

      offCtx.scale(dpr, dpr);
      offCtx.fillStyle = `rgba(${ACCENT_RGB}, ${BASE_OPACITY})`;
      offCtx.beginPath();
      for (const dot of dots) {
        const x = (dot.nx / 10000) * cssDrawW;
        const y = (dot.ny / 10000) * cssViewH;
        offCtx.moveTo(x + dotSize, y);
        offCtx.arc(x, y, dotSize, 0, Math.PI * 2);
      }
      offCtx.fill();
    };

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildOffscreen(canvas.width, canvas.height);
    };

    resize();

    let highlights: ContinentHighlight[] = [];
    let lastSpawnTime = 0;
    const activeSet = new Set<number>();
    const SPAWN_INTERVAL = 2000;
    let animId: number;

    const spawnContinentHighlight = (now: number) => {
      // Pick a continent not currently highlighted
      const available = HIGHLIGHTABLE.filter((c) => !activeSet.has(c));
      if (available.length === 0) return;
      const next = available[Math.floor(Math.random() * available.length)] ?? C_NA;
      activeSet.add(next);

      highlights.push({
        continentIndex: next,
        startTime: now,
        fadeIn: 2000 + Math.random() * 500,
        hold: 1500 + Math.random() * 1000,
        fadeOut: 2000 + Math.random() * 500,
      });
    };

    const draw = (now: number) => {
      if (!offscreen) {
        animId = requestAnimationFrame(draw);
        return;
      }

      const cssW = canvas.width / dpr;
      const cssH = canvas.height / dpr;

      ctx.clearRect(0, 0, cssW, cssH);
      // Draw the (possibly wider) offscreen canvas centered
      ctx.drawImage(offscreen, drawOffsetX, 0, virtualW, cssH);

      if (!reducedMotion && now - lastSpawnTime > SPAWN_INTERVAL) {
        spawnContinentHighlight(now);
        lastSpawnTime = now;
      }

      highlights = highlights.filter((hl) => {
        const intensity = getHighlightIntensity(hl, now);
        if (now - hl.startTime > totalDuration(hl)) {
          activeSet.delete(hl.continentIndex);
          return false;
        }
        if (intensity <= 0) return true;

        const extra = intensity * HIGHLIGHT_EXTRA;
        const indices = continentDots[hl.continentIndex] ?? [];

        ctx.fillStyle = `rgba(${ACCENT_RGB}, ${extra})`;
        ctx.beginPath();
        for (const idx of indices) {
          const dot = dots[idx];
          if (!dot) continue;
          const x = (dot.nx / 10000) * virtualW + drawOffsetX;
          const y = (dot.ny / 10000) * cssH;
          ctx.moveTo(x + dotSize, y);
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        }
        ctx.fill();

        return true;
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    const observer = new ResizeObserver(() => resize());
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
