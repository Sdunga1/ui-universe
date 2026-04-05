import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/site-header";
import { type EvalPageData, loadEvalData } from "../../lib/eval-data";

export const metadata: Metadata = {
  title: "AI Eval Results — uiUniverse",
  description:
    "Multi-model eval proving AI descriptors deliver 6.5x fewer tokens with equal or better code generation quality.",
};

// ── Chart helpers ──

const MODEL_COLORS: Record<string, string> = {
  claude: "#ee502c",
  gemini: "#4285f4",
};

function scoreColor(s: number): string {
  if (s >= 0.9) return "#22c55e";
  if (s >= 0.7) return "#eab308";
  return "#ef4444";
}

function QualityChart({ data }: { data: EvalPageData }) {
  const w = 600;
  const h = 300;
  const pl = 50;
  const pr = 20;
  const pt = 25;
  const pb = 70;
  const plotH = h - pt - pb;
  const groupW = (w - pl - pr) / data.models.length;
  const barW = 45;
  const barGap = 6;

  let svg = "";
  for (let pct = 0; pct <= 100; pct += 25) {
    const y = pt + plotH - (pct / 100) * plotH;
    svg += `<line x1="${pl}" y1="${y}" x2="${w - pr}" y2="${y}" stroke="#1a1a1a"/>`;
    svg += `<text x="${pl - 6}" y="${y + 4}" text-anchor="end" fill="#555" font-size="10">${pct}%</text>`;
  }

  data.models.forEach((m, mi) => {
    const gx = pl + mi * groupW + groupW / 2;
    const vals = [
      { val: m.raw.avgOverall, color: "#ef4444" },
      { val: m.desc.avgOverall, color: "#22c55e" },
    ];
    vals.forEach((v, ci) => {
      const barH = v.val * plotH;
      const x = gx - (vals.length * (barW + barGap)) / 2 + ci * (barW + barGap);
      const y = pt + plotH - barH;
      svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${v.color}" rx="3" opacity="0.85"/>`;
      svg += `<text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">${(v.val * 100).toFixed(0)}%</text>`;
    });
    svg += `<text x="${gx}" y="${pt + plotH + 18}" text-anchor="middle" fill="${MODEL_COLORS[m.slug] ?? "#ccc"}" font-size="11" font-weight="700">${m.modelShort}</text>`;
  });

  svg += `<rect x="${pl}" y="${h - 16}" width="8" height="8" fill="#ef4444" rx="2"/><text x="${pl + 12}" y="${h - 9}" fill="#888" font-size="10">Raw Source</text>`;
  svg += `<rect x="${pl + 100}" y="${h - 16}" width="8" height="8" fill="#22c55e" rx="2"/><text x="${pl + 112}" y="${h - 9}" fill="#888" font-size="10">AI Descriptor</text>`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-auto"
      role="img"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function TokenChart({ data }: { data: EvalPageData }) {
  const w = 600;
  const h = 300;
  const pl = 55;
  const pr = 20;
  const pt = 25;
  const pb = 70;
  const plotH = h - pt - pb;
  const maxTokens = Math.max(
    ...data.models.flatMap((m) => [m.raw.avgInputTokens, m.desc.avgInputTokens]),
  );
  const groupW = (w - pl - pr) / data.models.length;
  const barW = 45;
  const barGap = 6;

  let svg = "";
  for (let i = 0; i <= 4; i++) {
    const y = pt + plotH - (i / 4) * plotH;
    svg += `<line x1="${pl}" y1="${y}" x2="${w - pr}" y2="${y}" stroke="#1a1a1a"/>`;
    svg += `<text x="${pl - 6}" y="${y + 4}" text-anchor="end" fill="#555" font-size="10">${Math.round((maxTokens * i) / 4)}</text>`;
  }

  data.models.forEach((m, mi) => {
    const gx = pl + mi * groupW + groupW / 2;
    const vals = [
      { val: m.raw.avgInputTokens, color: "#ef4444" },
      { val: m.desc.avgInputTokens, color: "#22c55e" },
    ];
    vals.forEach((v, ci) => {
      const barH = (v.val / maxTokens) * plotH;
      const x = gx - (vals.length * (barW + barGap)) / 2 + ci * (barW + barGap);
      const y = pt + plotH - barH;
      svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${v.color}" rx="3" opacity="0.85"/>`;
      svg += `<text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">${Math.round(v.val)}</text>`;
    });
    svg += `<text x="${gx}" y="${pt + plotH + 18}" text-anchor="middle" fill="${MODEL_COLORS[m.slug] ?? "#ccc"}" font-size="11" font-weight="700">${m.modelShort}</text>`;
  });

  svg += `<rect x="${pl}" y="${h - 16}" width="8" height="8" fill="#ef4444" rx="2"/><text x="${pl + 12}" y="${h - 9}" fill="#888" font-size="10">Raw Source</text>`;
  svg += `<rect x="${pl + 100}" y="${h - 16}" width="8" height="8" fill="#22c55e" rx="2"/><text x="${pl + 112}" y="${h - 9}" fill="#888" font-size="10">AI Descriptor</text>`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-auto"
      role="img"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function ComponentChart({ data }: { data: EvalPageData }) {
  const compNames = data.componentNames;
  const w = 700;
  const pl = 130;
  const pr = 20;
  const pt = 15;
  const rowH = 48;
  const pb = 50;
  const plotW = w - pl - pr;
  const h = pt + compNames.length * rowH + pb;
  const barH = 8;
  const barGap = 2;

  let svg = "";
  for (let pct = 0; pct <= 100; pct += 25) {
    const x = pl + (pct / 100) * plotW;
    svg += `<line x1="${x}" y1="${pt}" x2="${x}" y2="${pt + compNames.length * rowH}" stroke="#1a1a1a"/>`;
    svg += `<text x="${x}" y="${pt + compNames.length * rowH + 16}" text-anchor="middle" fill="#555" font-size="10">${pct}%</text>`;
  }

  compNames.forEach((comp, ci) => {
    const gy = pt + ci * rowH;
    svg += `<text x="${pl - 8}" y="${gy + rowH / 2 + 4}" text-anchor="end" fill="#ccc" font-size="10" font-weight="600">${comp}</text>`;

    let barIdx = 0;
    data.models.forEach((m) => {
      const cdata = m.components[comp];
      if (!cdata) return;
      [
        { val: cdata.raw.avgOverall, color: "#ef4444", opacity: "0.7" },
        { val: cdata.desc.avgOverall, color: "#22c55e", opacity: "0.85" },
      ].forEach((v) => {
        const y = gy + 8 + barIdx * (barH + barGap);
        const bw = v.val * plotW;
        svg += `<rect x="${pl}" y="${y}" width="${bw}" height="${barH}" fill="${v.color}" rx="1" opacity="${v.opacity}"/>`;
        svg += `<text x="${pl + bw + 4}" y="${y + barH - 1}" fill="#666" font-size="7">${(v.val * 100).toFixed(0)}%</text>`;
        barIdx++;
      });
    });
  });

  const ly = pt + compNames.length * rowH + 30;
  data.models.forEach((m, mi) => {
    svg += `<rect x="${pl + mi * 200}" y="${ly}" width="8" height="8" fill="${MODEL_COLORS[m.slug] ?? "#888"}" rx="1"/>`;
    svg += `<text x="${pl + mi * 200 + 12}" y="${ly + 7}" fill="#888" font-size="9">${m.modelShort}</text>`;
  });

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-auto"
      role="img"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// ── Page ──

export default async function EvalsPage() {
  const data = await loadEvalData();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-[1200px] px-6 pt-24 pb-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-white">
            AI Eval Results
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[var(--muted)]">
            Does feeding an LLM 500 lines of source code beat a 30-line JSON descriptor? We tested{" "}
            {data.totalComponents} components across {data.models.length} models with{" "}
            {data.totalRuns} eval runs.
          </p>
        </div>

        {/* Key findings */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border border-[var(--border)] bg-[var(--card)] p-6 text-center">
            <div className="text-4xl font-extrabold text-green-400">
              {data.avgTokenRatio.toFixed(1)}x
            </div>
            <div className="mt-1 text-sm text-[var(--muted)]">Fewer tokens with descriptor</div>
          </div>
          <div className="border border-[var(--border)] bg-[var(--card)] p-6 text-center">
            <div className="text-4xl font-extrabold text-yellow-400">
              +{(data.avgQualityGain * 100).toFixed(0)}pp
            </div>
            <div className="mt-1 text-sm text-[var(--muted)]">Average quality improvement</div>
          </div>
          <div className="border border-[var(--border)] bg-[var(--card)] p-6 text-center">
            <div className="text-4xl font-extrabold text-blue-400">{data.models.length}</div>
            <div className="mt-1 text-sm text-[var(--muted)]">Models tested (cross-provider)</div>
          </div>
        </div>

        {/* Live Comparisons */}
        <h2 className="mb-4 mt-10 border-b border-[var(--border)] pb-2 text-lg font-bold text-white">
          Live Comparisons
        </h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          See AI-rendered components side by side — raw source vs descriptor:
        </p>
        <div className="mb-10">
          <Link
            href="/evals/compare"
            className="inline-flex items-center gap-2 border border-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
          >
            View Live Component Comparisons →
          </Link>
        </div>

        {/* Model comparison table */}
        <h2 className="mb-4 mt-10 border-b border-[var(--border)] pb-2 text-lg font-bold text-white">
          Model Comparison
        </h2>
        <div className="mb-10 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wider text-[var(--muted)]">
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Raw Score</th>
                <th className="px-4 py-3">Descriptor Score</th>
                <th className="px-4 py-3">Raw Tokens</th>
                <th className="px-4 py-3">Desc Tokens</th>
                <th className="px-4 py-3">Token Ratio</th>
                <th className="px-4 py-3">TS Validity (Raw/Desc)</th>
              </tr>
            </thead>
            <tbody>
              {data.models.map((m) => (
                <tr key={m.slug} className="border-b border-[var(--border)]">
                  <td
                    className="px-4 py-3 font-bold"
                    style={{ color: MODEL_COLORS[m.slug] ?? "#ccc" }}
                  >
                    {m.modelShort}
                  </td>
                  <td className="px-4 py-3" style={{ color: scoreColor(m.raw.avgOverall) }}>
                    {(m.raw.avgOverall * 100).toFixed(0)}%
                  </td>
                  <td
                    className="px-4 py-3 font-bold"
                    style={{ color: scoreColor(m.desc.avgOverall) }}
                  >
                    {(m.desc.avgOverall * 100).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {Math.round(m.raw.avgInputTokens)}
                  </td>
                  <td className="px-4 py-3 font-bold text-green-400">
                    {Math.round(m.desc.avgInputTokens)}
                  </td>
                  <td className="px-4 py-3 font-bold text-green-400">{m.tokenRatio.toFixed(1)}x</td>
                  <td className="px-4 py-3">
                    <span className="text-[var(--muted)]">{(m.raw.tsRate * 100).toFixed(0)}%</span>
                    {" / "}
                    <span className="font-bold text-green-400">
                      {(m.desc.tsRate * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts */}
        <h2 className="mb-4 mt-10 border-b border-[var(--border)] pb-2 text-lg font-bold text-white">
          Analytics
        </h2>
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="border border-[var(--border)] bg-[var(--card)] p-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Quality Score by Model
            </h3>
            <QualityChart data={data} />
          </div>
          <div className="border border-[var(--border)] bg-[var(--card)] p-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Token Consumption by Model
            </h3>
            <TokenChart data={data} />
          </div>
        </div>
        <div className="mb-10 border border-[var(--border)] bg-[var(--card)] p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Per-Component Breakdown
          </h3>
          <ComponentChart data={data} />
        </div>

        {/* Methodology */}
        <h2 className="mb-4 mt-10 border-b border-[var(--border)] pb-2 text-lg font-bold text-white">
          Methodology
        </h2>
        <div className="mb-10 grid grid-cols-1 gap-6 text-sm text-[var(--muted)] lg:grid-cols-2">
          <div>
            <h3 className="mb-2 font-semibold text-white">Components Tested</h3>
            <ul className="list-inside list-disc space-y-1">
              {data.componentNames.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-white">Conditions</h3>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong className="text-red-400">raw-source-only</strong> — LLM receives full
                component source code (170-2400 lines)
              </li>
              <li>
                <strong className="text-green-400">descriptor-only</strong> — LLM receives compact
                AI descriptor JSON (~30-90 lines)
              </li>
            </ul>
            <h3 className="mb-2 mt-4 font-semibold text-white">Prompts</h3>
            <ul className="list-inside list-disc space-y-1">
              <li>basic-usage — render with defaults</li>
              <li>prop-customization — modify 2-3 props</li>
              <li>complex-usage — realistic production scenario</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-white">Scoring Metrics</h3>
            <ul className="list-inside list-disc space-y-1">
              <li>Prop correctness — are real props used?</li>
              <li>Import correctness — correct import path?</li>
              <li>TypeScript validity — valid imports, JSX, exports?</li>
              <li>Overall — average of all metrics</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-white">Reproduce</h3>
            <pre className="mt-2 overflow-x-auto bg-[#0d0d0d] p-3 text-xs text-[#b0b0b0]">
              <code>{`pnpm eval:comparative
pnpm eval:comparative:gemini
pnpm eval:report:comparative`}</code>
            </pre>
          </div>
        </div>

        {/* Report downloads */}
        <h2 className="mb-4 mt-10 border-b border-[var(--border)] pb-2 text-lg font-bold text-white">
          Detailed Reports
        </h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Full reports with side-by-side generated code comparisons:
        </p>
        <div className="mb-10 flex flex-wrap gap-3">
          {data.models.map((m) => (
            <Link
              key={m.slug}
              href={`/evals/report-${m.slug}.html`}
              target="_blank"
              className="border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
            >
              {m.modelShort} Full Report
            </Link>
          ))}
          <Link
            href="/evals/report-combined.html"
            target="_blank"
            className="border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            Combined Summary
          </Link>
        </div>
      </div>
    </div>
  );
}
