"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ComponentComparison {
  name: string;
  rawTokens: number;
  descTokens: number;
  rawQuality: number;
  descQuality: number;
}

export function CompareSlider({ data }: { data: ComponentComparison[] }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);
  const autoplayRef = useRef<number | null>(null);

  const maxTokens = Math.max(...data.map((d) => d.rawTokens));

  // Autoplay — sweep back and forth when not hovered
  const AUTOPLAY_DURATION = 5000; // ms for a full cycle

  const startAutoplay = useCallback(() => {
    const startTime = Date.now();
    const animate = () => {
      if (isHovering.current) return;
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % (AUTOPLAY_DURATION * 2)) / AUTOPLAY_DURATION;
      const percent = progress <= 1 ? progress * 100 : (2 - progress) * 100;
      setSliderPos(percent);
      autoplayRef.current = requestAnimationFrame(animate);
    };
    autoplayRef.current = requestAnimationFrame(animate);
  }, []);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      cancelAnimationFrame(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handlePointerEnter = useCallback(() => {
    isHovering.current = true;
    stopAutoplay();
  }, [stopAutoplay]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const handlePointerLeave = useCallback(() => {
    isHovering.current = false;
    startAutoplay();
  }, [startAutoplay]);

  return (
    <div className="max-w-5xl mx-auto mb-16">
      <div
        ref={containerRef}
        className="relative overflow-hidden border border-[var(--border)] rounded-none select-none cursor-col-resize"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* Left panel — Raw Source (pale/dim) */}
        <div className="relative bg-gradient-to-b from-[#1a0a0a] to-[#0a0a0a]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-red-500/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500/40 rounded-full" />
              <span className="text-sm font-mono text-red-400/50">Raw Source</span>
            </div>
            <span className="text-xs text-red-400/40 font-mono">What AI reads today</span>
          </div>

          {/* Bars */}
          <div className="p-6 space-y-5">
            {data.map((comp) => {
              const rawWidth = (comp.rawTokens / maxTokens) * 100;
              return (
                <div key={comp.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-red-300/40 font-medium">{comp.name}</span>
                    <span className="text-xs font-mono text-red-400/30">
                      {comp.rawTokens.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="h-7 bg-black/40 rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${rawWidth}%`,
                        background: "linear-gradient(to right, #0a0a0a, #7f1d1d 40%, #dc2626)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer stats */}
          <div className="px-6 py-4 border-t border-red-500/10 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500/40 rounded-full" />
              <span className="text-xs text-red-400/40 font-mono">
                Avg quality:{" "}
                {Math.round((data.reduce((s, d) => s + d.rawQuality, 0) / data.length) * 100)}%
              </span>
            </div>
            <span className="text-xs text-red-400/30 font-mono">
              Avg{" "}
              {Math.round(data.reduce((s, d) => s + d.rawTokens, 0) / data.length).toLocaleString()}{" "}
              tokens
            </span>
          </div>
        </div>

        {/* Right panel — Descriptor (vibrant) */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0a1a10] to-[#0a0a0a]"
          style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
        >
          {/* Header — mirrored */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20">
            <span className="text-xs text-emerald-400/70 font-mono">What AI needs</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-emerald-400">AI Descriptor</span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
          </div>

          {/* Bars — mirrored (right-to-left) */}
          <div className="p-6 space-y-5">
            {data.map((comp) => {
              const descWidth = Math.max((comp.descTokens / maxTokens) * 100, 3);
              const savings = (comp.rawTokens / comp.descTokens).toFixed(1);
              return (
                <div key={comp.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono text-emerald-400">
                      <span className="mr-2 text-emerald-400/60">({savings}x)</span>
                      {comp.descTokens.toLocaleString()} tokens
                    </span>
                    <span className="text-sm text-emerald-300 font-medium">{comp.name}</span>
                  </div>
                  <div className="h-7 bg-black/40 rounded-sm overflow-hidden flex justify-end">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${descWidth}%`,
                        background: "linear-gradient(to left, #0a0a0a, #064e3b 40%, #10b981)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer stats — mirrored */}
          <div className="px-6 py-4 border-t border-emerald-500/20 flex items-center justify-end gap-6">
            <span className="text-xs text-emerald-400/70 font-mono">
              Avg{" "}
              {Math.round(
                data.reduce((s, d) => s + d.descTokens, 0) / data.length,
              ).toLocaleString()}{" "}
              tokens
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-mono">
                Avg quality:{" "}
                {Math.round((data.reduce((s, d) => s + d.descQuality, 0) / data.length) * 100)}%
              </span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Separator — exactly like Aceternity: gradient line + masked glow + canvas particles */}
        <div
          className="h-full w-px absolute top-0 z-30 bg-gradient-to-b from-transparent from-[5%] via-indigo-500 to-[95%] to-transparent"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Wide indigo glow — masked to only show RIGHT of the line */}
          <div
            className="w-36 h-full absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-indigo-400 via-transparent to-transparent z-20 opacity-50"
            style={{
              maskImage: "radial-gradient(100px at left, white, transparent)",
              WebkitMaskImage: "radial-gradient(100px at left, white, transparent)",
            }}
          />
          {/* Tight cyan glow — stronger, closer to line */}
          <div
            className="w-10 h-1/2 absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-cyan-400 via-transparent to-transparent z-10 opacity-100"
            style={{
              maskImage: "radial-gradient(50px at left, white, transparent)",
              WebkitMaskImage: "radial-gradient(50px at left, white, transparent)",
            }}
          />
          {/* Canvas particles — right side only */}
          <div
            className="w-10 h-3/4 top-1/2 -translate-y-1/2 absolute -right-10"
            style={{
              maskImage: "radial-gradient(100px at left, white, transparent)",
              WebkitMaskImage: "radial-gradient(100px at left, white, transparent)",
            }}
          >
            <SparkleCanvas />
          </div>
          {/* Handle */}
          <div className="h-5 w-5 rounded-md top-1/2 -translate-y-1/2 bg-white z-30 -right-2.5 absolute flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40]">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <title>Drag</title>
              <path d="M3 2v6M7 2v6" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Labels below */}
      <div className="flex justify-between mt-3 px-1">
        <span className="text-xs text-red-400/60 font-mono">Raw Source — bloated, verbose</span>
        <span className="text-xs text-emerald-400/60 font-mono">Descriptor — compact, precise</span>
      </div>
    </div>
  );
}

function SparkleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const PARTICLE_COUNT = 80;

    interface P {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      targetOpacity: number;
      life: number;
      maxLife: number;
    }

    const particles: P[] = [];
    let w = 0;
    let h = 0;
    let animId: number;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 0.4 + Math.random() * 1.2,
      opacity: 0,
      targetOpacity: 0.2 + Math.random() * 0.8,
      life: 0,
      maxLife: 120 + Math.random() * 240,
    });

    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = spawn();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p) continue;

        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Fade in/out based on life
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.1) {
          p.opacity = (lifeRatio / 0.1) * p.targetOpacity;
        } else if (lifeRatio > 0.8) {
          p.opacity = ((1 - lifeRatio) / 0.2) * p.targetOpacity;
        } else {
          p.opacity = p.targetOpacity;
        }

        // Respawn if dead or out of bounds
        if (p.life >= p.maxLife || p.x < -5 || p.x > w + 5 || p.y < -5 || p.y > h + 5) {
          particles[i] = spawn();
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
