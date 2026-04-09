"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

/* ── Simplified Rocket SVG (from rocket-launch.svg, stripped SVGRepo wrappers) ── */
function RocketSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="80 0 352 420"
      fill="#ee502c"
      className={className}
      aria-hidden="true"
    >
      {/* Left fin */}
      <polygon points="154.219,205.188 166.219,335.031 110.922,405.563 96.406,296.563" />
      {/* Right fin */}
      <polygon points="357.781,205.188 345.766,335.031 401.063,405.563 415.594,296.563" />
      {/* Nose cone */}
      <path d="M323.813,62.219C305.125,23.328,275.656,0,256,0s-49.125,23.344-67.813,62.219H323.813z" />
      {/* Body with portal window */}
      <path d="M331.328,80.469H180.672c-6.641,19.156-10.594,41.094-10.047,65.188 c1.609,69.063,18.047,190.984,18.047,190.984l122.641-0.016l12,0.016c0,0,16.453-121.938,18.031-190.984 C341.922,121.563,337.969,99.609,331.328,80.469z M256,231.031c-23.578,0-42.688-19.094-42.688-42.672s19.125-42.672,42.688-42.672 s42.672,19.094,42.656,42.672C298.672,211.938,279.563,231.031,256,231.031z" />
    </svg>
  );
}

/* ── Logo SVG (matches /public/logo.svg) — rendered at large size for crisp scaling ── */
function LogoSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <g transform="translate(6, 6)" stroke="#ee502c">
        <path
          d="M 4,4 A 12,12 0 0 0 28,4 L 28,16 A 12,12 0 0 1 4,16 Z"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="28" cy="16" r="2.5" fill="#ee502c" />
      </g>
    </svg>
  );
}

/* ── Exhaust particle system ── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
}

const FIRE_COLORS = ["#ee502c", "#ff8c42", "#ffcc33", "#ff6b3d", "#ffa726"];

function startExhaustParticles(
  canvas: HTMLCanvasElement,
  runningRef: { current: boolean }
): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const logicalW = 240;
  const logicalH = 350;
  canvas.width = logicalW * dpr;
  canvas.height = logicalH * dpr;
  canvas.style.width = `${logicalW}px`;
  canvas.style.height = `${logicalH}px`;
  ctx.scale(dpr, dpr);

  const particles: Particle[] = [];
  let frameId = 0;

  function spawn() {
    if (!runningRef.current) return;
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: logicalW / 2 + (Math.random() - 0.5) * 30,
        y: 20,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 4 + 3,
        size: Math.random() * 6 + 3,
        opacity: 0.9,
        life: 0,
        maxLife: Math.random() * 30 + 20,
        color: FIRE_COLORS[Math.floor(Math.random() * FIRE_COLORS.length)],
      });
    }
  }

  function loop() {
    ctx.clearRect(0, 0, logicalW, logicalH);
    ctx.globalCompositeOperation = "lighter";

    spawn();

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.opacity = Math.max(0, 0.9 * (1 - p.life / p.maxLife));
      p.size *= 0.98;

      if (p.life >= p.maxLife || p.opacity <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    if (runningRef.current || particles.length > 0) {
      frameId = requestAnimationFrame(loop);
    }
  }

  frameId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(frameId);
}

/* ── Main Component ── */
const SESSION_KEY = "uiu-intro-seen";

