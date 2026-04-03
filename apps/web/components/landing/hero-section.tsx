"use client";

import { UIUniverseWordmark } from "../ui-universe-wordmark";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[var(--accent)] opacity-10 blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center gap-20 py-24">
        {/* ── Left 40% ── */}
        <div className="w-full md:w-[40%] flex-shrink-0 flex flex-col items-center text-center">
          <UIUniverseWordmark className="text-5xl mb-5 animate-fade-in justify-center" />

          <p className="text-base text-[var(--muted)] leading-relaxed mb-8 max-w-[280px] animate-fade-in-delay-1">
            AI-native motion UI components for React &amp; Next.js. Ship premium landing pages in
            minutes.
          </p>

          <div className="flex gap-3 animate-fade-in-delay-2">
            <a
              href="/animations/fade-up"
              className="px-6 py-3 bg-[var(--accent)] text-white rounded-none font-medium hover:bg-[var(--accent-hover)] transition-colors duration-200 text-sm"
            >
              Browse Components
            </a>
            <a
              href="https://github.com/Sdunga1/ui-universe"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-neutral-700 text-white rounded-none font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200 text-sm"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* ── Right 60% ── */}
        <div className="w-full md:w-[60%] flex flex-col justify-center animate-fade-in-delay-2">
          <h2 className="text-6xl md:text-7xl font-azeret font-bold leading-[1.15] mb-8 text-white">
            Ship stunning <span className="text-[var(--accent)]">AI-Native</span> Components
          </h2>

          <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed max-w-3xl">
            The motion component library built for the AI era. Every component ships with
            machine-readable descriptors — your AI assistant already knows how to use them.
          </p>
        </div>
      </div>
    </section>
  );
}
