"use client";

interface Props {
  reducedMotion: boolean;
}

const HORIZONTAL_LINES = [
  { top: 15, duration: 22, delay: 0 },
  { top: 35, duration: 26, delay: 4 },
  { top: 55, duration: 20, delay: 8 },
  { top: 75, duration: 24, delay: 3 },
  { top: 90, duration: 28, delay: 6 },
];

const VERTICAL_LINES = [
  { left: 25, duration: 20, delay: 0 },
  { left: 50, duration: 24, delay: 5 },
  { left: 75, duration: 18, delay: 10 },
];

export function SweepLinesBackground({ reducedMotion }: Props) {
  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {HORIZONTAL_LINES.map((line) => (
        <div
          key={`h-${line.top}`}
          className="absolute left-0 right-0"
          style={{ top: `${line.top}%`, height: 1, overflow: "hidden" }}
        >
          <div
            style={{
              width: 300,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(238,80,44,0.15), transparent)",
              animation: `sweepRight ${line.duration}s linear ${line.delay}s infinite`,
            }}
          />
        </div>
      ))}

      {VERTICAL_LINES.map((line) => (
        <div
          key={`v-${line.left}`}
          className="absolute top-0 bottom-0"
          style={{ left: `${line.left}%`, width: 1, overflow: "hidden" }}
        >
          <div
            style={{
              width: 1,
              height: 300,
              background: "linear-gradient(transparent, rgba(238,80,44,0.15), transparent)",
              animation: `sweepDown ${line.duration}s linear ${line.delay}s infinite`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
