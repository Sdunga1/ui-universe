"use client";

import { ArrowRight, BarChart3, Sparkles, Zap } from "lucide-react";
import { useCallback, useRef } from "react";
import evalStats from "../../lib/eval-compare-stats.json";
import { CompareSlider, type ComponentComparison } from "./compare-slider";

type ComponentStats = {
  inputTokens: number;
  outputTokens: number;
  overall: number;
  propCorrectness: number;
  iterations: number;
};

type ModelData = Record<string, { "raw-source": ComponentStats; descriptor: ComponentStats }>;

function computeStats() {
  const models = Object.keys(evalStats) as (keyof typeof evalStats)[];
  let totalRawTokens = 0;
  let totalDescTokens = 0;
  let totalRawQuality = 0;
  let totalDescQuality = 0;
  let count = 0;

  const componentNames = Object.keys(evalStats[models[0] as keyof typeof evalStats] as ModelData);

  for (const comp of componentNames) {
    for (const model of models) {
      const modelData = evalStats[model] as ModelData;
      const compData = modelData[comp];
      if (!compData) continue;

      totalRawTokens += compData["raw-source"].inputTokens;
      totalDescTokens += compData.descriptor.inputTokens;
      totalRawQuality += compData["raw-source"].overall;
      totalDescQuality += compData.descriptor.overall;
      count++;
    }
  }

  const perComponent: ComponentComparison[] = [];
  for (const comp of componentNames) {
    let rawTok = 0;
    let descTok = 0;
    let rawQ = 0;
    let descQ = 0;
    for (const model of models) {
      const modelData = evalStats[model] as ModelData;
      const compData = modelData[comp];
      if (!compData) continue;
      rawTok += compData["raw-source"].inputTokens;
      descTok += compData.descriptor.inputTokens;
      rawQ += compData["raw-source"].overall;
      descQ += compData.descriptor.overall;
    }
    perComponent.push({
      name: comp.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      rawTokens: Math.round(rawTok / models.length),
      descTokens: Math.round(descTok / models.length),
      rawQuality: rawQ / models.length,
      descQuality: descQ / models.length,
    });
  }

  return {
    tokenRatio: totalRawTokens / totalDescTokens,
    avgRawQuality: totalRawQuality / count,
    avgDescQuality: totalDescQuality / count,
    qualityGainPp: Math.round(((totalDescQuality - totalRawQuality) / count) * 100),
    modelCount: models.length,
    componentCount: componentNames.length,
    perComponent,
  };
}

const stats = computeStats();
const aiTools = ["Claude Sonnet", "GitHub Copilot", "Cursor", "Windsurf", "ChatGPT"];

export function EvalProof() {
  return (
    <section className="py-32 px-6 scroll-reveal relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent)] opacity-5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-none mb-6">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm text-[var(--accent)] font-medium">Measured, not marketed</span>
          </div>
          <h2 className="text-5xl font-azeret font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            AI descriptors, proven by data
          </h2>
          <p className="text-xl text-[var(--muted)] max-w-3xl mx-auto">
            We tested every component with real AI models. Descriptors consistently outperform raw
            source code -- fewer tokens, better results.
          </p>
        </div>

        {/* Stats bar with gradient fills */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <StatCard
            icon={<Zap className="w-6 h-6 text-[var(--accent)]" />}
            value={`${stats.tokenRatio.toFixed(1)}x`}
            label="Fewer input tokens with descriptors"
            fillPercent={85}
            gradient="from-orange-900/0 to-orange-800/10"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6 text-[var(--accent)]" />}
            value={`${stats.avgDescQuality >= stats.avgRawQuality ? "+" : ""}${stats.qualityGainPp}pp`}
            label="Average quality improvement"
            fillPercent={65}
            gradient="from-emerald-900/0 to-emerald-800/10"
          />
          <StatCard
            icon={<Sparkles className="w-6 h-6 text-[var(--accent)]" />}
            value={`${stats.modelCount} models`}
            label={`${stats.componentCount} components tested across providers`}
            fillPercent={75}
            gradient="from-blue-900/0 to-blue-800/10"
          />
        </div>

        {/* Compare slider */}
        <CompareSlider data={stats.perComponent} />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="/evals"
            className="group px-8 py-4 bg-[var(--accent)] text-white rounded-none font-medium hover:bg-[var(--accent-hover)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(238,80,44,0.4)] flex items-center justify-center gap-2"
          >
            See Full Eval Results
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/evals/compare"
            className="px-8 py-4 border border-neutral-800 text-white rounded-none font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            View Live Comparisons
          </a>
        </div>

        {/* Supported AI tools */}
        <div className="text-center">
          <p className="text-sm text-[var(--muted)] mb-4">Works perfectly with</p>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {aiTools.map((tool) => (
              <div
                key={tool}
                className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-none text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-white transition-all"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
  fillPercent,
  gradient,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  fillPercent: number;
  gradient: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -8;
    const rotateY = (x - 0.5) * 8;
    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    glow.style.left = `${x * 100}%`;
    glow.style.top = `${y * 100}%`;
    glow.style.opacity = "1";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    const glow = glowRef.current;
    if (el) el.style.transform = "perspective(600px) rotateX(0) rotateY(0) scale(1)";
    if (glow) glow.style.opacity = "0";
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative p-6 bg-[var(--card)] border border-[var(--border)] rounded-none text-center hover:border-[var(--accent)]/50 overflow-hidden"
      style={{ transition: "transform 0.3s ease, border-color 0.5s" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient fill from bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${gradient} transition-all duration-1000 group-hover:opacity-100 opacity-70`}
        style={{ height: `${fillPercent}%` }}
      />
      {/* Mouse-following glow */}
      <div
        ref={glowRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[var(--accent)] rounded-full blur-[80px] pointer-events-none opacity-0 transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
      <div className="relative z-10">
        <div className="mx-auto mb-3">{icon}</div>
        <div className="text-5xl font-azeret font-bold text-[var(--accent)] mb-2">{value}</div>
        <div className="text-sm text-[var(--muted)]">{label}</div>
      </div>
    </div>
  );
}
