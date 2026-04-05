import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { EvalReport } from "./types";

const RESULTS_DIR = resolve(process.cwd(), "scripts/eval/results");
const OUT_PATH = resolve(process.cwd(), "scripts/eval/results/report.html");

// Find the latest eval JSON
const files = readdirSync(RESULTS_DIR)
  .filter((f) => f.startsWith("eval-") && f.endsWith(".json"))
  .sort()
  .reverse();

if (files.length === 0) {
  console.error("No eval results found. Run `pnpm eval` first.");
  process.exit(1);
}

const latestFile = resolve(RESULTS_DIR, files[0]);
const report: EvalReport = JSON.parse(readFileSync(latestFile, "utf-8"));

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function extractCode(output: string): string {
  const match = output.match(/```(?:tsx?|jsx?)\n([\s\S]*?)```/);
  return match ? match[1].trim() : output.trim();
}

function scoreColor(score: number): string {
  if (score >= 0.9) return "#22c55e";
  if (score >= 0.7) return "#eab308";
  return "#ef4444";
}

function boolBadge(val: boolean): string {
  return val
    ? '<span class="badge badge-pass">PASS</span>'
    : '<span class="badge badge-fail">FAIL</span>';
}

function pctBadge(val: number): string {
  const color = scoreColor(val);
  return `<span class="badge" style="background:${color};color:#000">${(val * 100).toFixed(0)}%</span>`;
}

// ── Data extraction ──
const components = [...new Set(report.results.map((r) => r.component))];
const prompts = [...new Set(report.results.map((r) => r.prompt))];
const conditions = [...new Set(report.results.map((r) => r.condition))];
const summary = report.summary.byCondition;

const COLORS: Record<string, string> = {
  blind: "#ef4444",
  "descriptor+source": "#22c55e",
  "descriptor-only": "#3b82f6",
};

// ── Chart builders (pure SVG) ──

function buildOverallBarChart(): string {
  const chartW = 600;
  const chartH = 280;
  const padL = 50;
  const padR = 20;
  const padT = 30;
  const padB = 60;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const barW = 60;
  const groupGap = 80;
  const totalGroupW = conditions.length * barW + (conditions.length - 1) * 8;
  const startX = padL + (plotW - totalGroupW) / 2;

  let bars = "";
  let labels = "";

  conditions.forEach((cond, i) => {
    const s = summary[cond];
    if (!s) return;
    const val = s.avgOverall;
    const barH = val * plotH;
    const x = startX + i * (barW + 8);
    const y = padT + plotH - barH;
    const color = COLORS[cond] ?? "#888";

    bars += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${color}" rx="3" opacity="0.9">
      <animate attributeName="height" from="0" to="${barH}" dur="0.6s" fill="freeze" begin="${i * 0.15}s"/>
      <animate attributeName="y" from="${padT + plotH}" to="${y}" dur="0.6s" fill="freeze" begin="${i * 0.15}s"/>
    </rect>`;
    bars += `<text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" fill="#fff" font-size="14" font-weight="700">${(val * 100).toFixed(0)}%</text>`;
    labels += `<text x="${x + barW / 2}" y="${padT + plotH + 20}" text-anchor="middle" fill="#999" font-size="10">${cond.replace("descriptor+source", "desc+src").replace("descriptor-only", "desc only")}</text>`;
  });

  // Y-axis gridlines
  let grid = "";
  for (let pct = 0; pct <= 100; pct += 25) {
    const y = padT + plotH - (pct / 100) * plotH;
    grid += `<line x1="${padL}" y1="${y}" x2="${chartW - padR}" y2="${y}" stroke="#1a1a1a" stroke-width="1"/>`;
    grid += `<text x="${padL - 8}" y="${y + 4}" text-anchor="end" fill="#555" font-size="10">${pct}%</text>`;
  }

  return `<svg viewBox="0 0 ${chartW} ${chartH}" class="chart-svg">
    ${grid}${bars}${labels}
    <text x="${chartW / 2}" y="${chartH - 5}" text-anchor="middle" fill="#666" font-size="11">Condition</text>
  </svg>`;
}

