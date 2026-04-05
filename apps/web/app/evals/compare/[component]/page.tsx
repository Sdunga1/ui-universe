"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React, { Suspense, useState, useEffect, useCallback } from "react";
import { getComponent } from "../../../../lib/eval-compare-components";
import type { EvalSession } from "../../../api/evals/sessions/route";

const availableModels = ["claude", "gemini"];

const modelLabels: Record<string, string> = {
  claude: "Claude Sonnet",
  gemini: "Gemini Flash",
};

type ComponentStats = Record<
  string,
  Record<
    string,
    {
      inputTokens: number;
      outputTokens: number;
      overall: number;
      propCorrectness: number;
      iterations: number;
    }
  >
>;

class ErrorBoundaryWrapper extends React.Component<
  { children: React.ReactNode; label: string },
  { error: string | null }
> {
  constructor(props: { children: React.ReactNode; label: string }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex items-center justify-center h-full bg-red-950/20 p-6">
          <p className="text-red-400 font-mono text-sm">Render Error: {this.state.error}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function ClientGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  if (!ok) return null;
  return <>{children}</>;
}

const claudeModules: Record<string, { raw: React.ComponentType; descriptor: React.ComponentType }> =
  {
    counter: {
      raw: dynamic(() => import("../../../../components/eval-usage/claude/counter-raw-source"), {
        ssr: false,
      }),
      descriptor: dynamic(
        () => import("../../../../components/eval-usage/claude/counter-descriptor"),
        { ssr: false },
      ),
    },
    "circular-gallery": {
      raw: dynamic(
        () => import("../../../../components/eval-usage/claude/circular-gallery-raw-source"),
        { ssr: false },
      ),
      descriptor: dynamic(
        () => import("../../../../components/eval-usage/claude/circular-gallery-descriptor"),
        { ssr: false },
      ),
    },
    "infinite-menu": {
      raw: dynamic(
        () => import("../../../../components/eval-usage/claude/infinite-menu-raw-source"),
        { ssr: false },
      ),
      descriptor: dynamic(
        () => import("../../../../components/eval-usage/claude/infinite-menu-descriptor"),
        { ssr: false },
      ),
    },
    "soft-aurora": {
      raw: dynamic(
        () => import("../../../../components/eval-usage/claude/soft-aurora-raw-source"),
        { ssr: false },
      ),
      descriptor: dynamic(
        () => import("../../../../components/eval-usage/claude/soft-aurora-descriptor"),
        { ssr: false },
      ),
    },
    "flowing-menu": {
      raw: dynamic(
        () => import("../../../../components/eval-usage/claude/flowing-menu-raw-source"),
        { ssr: false },
      ),
      descriptor: dynamic(
        () => import("../../../../components/eval-usage/claude/flowing-menu-descriptor"),
        { ssr: false },
      ),
    },
    "shape-grid": {
      raw: dynamic(() => import("../../../../components/eval-usage/claude/shape-grid-raw-source"), {
        ssr: false,
      }),
      descriptor: dynamic(
        () => import("../../../../components/eval-usage/claude/shape-grid-descriptor"),
        { ssr: false },
      ),
    },
  };

const noData = dynamic(
  () =>
    Promise.resolve({
      default: () => (
        <div className="flex items-center justify-center h-full text-[var(--muted)] text-sm">
          No data for this component
        </div>
      ),
    }),
  { ssr: false },
);

const geminiModules: Record<string, { raw: React.ComponentType; descriptor: React.ComponentType }> =
  {
    counter: {
      raw: dynamic(() => import("../../../../components/eval-usage/gemini/counter-raw-source"), {
        ssr: false,
      }),
      descriptor: dynamic(
        () => import("../../../../components/eval-usage/gemini/counter-descriptor"),
        { ssr: false },
      ),
    },
    "circular-gallery": {
      raw: dynamic(
        () => import("../../../../components/eval-usage/gemini/circular-gallery-raw-source"),
        { ssr: false },
      ),
      descriptor: dynamic(
        () => import("../../../../components/eval-usage/gemini/circular-gallery-descriptor"),
        { ssr: false },
      ),
    },
    "infinite-menu": {
      raw: dynamic(
        () => import("../../../../components/eval-usage/gemini/infinite-menu-raw-source"),
        { ssr: false },
      ),
      descriptor: dynamic(
        () => import("../../../../components/eval-usage/gemini/infinite-menu-descriptor"),
        { ssr: false },
      ),
    },
    "soft-aurora": {
      raw: dynamic(
        () => import("../../../../components/eval-usage/gemini/soft-aurora-raw-source"),
        { ssr: false },
      ),
      descriptor: dynamic(
        () => import("../../../../components/eval-usage/gemini/soft-aurora-descriptor"),
        { ssr: false },
      ),
    },
    "flowing-menu": {
      raw: dynamic(
        () =>
          import("../../../../components/eval-usage/gemini/flowing-menu-raw-source").catch(() => ({
            default: noData,
          })),
        { ssr: false },
      ),
      descriptor: dynamic(
        () =>
          import("../../../../components/eval-usage/gemini/flowing-menu-descriptor").catch(() => ({
            default: noData,
          })),
        { ssr: false },
      ),
    },
    "shape-grid": {
      raw: dynamic(() => import("../../../../components/eval-usage/gemini/shape-grid-raw-source"), {
        ssr: false,
      }),
      descriptor: dynamic(
        () => import("../../../../components/eval-usage/gemini/shape-grid-descriptor"),
        { ssr: false },
      ),
    },
  };

const modelModules: Record<
  string,
  Record<string, { raw: React.ComponentType; descriptor: React.ComponentType }>
> = {
  claude: claudeModules,
  gemini: geminiModules,
};

function LoadingPanel() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-[var(--muted)] text-sm animate-pulse">Loading...</div>
    </div>
  );
}

