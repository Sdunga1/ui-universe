"use client";

import { useEffect, useRef, useState } from "react";

const SOURCES = ["/bg/astronaut.svg", "/bg/rover.svg", "/bg/saturn.svg"];
const DURATION = 3; // seconds

interface FloatingObject {
  id: number;
  src: string;
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
}

interface Props {
  reducedMotion: boolean;
}

export function SpaceObjectsBackground({ reducedMotion }: Props) {
  const [objects, setObjects] = useState<FloatingObject[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;

    const spawn = () => {
      idRef.current += 1;

      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 100;

      setObjects((prev) => [
        ...prev.slice(-7),
        {
          id: idRef.current,
          src: SOURCES[Math.floor(Math.random() * SOURCES.length)],
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
          size: 60 + Math.random() * 50,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
        },
      ]);
    };

    // Spawn multiple objects on independent random timers
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const createSpawner = (initialDelay: number) => {
      const scheduleNext = () => {
        const t = setTimeout(() => {
          spawn();
          scheduleNext();
        }, 2000 + Math.random() * 4000);
        timeouts.push(t);
      };
      const t = setTimeout(() => {
        spawn();
        scheduleNext();
      }, initialDelay);
      timeouts.push(t);
    };

    // 3 independent spawners with staggered starts
    createSpawner(500);
    createSpawner(2000);
    createSpawner(4000);

    return () => timeouts.forEach(clearTimeout);
  }, [reducedMotion]);

  const removeObject = (id: number) => {
    setObjects((prev) => prev.filter((o) => o.id !== id));
  };

  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {objects.map((obj) => (
        <DriftingObject key={obj.id} obj={obj} onDone={() => removeObject(obj.id)} />
      ))}
    </div>
  );
}

function DriftingObject({ obj, onDone }: { obj: FloatingObject; onDone: () => void }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Start the drift after a frame so the transition picks it up
    requestAnimationFrame(() => {
      el.style.transform = `translate(${obj.dx}px, ${obj.dy}px)`;
    });
  }, [obj.dx, obj.dy]);

  return (
    <img
      ref={ref}
      src={obj.src}
      alt=""
      onAnimationEnd={onDone}
      style={{
        position: "absolute",
        left: `${obj.x}%`,
        top: `${obj.y}%`,
        width: obj.size,
        height: obj.size,
        transform: "translate(0, 0)",
        transition: `transform ${DURATION}s linear`,
        filter: "invert(1) sepia(0.3) saturate(0.5) brightness(0.5)",
        animation: `spaceObjectFade ${DURATION}s ease-in-out forwards`,
      }}
    />
  );
}