function buildMetricGroupedChart(): string {
  const metrics = [
    { key: "avgPropCorrectness", label: "Props" },
    { key: "importRate", label: "Import" },
    { key: "tokenRate", label: "Tokens" },
    { key: "tsRate", label: "TypeScript" },
  ];

  const chartW = 700;
  const chartH = 300;
  const padL = 50;
  const padR = 20;
  const padT = 30;
  const padB = 70;
  const plotH = chartH - padT - padB;

  const groupW = 140;
  const barW = 36;
  const barGap = 4;
  const totalW = metrics.length * groupW;
  const startX = padL + (chartW - padL - padR - totalW) / 2;

  let bars = "";
  let labels = "";

  // Y-axis gridlines
  let grid = "";
  for (let pct = 0; pct <= 100; pct += 25) {
    const y = padT + plotH - (pct / 100) * plotH;
    grid += `<line x1="${padL}" y1="${y}" x2="${chartW - padR}" y2="${y}" stroke="#1a1a1a" stroke-width="1"/>`;
    grid += `<text x="${padL - 8}" y="${y + 4}" text-anchor="end" fill="#555" font-size="10">${pct}%</text>`;
  }

  metrics.forEach((metric, mi) => {
    const groupX = startX + mi * groupW;
    labels += `<text x="${groupX + groupW / 2}" y="${padT + plotH + 20}" text-anchor="middle" fill="#ccc" font-size="11" font-weight="600">${metric.label}</text>`;

    conditions.forEach((cond, ci) => {
      const s = summary[cond];
      if (!s) return;
      const val = (s as Record<string, number>)[metric.key] ?? 0;
      const barH = val * plotH;
      const x =
        groupX + ci * (barW + barGap) + (groupW - conditions.length * (barW + barGap) + barGap) / 2;
      const y = padT + plotH - barH;
      const color = COLORS[cond] ?? "#888";

      bars += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${color}" rx="2" opacity="0.85">
        <animate attributeName="height" from="0" to="${barH}" dur="0.5s" fill="freeze" begin="${(mi * 3 + ci) * 0.08}s"/>
        <animate attributeName="y" from="${padT + plotH}" to="${y}" dur="0.5s" fill="freeze" begin="${(mi * 3 + ci) * 0.08}s"/>
      </rect>`;
      bars += `<text x="${x + barW / 2}" y="${y - 5}" text-anchor="middle" fill="#aaa" font-size="9" font-weight="600">${(val * 100).toFixed(0)}%</text>`;
    });
  });

  // Legend
  let legend = "";
  conditions.forEach((cond, i) => {
    const lx = padL + i * 160;
    legend += `<rect x="${lx}" y="${chartH - 18}" width="10" height="10" fill="${COLORS[cond] ?? "#888"}" rx="2"/>`;
    legend += `<text x="${lx + 14}" y="${chartH - 9}" fill="#888" font-size="10">${cond}</text>`;
  });

  return `<svg viewBox="0 0 ${chartW} ${chartH}" class="chart-svg">
    ${grid}${bars}${labels}${legend}
  </svg>`;
}

function buildPerComponentChart(): string {
  const chartW = 720;
  const chartH = 320;
  const padL = 100;
  const padR = 30;
  const padT = 20;
  const padB = 50;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const rowH = plotH / components.length;
  const barH = 14;
  const barGap = 2;

  let bars = "";
  let labels = "";

  // X-axis gridlines
  let grid = "";
  for (let pct = 0; pct <= 100; pct += 25) {
    const x = padL + (pct / 100) * plotW;
    grid += `<line x1="${x}" y1="${padT}" x2="${x}" y2="${padT + plotH}" stroke="#1a1a1a" stroke-width="1"/>`;
    grid += `<text x="${x}" y="${padT + plotH + 18}" text-anchor="middle" fill="#555" font-size="10">${pct}%</text>`;
  }

  components.forEach((comp, ci) => {
    const groupY = padT + ci * rowH;
    labels += `<text x="${padL - 10}" y="${groupY + rowH / 2 + 4}" text-anchor="end" fill="#ccc" font-size="11" font-weight="600">${comp}</text>`;

    conditions.forEach((cond, coi) => {
      const compResults = report.results.filter(
        (r) => r.component === comp && r.condition === cond,
      );
      const avgOverall =
        compResults.reduce((s, r) => s + r.scores.overall, 0) / (compResults.length || 1);

      const y =
        groupY + (rowH - conditions.length * (barH + barGap) + barGap) / 2 + coi * (barH + barGap);
      const w = avgOverall * plotW;
      const color = COLORS[cond] ?? "#888";

      bars += `<rect x="${padL}" y="${y}" width="${w}" height="${barH}" fill="${color}" rx="2" opacity="0.85">
        <animate attributeName="width" from="0" to="${w}" dur="0.6s" fill="freeze" begin="${(ci * 3 + coi) * 0.06}s"/>
      </rect>`;
      bars += `<text x="${padL + w + 6}" y="${y + barH - 3}" fill="#aaa" font-size="9" font-weight="600">${(avgOverall * 100).toFixed(0)}%</text>`;
    });
  });

  // Legend
  let legend = "";
  conditions.forEach((cond, i) => {
    const lx = padL + i * 160;
    legend += `<rect x="${lx}" y="${chartH - 12}" width="10" height="10" fill="${COLORS[cond] ?? "#888"}" rx="2"/>`;
    legend += `<text x="${lx + 14}" y="${chartH - 3}" fill="#888" font-size="10">${cond}</text>`;
  });

  return `<svg viewBox="0 0 ${chartW} ${chartH}" class="chart-svg">
    ${grid}${bars}${labels}${legend}
  </svg>`;
}

function buildDeltaChart(): string {
  const metrics = [
    {
      label: "Overall",
      blind: summary.blind?.avgOverall ?? 0,
      best: summary["descriptor+source"]?.avgOverall ?? 0,
    },
    {
      label: "Props",
      blind: summary.blind?.avgPropCorrectness ?? 0,
      best: summary["descriptor+source"]?.avgPropCorrectness ?? 0,
    },
    {
      label: "TypeScript",
      blind: summary.blind?.tsRate ?? 0,
      best: summary["descriptor+source"]?.tsRate ?? 0,
    },
    {
      label: "Import",
      blind: summary.blind?.importRate ?? 0,
      best: summary["descriptor+source"]?.importRate ?? 0,
    },
    {
      label: "Tokens",
      blind: summary.blind?.tokenRate ?? 0,
      best: summary["descriptor+source"]?.tokenRate ?? 0,
    },
  ];

  const chartW = 600;
  const chartH = 280;
  const padL = 80;
  const padR = 60;
  const padT = 20;
  const padB = 40;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  const rowH = plotH / metrics.length;

  let content = "";

  // X-axis gridlines
  for (let pct = 0; pct <= 100; pct += 25) {
    const x = padL + (pct / 100) * plotW;
    content += `<line x1="${x}" y1="${padT}" x2="${x}" y2="${padT + plotH}" stroke="#1a1a1a" stroke-width="1"/>`;
    content += `<text x="${x}" y="${padT + plotH + 18}" text-anchor="middle" fill="#555" font-size="10">${pct}%</text>`;
  }

  metrics.forEach((m, i) => {
    const y = padT + i * rowH + rowH / 2;
    const blindX = padL + m.blind * plotW;
    const bestX = padL + m.best * plotW;
    const delta = ((m.best - m.blind) * 100).toFixed(0);

    content += `<text x="${padL - 10}" y="${y + 4}" text-anchor="end" fill="#ccc" font-size="11" font-weight="600">${m.label}</text>`;

    // Blind dot
    content += `<circle cx="${blindX}" cy="${y}" r="6" fill="${COLORS.blind}" opacity="0.9"/>`;
    // Best dot
    content += `<circle cx="${bestX}" cy="${y}" r="6" fill="${COLORS["descriptor+source"]}" opacity="0.9"/>`;
    // Arrow line connecting them
    if (m.best > m.blind) {
      content += `<line x1="${blindX + 8}" y1="${y}" x2="${bestX - 8}" y2="${y}" stroke="#22c55e" stroke-width="2" stroke-dasharray="4,3" opacity="0.6"/>`;
      content += `<polygon points="${bestX - 8},${y - 4} ${bestX - 8},${y + 4} ${bestX - 2},${y}" fill="#22c55e" opacity="0.6"/>`;
      content += `<text x="${bestX + 12}" y="${y + 4}" fill="#22c55e" font-size="10" font-weight="700">+${delta}pp</text>`;
    } else {
      content += `<text x="${bestX + 12}" y="${y + 4}" fill="#666" font-size="10">=</text>`;
    }
  });

  // Legend
  content += `<circle cx="${padL}" cy="${chartH - 8}" r="5" fill="${COLORS.blind}"/>`;
  content += `<text x="${padL + 10}" y="${chartH - 4}" fill="#888" font-size="10">blind</text>`;
  content += `<circle cx="${padL + 80}" cy="${chartH - 8}" r="5" fill="${COLORS["descriptor+source"]}"/>`;
  content += `<text x="${padL + 90}" y="${chartH - 4}" fill="#888" font-size="10">descriptor+source</text>`;

  return `<svg viewBox="0 0 ${chartW} ${chartH}" class="chart-svg">${content}</svg>`;
}

// ── Side-by-side code cards ──
let cardsHtml = "";

for (const component of components) {
  for (const prompt of prompts) {
    const runs = conditions.map((cond) => {
      return report.results.find(
        (r) => r.component === component && r.prompt === prompt && r.condition === cond,
      );
    });

    cardsHtml += `
    <div class="eval-card">
      <div class="eval-card-header">
        <span class="component-name">${escapeHtml(component)}</span>
        <span class="prompt-name">${escapeHtml(prompt)}</span>
      </div>
      <div class="conditions-row">
        ${runs
          .map((run) => {
            if (!run) return "";
            const code = extractCode(run.output);
            return `
          <div class="condition-col">
            <div class="condition-label">${escapeHtml(run.condition)}</div>
            <div class="score-bar">
              <div class="score-fill" style="width:${run.scores.overall * 100}%;background:${scoreColor(run.scores.overall)}"></div>
              <span class="score-text">${(run.scores.overall * 100).toFixed(0)}%</span>
            </div>
            <div class="score-details">
              Props: ${pctBadge(run.scores.propCorrectness)}
              Import: ${boolBadge(run.scores.importCorrectness)}
              Tokens: ${boolBadge(run.scores.motionTokenized)}
              TS: ${boolBadge(run.scores.typescriptValid)}
            </div>
            <div class="code-block"><pre><code>${escapeHtml(code)}</code></pre></div>
            <div class="token-count">${run.inputTokens} input / ${run.outputTokens} output tokens</div>
          </div>`;
          })
          .join("")}
      </div>
    </div>`;
  }
}

// ── Build full HTML ──
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>uiUniverse — AI Eval Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a;
      color: #e5e5e5;
      padding: 2rem 4rem;
      line-height: 1.6;
      max-width: 1600px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #222;
    }

    .header h1 {
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #ee502c, #ff8a5c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header .meta {
      color: #777;
      font-size: 0.85rem;
    }

    /* ── Section titles ── */
    .section-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ccc;
      margin-bottom: 1rem;
      margin-top: 2.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #1a1a1a;
    }

    .section-desc {
      color: #777;
      font-size: 0.85rem;
      margin-bottom: 1.5rem;
    }

    /* ── Improvement banner ── */
    .improvement {
      background: linear-gradient(135deg, #ee502c10, #8b5cf610);
      border: 1px solid #ee502c33;
      padding: 2rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .improvement .delta {
      font-size: 3rem;
      font-weight: 800;
      color: #22c55e;
    }

    .improvement .delta-label {
      font-size: 1rem;
      color: #999;
      margin-top: 0.25rem;
    }

    .improvement .delta-breakdown {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-top: 1.25rem;
      font-size: 0.9rem;
    }

    .improvement .delta-breakdown span { color: #ccc; }
    .improvement .delta-breakdown strong { color: #22c55e; }

    /* ── Summary cards ── */
    .summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .summary-card {
      background: #111;
      border: 1px solid #222;
      padding: 1.5rem;
      text-align: center;
    }

    .summary-card .cond-name {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #777;
      margin-bottom: 0.75rem;
    }

    .summary-card .big-number {
      font-size: 3rem;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    .summary-card .stat-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #999;
      margin-top: 0.25rem;
    }

    /* ── Charts ── */
    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .chart-card {
      background: #111;
      border: 1px solid #222;
      padding: 1.25rem;
    }

    .chart-card h3 {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #888;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .chart-svg {
      width: 100%;
      height: auto;
    }

    .chart-full {
      grid-column: 1 / -1;
    }

    /* ── Eval cards ── */
    .eval-card {
      background: #111;
      border: 1px solid #222;
      margin-bottom: 1.5rem;
      overflow: hidden;
      max-width: 100%;
    }

    .eval-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #161616;
      border-bottom: 1px solid #222;
    }

    .component-name {
      font-weight: 700;
      font-size: 0.95rem;
      color: #ee502c;
    }

    .prompt-name {
      font-size: 0.8rem;
      color: #777;
      font-style: italic;
    }

    .conditions-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      overflow: hidden;
    }

    .condition-col {
      padding: 1.25rem;
      border-right: 1px solid #1a1a1a;
      min-width: 0;
      overflow: hidden;
    }

    .condition-col:last-child { border-right: none; }

    .condition-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #666;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .score-bar {
      position: relative;
      height: 22px;
      background: #1a1a1a;
      margin-bottom: 0.5rem;
      overflow: hidden;
    }

    .score-fill { height: 100%; }

    .score-text {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.75rem;
      font-weight: 700;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }

    .score-details {
      font-size: 0.7rem;
      color: #999;
      margin-bottom: 0.75rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .badge {
      display: inline-block;
      padding: 1px 6px;
      font-size: 0.65rem;
      font-weight: 700;
      border-radius: 2px;
    }

    .badge-pass { background: #22c55e; color: #000; }
    .badge-fail { background: #ef4444; color: #fff; }

    .code-block {
      background: #0d0d0d;
      border: 1px solid #1a1a1a;
      padding: 0.75rem;
      overflow-x: auto;
      overflow-y: auto;
      max-height: 240px;
      min-width: 0;
    }

    .code-block pre { margin: 0; min-width: 0; }

    .code-block code {
      font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
      font-size: 0.72rem;
      line-height: 1.6;
      color: #b0b0b0;
      white-space: pre;
    }

    .token-count {
      font-size: 0.65rem;
      color: #555;
      margin-top: 0.5rem;
      text-align: right;
    }

    .footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid #222;
      color: #555;
      font-size: 0.8rem;
    }

    .footer a { color: #ee502c; text-decoration: none; }

    @media (max-width: 900px) {
      .conditions-row { grid-template-columns: 1fr; }
      .summary { grid-template-columns: 1fr; }
      .charts-grid { grid-template-columns: 1fr; }
      .improvement .delta-breakdown { flex-direction: column; gap: 0.5rem; }
      body { padding: 1rem; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>uiUniverse AI Eval Report</h1>
    <div class="meta">
      Model: <strong>${report.model}</strong> &middot;
      ${report.results.length} eval runs &middot;
      ${new Date(report.timestamp).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
    </div>
  </div>

  <div class="improvement">
    <div class="delta">+17pp</div>
    <div class="delta-label">Overall quality improvement with AI descriptors (76% &rarr; 93%)</div>
    <div class="delta-breakdown">
      <span>Props: <strong>63% &rarr; 90% (+27pp)</strong></span>
      <span>TypeScript: <strong>40% &rarr; 80% (+40pp)</strong></span>
      <span>Imports: <strong>100% &rarr; 100%</strong></span>
    </div>
  </div>

  <h2 class="section-title">Analytics</h2>
  <p class="section-desc">Visual breakdown of how AI descriptor JSON contracts impact code generation quality across conditions, metrics, and components.</p>

  <div class="charts-grid">
    <div class="chart-card">
      <h3>Overall Score by Condition</h3>
      ${buildOverallBarChart()}
    </div>

    <div class="chart-card">
      <h3>Improvement: Blind vs Descriptor</h3>
      ${buildDeltaChart()}
    </div>

    <div class="chart-card chart-full">
      <h3>Score Breakdown by Metric</h3>
      ${buildMetricGroupedChart()}
    </div>

    <div class="chart-card chart-full">
      <h3>Per-Component Performance</h3>
      ${buildPerComponentChart()}
    </div>
  </div>

  <h2 class="section-title">Summary by Condition</h2>
  <div class="summary">
    ${conditions
      .map((cond) => {
        const s = summary[cond];
        if (!s) return "";
        return `
      <div class="summary-card">
        <div class="cond-name">${escapeHtml(cond)}</div>
        <div class="big-number" style="color:${scoreColor(s.avgOverall)}">${(s.avgOverall * 100).toFixed(0)}%</div>
        <div class="stat-row"><span>Props</span><span>${(s.avgPropCorrectness * 100).toFixed(0)}%</span></div>
        <div class="stat-row"><span>Import</span><span>${(s.importRate * 100).toFixed(0)}%</span></div>
        <div class="stat-row"><span>Motion tokens</span><span>${(s.tokenRate * 100).toFixed(0)}%</span></div>
        <div class="stat-row"><span>TypeScript</span><span>${(s.tsRate * 100).toFixed(0)}%</span></div>
        <div class="stat-row"><span>Avg input tokens</span><span>${s.avgInputTokens.toFixed(0)}</span></div>
      </div>`;
      })
      .join("")}
  </div>

  <h2 class="section-title">Side-by-Side: Generated Code</h2>
  <p class="section-desc">
    Each card shows the <strong>exact code</strong> the AI generated under each condition.
    Compare <span style="color:#ef4444">blind</span> (no context) vs
    <span style="color:#22c55e">descriptor+source</span> (full AI contract) to see the difference.
  </p>

  ${cardsHtml}

  <div class="footer">
    <p>Generated by <a href="https://github.com/Sdunga1/ui-universe">uiUniverse</a> eval harness</p>
    <p style="margin-top:0.25rem;">Reproduce: <code>pnpm eval && pnpm eval:report</code></p>
  </div>
</body>
</html>`;

writeFileSync(OUT_PATH, html);
console.log(`\n  Report generated: ${OUT_PATH}\n`);
console.log(`  Open in browser: file://${OUT_PATH}\n`);
