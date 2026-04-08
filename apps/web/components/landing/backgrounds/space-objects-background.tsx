"use client";

import { useEffect, useRef, useState } from "react";

const SOURCES: [string, ...string[]] = ["/bg/astronaut.svg", "/bg/rover.svg", "/bg/saturn.svg"];
const MAX_VISIBLE = 6;

interface FloatingObject {
  id: number;
  src: string;
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  duration: number;
}

interface Props {
  reducedMotion: boolean;
}

function createObject(id: number): FloatingObject {
  const angle = Math.random() * Math.PI * 2;
  const dist = 80 + Math.random() * 150;
  const duration = 3 + Math.random() * 2; // 3-5 seconds
  return {
    id,
    src: SOURCES[Math.floor(Math.random() * SOURCES.length)] ?? SOURCES[0],
    x: 5 + Math.random() * 90,
    y: 5 + Math.random() * 90,
    size: 30 + Math.random() * 90,
    dx: Math.cos(angle) * dist,
    dy: Math.sin(angle) * dist,
    duration,
  };
}

export function SpaceObjectsBackground({ reducedMotion }: Props) {
  const [objects, setObjects] = useState<FloatingObject[]>([]);
  const idRef = useRef(0);
  const countRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const spawn = () => {
      if (countRef.current >= MAX_VISIBLE) return;
      idRef.current += 1;
      countRef.current += 1;
      const obj = createObject(idRef.current);

      setObjects((prev) => [...prev, obj]);

      // Auto-remove after its duration ends
      const t = setTimeout(() => {
        countRef.current -= 1;
        setObjects((prev) => prev.filter((o) => o.id !== obj.id));
      }, obj.duration * 1000);
      timeouts.push(t);
    };

    // Spawn objects at random intervals (1.5-3s apart)
    const scheduleNext = () => {
      const delay = 800 + Math.random() * 1200;
      const t = setTimeout(() => {
        spawn();
        scheduleNext();
      }, delay);
      timeouts.push(t);
    };

    // Kick off with one immediately
    spawn();
    scheduleNext();

    return () => timeouts.forEach(clearTimeout);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {objects.map((obj) => (
        <DriftingObject key={obj.id} obj={obj} />
      ))}
    </div>
  );
}

function DriftingObject({ obj }: { obj: FloatingObject }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transform = `translate(${obj.dx}px, ${obj.dy}px)`;
      });
    });
  }, [obj.dx, obj.dy]);

  return (
    <img
      ref={ref}
      src={obj.src}
      alt=""
      style={{
        position: "absolute",
        left: `${obj.x}%`,
        top: `${obj.y}%`,
        width: obj.size,
        height: obj.size,
        transform: "translate(0, 0)",
        transition: `transform ${obj.duration}s linear`,
        filter: "invert(1) sepia(0.3) saturate(0.5) brightness(0.5)",
        animation: `spaceObjectFade ${obj.duration}s ease-in-out forwards`,
      }}
    />
  );
}