function TokenStats({ slug, stats }: { slug: string; stats: ComponentStats | null }) {
  if (!stats)
    return (
      <div className="border border-[var(--border)] bg-[var(--card)] p-5 text-[var(--muted)] text-sm animate-pulse">
        Loading stats...
      </div>
    );

  const s = stats[slug];
  if (!s) return null;

  const raw = s["raw-source"];
  const desc = s.descriptor;
  if (!raw || !desc) return null;

  const savings = (raw.inputTokens / desc.inputTokens).toFixed(1);
  const qualityMatch = Math.abs(raw.overall - desc.overall) < 0.05;

  return (
    <div className="border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold">Token Efficiency</h3>
        <span className="text-xs px-2 py-0.5 bg-[var(--accent)]/20 text-[var(--accent)] font-bold">
          {savings}x fewer tokens
        </span>
        {qualityMatch && (
          <span className="text-xs px-2 py-0.5 bg-emerald-900/30 text-emerald-400">
            Same quality
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#111] p-4">
          <p className="text-[9px] uppercase tracking-[0.15em] text-[var(--muted)] mb-2">
            Raw Source (full code)
          </p>
          <p className="text-2xl font-bold tabular-nums">
            {raw.inputTokens.toLocaleString()}
            <span className="text-sm text-[var(--muted)] ml-1">tokens in</span>
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[var(--muted)]">
              Score: {(raw.overall * 100).toFixed(0)}%
            </span>
            {raw.iterations > 1 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-amber-900/30 text-amber-400">
                {raw.iterations} iters
              </span>
            )}
          </div>
        </div>
        <div className="bg-[#111] p-4 border border-[var(--accent)]/30">
          <p className="text-[9px] uppercase tracking-[0.15em] text-[var(--accent)] mb-2">
            Descriptor (JSON only)
          </p>
          <p className="text-2xl font-bold tabular-nums">
            {desc.inputTokens.toLocaleString()}
            <span className="text-sm text-[var(--muted)] ml-1">tokens in</span>
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[var(--muted)]">
              Score: {(desc.overall * 100).toFixed(0)}%
            </span>
            {desc.iterations > 1 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-amber-900/30 text-amber-400">
                {desc.iterations} iters
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComponentComparePage() {
  const params = useParams();
  const slug = params.component as string;
  const comp = getComponent(slug);

  const [model, setModel] = useState<string>(availableModels[0]);
  const [sessions, setSessions] = useState<EvalSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [stats, setStats] = useState<ComponentStats | null>(null);

  // Load sessions from Supabase on mount
  useEffect(() => {
    fetch("/api/evals/sessions")
      .then((r) => r.json())
      .then(({ sessions: s }: { sessions: EvalSession[] }) => {
        if (s?.length) {
          setSessions(s);
          setActiveSessionId(s[0].id); // latest session
        }
      })
      .catch(() => {});
  }, []);

  // Load stats from Supabase when session or model changes
  const loadStats = useCallback(
    async (sessionId: string, modelSlug: string) => {
      setStats(null);
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) return;

      const runId = session.runIds[modelSlug];
      if (!runId) {
        setStats({});
        return;
      }

      const res = await fetch(`/api/evals/usage-stats?runId=${runId}`);
      const { stats: s } = await res.json();
      setStats(s ?? {});
    },
    [sessions],
  );

  useEffect(() => {
    if (activeSessionId && sessions.length > 0) {
      loadStats(activeSessionId, model);
    }
  }, [activeSessionId, model, loadStats, sessions]);

  if (!comp) {
    return (
      <div className="p-8">
        <p className="text-red-400">Component not found: {slug}</p>
      </div>
    );
  }

  const modules = modelModules[model]?.[slug];
  const RawComponent = modules?.raw;
  const DescComponent = modules?.descriptor;

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[9px] uppercase tracking-[0.15em] text-[var(--muted)]">
              {comp.category}
            </span>
            <h1 className="text-2xl font-bold">{comp.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Session selector */}
            {sessions.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.15em] text-[var(--muted)]">
                  Run
                </span>
                <select
                  value={activeSessionId}
                  onChange={(e) => setActiveSessionId(e.target.value)}
                  className="bg-[#111] border border-[var(--border)] px-2 py-1.5 text-xs text-[var(--foreground)] appearance-none pr-6"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 6px center",
                  }}
                >
                  {sessions.map((s, i) => (
                    <option key={s.id} value={s.id}>
                      {new Date(s.date).toLocaleDateString()}{" "}
                      {new Date(s.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      ({s.models.join(" + ")}){i === 0 ? " — latest" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Model toggle */}
            <div className="flex items-center gap-1 bg-[#111] p-1 border border-[var(--border)]">
              {availableModels
                .filter((m) => !activeSession || activeSession.models.includes(m))
                .map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModel(m)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      model === m
                        ? "bg-[var(--accent)] text-white"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {modelLabels[m] || m}
                  </button>
                ))}
            </div>
          </div>
        </div>
        <TokenStats slug={slug} stats={stats} />
      </div>

      {/* Side-by-side renders */}
      <div className="flex-1 grid grid-cols-2 gap-4 px-6 pb-6 min-h-0">
        <div className="flex flex-col border border-[var(--border)] bg-[var(--card)] overflow-hidden min-h-0">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] shrink-0">
            <span className="text-[9px] uppercase tracking-[0.15em] font-bold px-2 py-0.5 bg-emerald-900/50 text-emerald-300">
              Raw Source
            </span>
            <span className="text-[11px] text-[var(--muted)]">AI read full source code</span>
          </div>
          <div className="flex-1 overflow-y-auto relative sidebar-scroll">
            <ClientGate>
              <ErrorBoundaryWrapper label="Raw Source">
                <Suspense fallback={<LoadingPanel />}>
                  {RawComponent ? <RawComponent /> : <LoadingPanel />}
                </Suspense>
              </ErrorBoundaryWrapper>
            </ClientGate>
          </div>
        </div>

        <div className="flex flex-col border border-[var(--border)] bg-[var(--card)] overflow-hidden min-h-0">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] shrink-0">
            <span className="text-[9px] uppercase tracking-[0.15em] font-bold px-2 py-0.5 bg-[var(--accent)]/20 text-[var(--accent)]">
              Descriptor
            </span>
            <span className="text-[11px] text-[var(--muted)]">AI read only JSON descriptor</span>
          </div>
          <div className="flex-1 overflow-y-auto relative sidebar-scroll">
            <ClientGate>
              <ErrorBoundaryWrapper label="Descriptor">
                <Suspense fallback={<LoadingPanel />}>
                  {DescComponent ? <DescComponent /> : <LoadingPanel />}
                </Suspense>
              </ErrorBoundaryWrapper>
            </ClientGate>
          </div>
        </div>
      </div>
    </div>
  );
}
