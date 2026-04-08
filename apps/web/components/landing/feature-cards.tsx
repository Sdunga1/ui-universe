"use client";

import { BarChart3, Layers, Sparkles } from "lucide-react";
import { useCallback, useRef } from "react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Native Components",
    description:
      "Every component ships with a machine-readable JSON descriptor. AI coding tools generate correct code instantly.",
  },
  {
    icon: Layers,
    title: "Coherent Motion System",
    description:
      "One motion system across all components. Same easings, durations, stagger patterns. Pages feel intentional.",
  },
  {
    icon: BarChart3,
    title: "Eval-Proven Results",
    description:
      "Every claim backed by reproducible multi-model evals. 5.5x fewer tokens, equal or better quality. See the data.",
  },
];

export function FeatureCards() {
  return (
    <section className="py-32 px-6 scroll-reveal">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-azeret font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            Built for modern development
          </h2>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            Everything you need to ship beautiful, animated interfaces faster than ever
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const Icon = feature.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -6;
    const rotateY = (x - 0.5) * 6;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    glow.style.left = `${x * 100}%`;
    glow.style.top = `${y * 100}%`;
    glow.style.opacity = "1";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    const glow = glowRef.current;
    if (el) el.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
    if (glow) glow.style.opacity = "0";
  }, []);

  return (
    <div
      ref={cardRef}
      className="feature-card group relative p-8 rounded-none border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/50 cursor-pointer overflow-hidden"
      style={{
        animationDelay: `${index * 100}ms`,
        transition: "transform 0.3s ease, border-color 0.5s",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mouse-following glow */}
      <div
        ref={glowRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[var(--accent)] rounded-full blur-[80px] pointer-events-none opacity-0 transition-opacity duration-300"
        style={{ opacity: 0 }}
      />

      {/* Shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      <div className="relative z-10">
        <div className="w-14 h-14 rounded-none bg-gradient-to-br from-[var(--accent)]/20 to-transparent border border-[var(--accent)]/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          <Icon className="w-7 h-7 text-[var(--accent)]" />
        </div>

        <h3 className="text-2xl font-azeret font-bold mb-4 group-hover:text-[var(--accent)] transition-colors duration-500">
          {feature.title}
        </h3>

        <p className="text-[var(--muted)] leading-relaxed group-hover:text-neutral-300 transition-colors duration-500">
          {feature.description}
        </p>

        <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[var(--accent)] to-transparent w-0 group-hover:w-full transition-all duration-700" />
      </div>
    </div>
  );
}
