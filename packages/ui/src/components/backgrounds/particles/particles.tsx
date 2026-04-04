"use client";

import { forwardRef, useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { cn } from "../../../lib/utils";

export interface ParticlesProps {
  /** Number of particles. */
  count?: number;
  /** Particle color (any CSS color value). */
  color?: string;
  /** Speed multiplier. */
  speed?: number;
  /** Particle radius in pixels. */
  size?: number;
  /** Draw lines between nearby particles. */
  connected?: boolean;
  /** Maximum distance for connected lines in pixels. */
  maxDistance?: number;
  /** Additional Tailwind classes. */
  className?: string;
  /** HTML id attribute. */
  id?: string;
  /** Custom data attributes or aria attributes. */
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const Particles = forwardRef<HTMLDivElement, ParticlesProps>(
  (
    {
      count = 50,
      color = "#ffffff",
      speed = 1,
      size = 2,
      connected = false,
      maxDistance = 100,
      className,
      id,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number>(0);
    const reducedMotion = useReducedMotion();

    const initParticles = useCallback(
      (width: number, height: number) => {
        const particles: Particle[] = [];
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5 * speed,
            vy: (Math.random() - 0.5) * 0.5 * speed,
          });
        }
        particlesRef.current = particles;
      },
      [count, speed],
    );

    const draw = useCallback(
      (ctx: CanvasRenderingContext2D, width: number, height: number, isStatic: boolean) => {
        ctx.clearRect(0, 0, width, height);

        const particles = particlesRef.current;

        if (!isStatic) {
          for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
          }
        }

        // Draw connections
        if (connected) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.5;
          for (let i = 0; i < particles.length; i++) {
            const pi = particles[i];
            if (!pi) continue;
            for (let j = i + 1; j < particles.length; j++) {
              const pj = particles[j];
              if (!pj) continue;
              const dx = pi.x - pj.x;
              const dy = pi.y - pj.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < maxDistance) {
                ctx.globalAlpha = 1 - dist / maxDistance;
                ctx.beginPath();
                ctx.moveTo(pi.x, pi.y);
                ctx.lineTo(pj.x, pj.y);
                ctx.stroke();
              }
            }
          }
        }

        // Draw particles
        ctx.fillStyle = color;
        ctx.globalAlpha = 1;
        for (const p of particles) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      },
      [color, size, connected, maxDistance],
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const container = ref.current;
      if (!container) return;

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          const dpr = window.devicePixelRatio || 1;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          ctx.scale(dpr, dpr);
          initParticles(width, height);
          // If static, draw once after resize
          if (reducedMotion) {
            draw(ctx, width, height, true);
          }
        }
      });

      resizeObserver.observe(container);

      if (!reducedMotion) {
        const animate = () => {
          const w = canvas.width / (window.devicePixelRatio || 1);
          const h = canvas.height / (window.devicePixelRatio || 1);
          draw(ctx, w, h, false);
          animFrameRef.current = requestAnimationFrame(animate);
        };
        animFrameRef.current = requestAnimationFrame(animate);
      }

      return () => {
        cancelAnimationFrame(animFrameRef.current);
        resizeObserver.disconnect();
      };
    }, [ref, initParticles, draw, reducedMotion]);

    return (
      <div
        ref={ref}
        id={id}
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
        data-component="particles"
        {...rest}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
    );
  },
);

Particles.displayName = "Particles";