export function RocketLaunchIntro() {
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rocketGroupRef = useRef<HTMLDivElement>(null);
  const rocketOnlyRef = useRef<HTMLDivElement>(null);
  const logoOnRocketRef = useRef<HTMLDivElement>(null);
  const logoFinalRef = useRef<HTMLDivElement>(null);
  const exhaustRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const exhaustRunning = useRef(true);

  useEffect(() => {
    // Skip if already seen this session
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      setDone(true);
      return;
    }

    // Respect reduced motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setDone(true);
      return;
    }

    const container = containerRef.current;
    const rocketGroup = rocketGroupRef.current;
    const rocketOnly = rocketOnlyRef.current;
    const logoOnRocket = logoOnRocketRef.current;
    const logoFinal = logoFinalRef.current;
    const exhaust = exhaustRef.current;
    const glow = glowRef.current;

    if (
      !container ||
      !rocketGroup ||
      !rocketOnly ||
      !logoOnRocket ||
      !logoFinal ||
      !exhaust ||
      !glow
    )
      return;

    // Start exhaust particles
    exhaustRunning.current = true;
    const stopParticles = startExhaustParticles(exhaust, exhaustRunning);

    // Viewport height for positioning
    const vh = window.innerHeight;

    // Initial state — only set dynamic values (vh-dependent) via GSAP
    // Static initial states are set via inline styles in the JSX to avoid first-frame flash
    gsap.set(rocketGroup, { y: vh * 0.35 });
    gsap.set(logoFinal, { scale: 0.35, rotationX: 180 });

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setDone(true);
      },
    });

    // Phase 1 — Ignition (0 → 0.6s)
    tl.to(glow, { opacity: 0.8, scale: 1.3, duration: 0.6, ease: "power2.out" }, 0)
      .to(exhaust, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0)
      .to(
        rocketGroup,
        {
          x: "+=3",
          duration: 0.05,
          yoyo: true,
          repeat: 11,
          ease: "none",
        },
        0
      )

      // Phase 2 — Launch (0.5 → 2.0s)
      .to(
        rocketGroup,
        {
          y: -vh * 0.05,
          duration: 1.5,
          ease: "power3.inOut",
        },
        0.5
      )

      // Phase 3 — Detachment (2.0 → 2.5s)
      .to(logoOnRocket, { opacity: 0, duration: 0.2, ease: "power1.out" }, 2.0)
      .to(logoFinal, { opacity: 1, duration: 0.25, ease: "power1.in" }, 2.0)
      .to(
        rocketOnly,
        {
          y: -vh * 0.8,
          duration: 0.6,
          ease: "power2.in",
        },
        2.0
      )
      .to(
        glow,
        { opacity: 0, duration: 0.4, ease: "power1.out" },
        2.0
      )
      .to(
        exhaust,
        { opacity: 0, duration: 0.4, ease: "power1.out" },
        2.0
      )
      .add(() => {
        exhaustRunning.current = false;
      }, 2.2)

      // Phase 4 — Logo Flip & Scale (2.3 → 3.3s)
      .to(
        logoFinal,
        {
          rotationX: 0,
          duration: 0.7,
          ease: "back.out(1.4)",
        },
        2.3
      )
      .to(
        logoFinal,
        {
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
        },
        2.3
      )

      // Phase 5 — Fade out and reveal (3.3 → 3.8s)
      .to(
        logoFinal,
        { opacity: 0, duration: 0.5, ease: "power2.inOut" },
        3.3
      )
      .to(
        container,
        { opacity: 0, duration: 0.5, ease: "power2.inOut" },
        3.3
      );

    return () => {
      tl.kill();
      stopParticles();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center"
      style={{ height: "100dvh" }}
    >
      {/* ── Rocket group (rocket + attached logo) — moves together during launch ── */}
      <div
        ref={rocketGroupRef}
        className="absolute flex flex-col items-center"
        style={{ willChange: "transform" }}
      >
        {/* Rocket only — continues upward after detachment */}
        <div ref={rocketOnlyRef} style={{ willChange: "transform" }}>
          <RocketSVG className="w-20 h-auto md:w-24" />
        </div>

        {/* Logo attached to rocket base (inverted) */}
        <div
          ref={logoOnRocketRef}
          className="mt-3"
          style={{
            transform: "scaleY(-1)",
            transformOrigin: "center center",
            willChange: "transform, opacity",
          }}
        >
          <LogoSVG className="w-8 h-8 md:w-10 md:h-10" />
        </div>

        {/* Glow effect beneath rocket */}
        <div
          ref={glowRef}
          className="absolute left-1/2 -translate-x-1/2 w-40 h-40 rounded-full"
          style={{
            top: "100%",
            marginTop: "-2rem",
            opacity: 0,
            transform: "scale(0.5)",
            background:
              "radial-gradient(circle, rgba(238,80,44,0.6) 0%, rgba(255,140,66,0.3) 40%, transparent 70%)",
            filter: "blur(12px)",
            willChange: "transform, opacity",
          }}
        />

        {/* Exhaust particle canvas */}
        <canvas
          ref={exhaustRef}
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ top: "100%", marginTop: "-1rem", opacity: 0, willChange: "opacity" }}
        />
      </div>

      {/* ── Final logo (centered, handles flip & scale after detachment) ── */}
      <div style={{ perspective: 1200 }}>
        <div
          ref={logoFinalRef}
          className="flex items-center justify-center"
          style={{ opacity: 0, willChange: "transform, opacity" }}
        >
          <LogoSVG
            className="w-48 h-48 md:w-60 md:h-60"
            style={{ shapeRendering: "geometricPrecision" }}
          />
        </div>
      </div>
    </div>
  );
}
