"use client";

import { FlaskConical, Layers, Sparkles } from "lucide-react";
import { useState } from "react";

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
    icon: FlaskConical,
    title: "Lab Mode",
    description:
      "Configure, preview, and export production-ready code from a visual playground. No guesswork.",
  },
];

export function FeatureCards() {
  const [, setHoveredCard] = useState<number | null>(null);

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
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="feature-card group relative p-8 rounded-none border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/50 cursor-pointer overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-[var(--accent)] opacity-10 blur-[80px] animate-pulse-slow" />
                </div>

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

                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
