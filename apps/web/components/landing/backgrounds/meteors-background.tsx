"use client";

import { useEffect, useRef, useState } from "react";

interface MeteorsBackgroundProps {
  reducedMotion: boolean;
}

interface Meteor {
  id: number;
  x: number;
  y: number;
  angle: number;
  length: number;
  duration: number;
  dx: number;
  dy: number;
}

const MAX_METEORS = 8;

function spawnMeteor(id: number, viewW: number, viewH: number): Meteor {
  // Random angle between 15 and 75 degrees
  const angleDeg = 15 + Math.random() * 60;
  const angleRad = (angleDeg * Math.PI) / 180;

  // Random travel distance
  const travel = 400 + Math.random() * 600;
  const dx = Math.cos(angleRad) * travel;
  const dy = Math.sin(angleRad) * travel;

  // Start from a random edge (top or left)
  let x: number;
  let y: number;
  if (Math.random() > 0.5) {
    // Start from top edge
    x = Math.random() * viewW;
    y = -20;
  } else {
    // Start from left edge
    x = -20;
    y = Math.random() * viewH * 0.6;
  }

  return {
    id,
    x,
    y,
    angle: angleDeg,
    length: 80 + Math.random() * 120,
    duration: 0.6 + Math.random() * 0.9,
    dx,
    dy,
  };
}

export function MeteorsBackground({ reducedMotion }: MeteorsBackgroundProps) {
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const idCounter = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;

    const spawn = () => {
      setMeteors((prev) => {
        if (prev.length >= MAX_METEORS) return prev;
        idCounter.current += 1;
        const w = window.innerWidth;
        const h = window.innerHeight;
        return [...prev, spawnMeteor(idCounter.current, w, h)];
      });
    };

    // Spawn at random intervals between 2-5 seconds
    let timeout: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      const delay = 1000 + Math.random() * 2000;
      timeout = setTimeout(() => {
        spawn();
        scheduleNext();
      }, delay);
    };

    // First meteor after a short delay
    timeout = setTimeout(() => {
      spawn();
      scheduleNext();
    }, 1500);

    return () => clearTimeout(timeout);
  }, [reducedMotion]);

  const removeMeteor = (id: number) => {
    setMeteors((prev) => prev.filter((m) => m.id !== id));
  };

  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {meteors.map((m) => (
        <div
          key={m.id}
          onAnimationEnd={() => removeMeteor(m.id)}
          className="absolute"
          style={{
            left: m.x,
            top: m.y,
            width: m.length,
            height: 2,
            background: "linear-gradient(to right, transparent, #ee502c)",
            transform: `rotate(${m.angle}deg)`,
            animation: `meteorFly ${m.duration}s linear forwards`,
            "--meteor-dx": `${m.dx}px`,
            "--meteor-dy": `${m.dy}px`,
            opacity: 0.7,
            filter: "blur(0.3px)",
            boxShadow: "0 0 6px rgba(238, 80, 44, 0.4)",
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
