"use client";

import { useEffect, useRef } from "react";

interface ParticlesBackgroundProps {
  reducedMotion: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulse: number;
}

const PARTICLE_COUNT_DESKTOP = 55;
const PARTICLE_COUNT_MOBILE = 30;
const CONNECTION_DISTANCE = 120;
const MAX_DPR = 2;

function createParticles(count: number, w: number, h: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.5 + 0.8,
    opacity: Math.random() * 0.12 + 0.06,
    pulse: Math.random() * Math.PI * 2,
  }));
}

export function ParticlesBackground({ reducedMotion }: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let animId: number;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = w < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
      particles = createParticles(count, w, h);
    };

    resize();

    if (reducedMotion) {
      // Static render: draw particles once, no animation
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx.fillStyle = `rgba(238, 80, 44, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            const lineOpacity = 0.06 * (1 - dist / CONNECTION_DISTANCE);
            ctx.strokeStyle = `rgba(238, 80, 44, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.015;

        // Wrap around edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.fillStyle = `rgba(238, 80, 44, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

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
