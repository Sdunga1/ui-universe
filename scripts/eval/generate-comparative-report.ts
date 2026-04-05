import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  BASE_STYLES,
  CONDITION_COLORS,
  MODEL_COLORS,
  esc,
  extractCode,
  modelShortName,
  modelSlug,
  scoreColor,
} from "./report-utils";

const SCREENSHOTS_DIR = resolve(process.cwd(), "scripts/eval/visual/screenshots");

function getScreenshotBase64(component: string, prompt: string, condition: string): string | null {
  const slug = component
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "")
    .replace(/-+/g, "");
  const condSlug = condition.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  const promptSlug = prompt.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  // Try multiple naming patterns
  const candidates = [
    `${slug}-${promptSlug}-${condSlug}.png`,
    `${component.toLowerCase()}-${promptSlug}-${condSlug}.png`,
  ];
  for (const name of candidates) {
    const path = resolve(SCREENSHOTS_DIR, name);
    if (existsSync(path)) {
      const data = readFileSync(path);
      return `data:image/png;base64,${data.toString("base64")}`;
    }
  }
  return null;
}

const RESULTS_DIR = resolve(process.cwd(), "scripts/eval/results");
const CONDITIONS = ["raw-source-only", "descriptor-only"];

interface ModelReport {
  model: string;
  timestamp: string;
  results: any[];
  summary: {
    byCondition: Record<string, any>;
    byComponent: Record<string, Record<string, any>>;
    tokenEfficiency: Record<string, any>;
  };
}

// ── Load all results ──
const allFiles = readdirSync(RESULTS_DIR).filter(
  (f) => f.startsWith("comparative-") && f.endsWith(".json"),
);
const claudeFile = allFiles
  .filter((f) => f.includes("claude"))
  .sort()
  .reverse()[0];
const geminiFile = allFiles
  .filter((f) => f.includes("gemini"))
  .sort()
  .reverse()[0];

const models: ModelReport[] = [];
if (claudeFile) models.push(JSON.parse(readFileSync(resolve(RESULTS_DIR, claudeFile), "utf-8")));
if (geminiFile) models.push(JSON.parse(readFileSync(resolve(RESULTS_DIR, geminiFile), "utf-8")));

if (models.length === 0) {
  console.error("No comparative results found. Run `pnpm eval:comparative` first.");
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════════════
// CHART BUILDERS
// ═══════════════════════════════════════════════════════════════════════════

function tokenComparisonChart(report: ModelReport): string {
  const w = 600;
  const h = 300;
  const pl = 60;
  const pr = 30;
  const pt = 30;
  const pb = 70;
  const plotH = h - pt - pb;
  const barW = 80;
  const gap = 40;
  const totalW = CONDITIONS.length * (barW + gap) - gap;
  const startX = pl + (w - pl - pr - totalW) / 2;
  const maxTokens = Math.max(
    ...CONDITIONS.map((c) => report.summary.byCondition[c]?.avgInputTokens ?? 0),
  );

  let svg = "";
  for (let i = 0; i <= 4; i++) {
    const y = pt + plotH - (i / 4) * plotH;
    svg += `<line x1="${pl}" y1="${y}" x2="${w - pr}" y2="${y}" stroke="#1a1a1a"/>`;
    svg += `<text x="${pl - 8}" y="${y + 4}" text-anchor="end" fill="#555" font-size="10">${Math.round((maxTokens * i) / 4)}</text>`;
  }
  CONDITIONS.forEach((cond, i) => {
    const tokens = report.summary.byCondition[cond]?.avgInputTokens ?? 0;
    const barH = (tokens / maxTokens) * plotH;
    const x = startX + i * (barW + gap);
    const y = pt + plotH - barH;
    const color = CONDITION_COLORS[cond] ?? "#888";
    svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${color}" rx="3" opacity="0.9"><animate attributeName="height" from="0" to="${barH}" dur="0.5s" fill="freeze" begin="${i * 0.2}s"/><animate attributeName="y" from="${pt + plotH}" to="${y}" dur="0.5s" fill="freeze" begin="${i * 0.2}s"/></rect>`;
    svg += `<text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">${Math.round(tokens)}</text>`;
    svg += `<text x="${x + barW / 2}" y="${pt + plotH + 18}" text-anchor="middle" fill="#999" font-size="10">${cond === "raw-source-only" ? "Raw Source" : "Descriptor"}</text>`;
  });
  svg += `<text x="${w / 2}" y="${h - 8}" text-anchor="middle" fill="#666" font-size="11">Average Input Tokens</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" class="chart-svg">${svg}</svg>`;
}

function qualityChart(report: ModelReport): string {
  const w = 600;
  const h = 300;
  const pl = 60;
  const pr = 30;
  const pt = 30;
  const pb = 70;
  const plotH = h - pt - pb;
  const barW = 80;
  const gap = 40;
  const totalW = CONDITIONS.length * (barW + gap) - gap;
  const startX = pl + (w - pl - pr - totalW) / 2;

  let svg = "";
  for (let pct = 0; pct <= 100; pct += 25) {
    const y = pt + plotH - (pct / 100) * plotH;
    svg += `<line x1="${pl}" y1="${y}" x2="${w - pr}" y2="${y}" stroke="#1a1a1a"/>`;
    svg += `<text x="${pl - 8}" y="${y + 4}" text-anchor="end" fill="#555" font-size="10">${pct}%</text>`;
  }
  CONDITIONS.forEach((cond, i) => {
    const val = report.summary.byCondition[cond]?.avgOverall ?? 0;
    const barH = val * plotH;
    const x = startX + i * (barW + gap);
    const y = pt + plotH - barH;
    const color = CONDITION_COLORS[cond] ?? "#888";
    svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${color}" rx="3" opacity="0.9"><animate attributeName="height" from="0" to="${barH}" dur="0.5s" fill="freeze" begin="${i * 0.2}s"/><animate attributeName="y" from="${pt + plotH}" to="${y}" dur="0.5s" fill="freeze" begin="${i * 0.2}s"/></rect>`;
    svg += `<text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">${(val * 100).toFixed(0)}%</text>`;
    svg += `<text x="${x + barW / 2}" y="${pt + plotH + 18}" text-anchor="middle" fill="#999" font-size="10">${cond === "raw-source-only" ? "Raw Source" : "Descriptor"}</text>`;
  });
  svg += `<text x="${w / 2}" y="${h - 8}" text-anchor="middle" fill="#666" font-size="11">Overall Quality Score</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" class="chart-svg">${svg}</svg>`;
}

function perComponentChart(report: ModelReport): string {
  const components = Object.keys(report.summary.byComponent);
  const w = 700;
  const pl = 130;
  const pr = 30;
  const pt = 20;
  const pb = 50;
  const plotW = w - pl - pr;
  const rowH = 45;
  const h = pt + components.length * rowH + pb;
  const barH = 16;
  const barGap = 4;

  let svg = "";
  for (let pct = 0; pct <= 100; pct += 25) {
    const x = pl + (pct / 100) * plotW;
    svg += `<line x1="${x}" y1="${pt}" x2="${x}" y2="${pt + components.length * rowH}" stroke="#1a1a1a"/>`;
    svg += `<text x="${x}" y="${pt + components.length * rowH + 18}" text-anchor="middle" fill="#555" font-size="10">${pct}%</text>`;
  }
  components.forEach((comp, ci) => {
    const gy = pt + ci * rowH;
    svg += `<text x="${pl - 10}" y="${gy + rowH / 2 + 4}" text-anchor="end" fill="#ccc" font-size="11" font-weight="600">${comp}</text>`;
    CONDITIONS.forEach((cond, coi) => {
      const stats = report.summary.byComponent[comp]?.[cond];
      if (!stats) return;
      const y =
        gy + (rowH - CONDITIONS.length * (barH + barGap) + barGap) / 2 + coi * (barH + barGap);
      const bw = stats.avgOverall * plotW;
      const color = CONDITION_COLORS[cond] ?? "#888";
      svg += `<rect x="${pl}" y="${y}" width="${bw}" height="${barH}" fill="${color}" rx="2" opacity="0.85"><animate attributeName="width" from="0" to="${bw}" dur="0.5s" fill="freeze" begin="${(ci * 2 + coi) * 0.08}s"/></rect>`;
      svg += `<text x="${pl + bw + 6}" y="${y + barH - 3}" fill="#aaa" font-size="9" font-weight="600">${(stats.avgOverall * 100).toFixed(0)}% (${Math.round(stats.avgInputTokens)} tok)</text>`;
    });
  });
  CONDITIONS.forEach((cond, i) => {
    svg += `<rect x="${pl + i * 160}" y="${h - 14}" width="10" height="10" fill="${CONDITION_COLORS[cond]}" rx="2"/>`;
    svg += `<text x="${pl + i * 160 + 14}" y="${h - 5}" fill="#888" font-size="10">${cond === "raw-source-only" ? "Raw Source" : "Descriptor"}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" class="chart-svg">${svg}</svg>`;
}

function efficiencyChart(report: ModelReport): string {
  const w = 600;
  const h = 260;
  const pl = 60;
  const pr = 30;
  const pt = 30;
  const pb = 70;
  const plotH = h - pt - pb;
  const barW = 80;
  const gap = 40;
  const totalW = CONDITIONS.length * (barW + gap) - gap;
  const startX = pl + (w - pl - pr - totalW) / 2;
  const maxEff =
    Math.max(...CONDITIONS.map((c) => report.summary.tokenEfficiency[c]?.scorePerKToken ?? 0)) *
    1.2;

  let svg = "";
  for (let i = 0; i <= 4; i++) {
    const y = pt + plotH - (i / 4) * plotH;
    svg += `<line x1="${pl}" y1="${y}" x2="${w - pr}" y2="${y}" stroke="#1a1a1a"/>`;
    svg += `<text x="${pl - 8}" y="${y + 4}" text-anchor="end" fill="#555" font-size="10">${((maxEff * i) / 4).toFixed(1)}</text>`;
  }
  CONDITIONS.forEach((cond, i) => {
    const eff = report.summary.tokenEfficiency[cond];
    if (!eff) return;
    const barH = (eff.scorePerKToken / maxEff) * plotH;
    const x = startX + i * (barW + gap);
    const y = pt + plotH - barH;
    svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${CONDITION_COLORS[cond]}" rx="3" opacity="0.9"><animate attributeName="height" from="0" to="${barH}" dur="0.5s" fill="freeze" begin="${i * 0.2}s"/><animate attributeName="y" from="${pt + plotH}" to="${y}" dur="0.5s" fill="freeze" begin="${i * 0.2}s"/></rect>`;
    svg += `<text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">${eff.scorePerKToken.toFixed(2)}</text>`;
    svg += `<text x="${x + barW / 2}" y="${pt + plotH + 18}" text-anchor="middle" fill="#999" font-size="10">${cond === "raw-source-only" ? "Raw Source" : "Descriptor"}</text>`;
  });
  svg += `<text x="${w / 2}" y="${h - 8}" text-anchor="middle" fill="#666" font-size="11">Score per 1K Input Tokens (higher = more efficient)</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" class="chart-svg">${svg}</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. INDIVIDUAL MODEL REPORTS (with code side-by-side)
// ═══════════════════════════════════════════════════════════════════════════

function generateModelReport(report: ModelReport): void {
  const slug = modelSlug(report.model);
  const name = modelShortName(report.model);
  const color = MODEL_COLORS[slug] ?? "#888";
  const raw = report.summary.byCondition["raw-source-only"] ?? {};
  const desc = report.summary.byCondition["descriptor-only"] ?? {};
  const tokenRatio =
    raw.avgInputTokens && desc.avgInputTokens
      ? (raw.avgInputTokens / desc.avgInputTokens).toFixed(1)
      : "?";
  const rawEff = report.summary.tokenEfficiency["raw-source-only"] ?? {};
  const descEff = report.summary.tokenEfficiency["descriptor-only"] ?? {};
  const effRatio = rawEff.scorePerKToken
    ? (descEff.scorePerKToken / rawEff.scorePerKToken).toFixed(1)
    : "?";
  const components = Object.keys(report.summary.byComponent);
  const comps = [...new Set(report.results.map((r: any) => r.component))];
  const prompts = [...new Set(report.results.map((r: any) => r.prompt))];

  let cardsHtml = "";
  for (const comp of comps as string[]) {
    for (const prompt of prompts as string[]) {
      const runs = CONDITIONS.map((cond) =>
        report.results.find(
          (r: any) => r.component === comp && r.prompt === prompt && r.condition === cond,
        ),
      );
      cardsHtml += `
      <div class="eval-card">
        <div class="eval-card-header">
          <span class="component-name">${esc(comp)}</span>
          <span class="prompt-name">${esc(prompt)}</span>
        </div>
        <div class="conditions-row">
          ${runs
            .map((run: any) => {
              if (!run) return "";
              const code = extractCode(run.output);
              const screenshot = getScreenshotBase64(run.component, run.prompt, run.condition);
              const screenshotHtml = screenshot
                ? `<div class="screenshot"><img src="${screenshot}" alt="Rendered ${run.component}" style="width:100%;border:1px solid #222;margin-bottom:0.75rem;"/></div>`
                : `<div class="screenshot-placeholder" style="border:1px dashed #333;padding:1.5rem;text-align:center;color:#555;font-size:0.75rem;margin-bottom:0.75rem;">No visual render available</div>`;
              return `
          <div class="condition-col">
            <div class="condition-label" style="color:${CONDITION_COLORS[run.condition] ?? "#888"}">${run.condition === "raw-source-only" ? "Raw Source Code" : "AI Descriptor"}</div>
            <div class="score-bar"><div class="score-fill" style="width:${run.scores.overall * 100}%;background:${scoreColor(run.scores.overall)}"></div><span class="score-text">${(run.scores.overall * 100).toFixed(0)}%</span></div>
            <div class="score-details">
              Props: <span class="badge" style="background:${scoreColor(run.scores.propCorrectness)};color:#000">${(run.scores.propCorrectness * 100).toFixed(0)}%</span>
              Import: <span class="badge ${run.scores.importCorrectness ? "badge-pass" : "badge-fail"}">${run.scores.importCorrectness ? "PASS" : "FAIL"}</span>
              TS: <span class="badge ${run.scores.typescriptValid ? "badge-pass" : "badge-fail"}">${run.scores.typescriptValid ? "PASS" : "FAIL"}</span>
            </div>
            ${screenshotHtml}
            <div class="code-block"><pre><code>${esc(code)}</code></pre></div>
            <div class="token-count">${run.inputTokens} input / ${run.outputTokens} output tokens</div>
          </div>`;
            })
            .join("")}
        </div>
      </div>`;
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>uiUniverse Eval — ${name}</title><style>${BASE_STYLES}</style></head>
<body>
  <div class="header">
    <h1 style="background:linear-gradient(135deg, ${color}, ${color}88);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${name} — Eval Report</h1>
    <div class="subtitle">Source Code vs AI Descriptor</div>
    <div class="meta">${report.results.length} eval runs &middot; ${components.length} components &middot; ${new Date(report.timestamp).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
  </div>
  <div class="key-stats">
    <div class="stat-card"><div class="stat-value" style="color:#22c55e">${tokenRatio}x</div><div class="stat-label">Fewer tokens with descriptor</div></div>
    <div class="stat-card"><div class="stat-value" style="color:${scoreColor(desc.avgOverall ?? 0)}">${((desc.avgOverall ?? 0) * 100).toFixed(0)}%</div><div class="stat-label">Descriptor quality score</div></div>
    <div class="stat-card"><div class="stat-value" style="color:${scoreColor(raw.avgOverall ?? 0)}">${((raw.avgOverall ?? 0) * 100).toFixed(0)}%</div><div class="stat-label">Raw source quality score</div></div>
    <div class="stat-card"><div class="stat-value" style="color:#3b82f6">${effRatio}x</div><div class="stat-label">Better token efficiency</div></div>
  </div>
  <h2 class="section-title">Analytics</h2>
  <div class="charts-grid">
    <div class="chart-card"><h3>Quality Score</h3>${qualityChart(report)}</div>
    <div class="chart-card"><h3>Token Consumption</h3>${tokenComparisonChart(report)}</div>
    <div class="chart-card"><h3>Token Efficiency</h3>${efficiencyChart(report)}</div>
    <div class="chart-card"><h3>Per-Component</h3>${perComponentChart(report)}</div>
  </div>
  <h2 class="section-title">Side-by-Side: Generated Code</h2>
  <p class="section-desc">Left: <span style="color:#ef4444">raw source code</span> given to LLM. Right: <span style="color:#22c55e">AI descriptor JSON</span>. Same prompt, same model.</p>
  ${cardsHtml}
  <div class="footer"><p>Generated by <a href="https://github.com/Sdunga1/ui-universe">uiUniverse</a> eval harness</p></div>
</body></html>`;

  const outPath = resolve(RESULTS_DIR, `report-${slug}.html`);
  writeFileSync(outPath, html);
  console.log(`  ${name} report: ${outPath}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. CROSS-MODEL EXECUTIVE SUMMARY (no code, stakeholder-friendly)
// ═══════════════════════════════════════════════════════════════════════════

function generateCombinedReport(): void {
  const allComponents = [...new Set(models.flatMap((m) => Object.keys(m.summary.byComponent)))];
  const totalRuns = models.reduce((s, m) => s + m.results.length, 0);

  // ── Cross-model quality chart ──
  function crossModelQualityChart(): string {
    const w = 700;
    const h = 320;
    const pl = 60;
    const pr = 30;
    const pt = 30;
    const pb = 80;
    const plotH = h - pt - pb;
    const groupW = (w - pl - pr) / models.length;
    const barW = 50;
    const barGap = 8;

    let svg = "";
    for (let pct = 0; pct <= 100; pct += 25) {
      const y = pt + plotH - (pct / 100) * plotH;
      svg += `<line x1="${pl}" y1="${y}" x2="${w - pr}" y2="${y}" stroke="#1a1a1a"/>`;
      svg += `<text x="${pl - 8}" y="${y + 4}" text-anchor="end" fill="#555" font-size="10">${pct}%</text>`;
    }
    models.forEach((m, mi) => {
      const gx = pl + mi * groupW + groupW / 2;
      const slug = modelSlug(m.model);
      CONDITIONS.forEach((cond, ci) => {
        const val = m.summary.byCondition[cond]?.avgOverall ?? 0;
        const barH = val * plotH;
        const x = gx - (CONDITIONS.length * (barW + barGap)) / 2 + ci * (barW + barGap);
        const y = pt + plotH - barH;
        svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${CONDITION_COLORS[cond]}" rx="3" opacity="0.85"><animate attributeName="height" from="0" to="${barH}" dur="0.5s" fill="freeze" begin="${(mi * 2 + ci) * 0.12}s"/><animate attributeName="y" from="${pt + plotH}" to="${y}" dur="0.5s" fill="freeze" begin="${(mi * 2 + ci) * 0.12}s"/></rect>`;
        svg += `<text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">${(val * 100).toFixed(0)}%</text>`;
      });
      svg += `<text x="${gx}" y="${pt + plotH + 20}" text-anchor="middle" fill="${MODEL_COLORS[slug] ?? "#ccc"}" font-size="12" font-weight="700">${modelShortName(m.model)}</text>`;
    });
    svg += `<rect x="${pl}" y="${h - 18}" width="10" height="10" fill="#ef4444" rx="2"/><text x="${pl + 14}" y="${h - 9}" fill="#888" font-size="10">Raw Source</text>`;
    svg += `<rect x="${pl + 120}" y="${h - 18}" width="10" height="10" fill="#22c55e" rx="2"/><text x="${pl + 134}" y="${h - 9}" fill="#888" font-size="10">AI Descriptor</text>`;
    return `<svg viewBox="0 0 ${w} ${h}" class="chart-svg">${svg}</svg>`;
  }

  // ── Cross-model token chart ──
  function crossModelTokenChart(): string {
    const w = 700;
    const h = 320;
    const pl = 60;
    const pr = 30;
    const pt = 30;
    const pb = 80;
    const plotH = h - pt - pb;
    const maxTokens = Math.max(
      ...models.flatMap((m) =>
        CONDITIONS.map((c) => m.summary.byCondition[c]?.avgInputTokens ?? 0),
      ),
    );
    const groupW = (w - pl - pr) / models.length;
    const barW = 50;
    const barGap = 8;

    let svg = "";
    for (let i = 0; i <= 4; i++) {
      const y = pt + plotH - (i / 4) * plotH;
      svg += `<line x1="${pl}" y1="${y}" x2="${w - pr}" y2="${y}" stroke="#1a1a1a"/>`;
      svg += `<text x="${pl - 8}" y="${y + 4}" text-anchor="end" fill="#555" font-size="10">${Math.round((maxTokens * i) / 4)}</text>`;
    }
    models.forEach((m, mi) => {
      const gx = pl + mi * groupW + groupW / 2;
      const slug = modelSlug(m.model);
      CONDITIONS.forEach((cond, ci) => {
        const tokens = m.summary.byCondition[cond]?.avgInputTokens ?? 0;
        const barH = (tokens / maxTokens) * plotH;
        const x = gx - (CONDITIONS.length * (barW + barGap)) / 2 + ci * (barW + barGap);
        const y = pt + plotH - barH;
        svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${CONDITION_COLORS[cond]}" rx="3" opacity="0.85"><animate attributeName="height" from="0" to="${barH}" dur="0.5s" fill="freeze" begin="${(mi * 2 + ci) * 0.12}s"/><animate attributeName="y" from="${pt + plotH}" to="${y}" dur="0.5s" fill="freeze" begin="${(mi * 2 + ci) * 0.12}s"/></rect>`;
        svg += `<text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">${Math.round(tokens)}</text>`;
      });
      svg += `<text x="${gx}" y="${pt + plotH + 20}" text-anchor="middle" fill="${MODEL_COLORS[slug] ?? "#ccc"}" font-size="12" font-weight="700">${modelShortName(m.model)}</text>`;
    });
    svg += `<rect x="${pl}" y="${h - 18}" width="10" height="10" fill="#ef4444" rx="2"/><text x="${pl + 14}" y="${h - 9}" fill="#888" font-size="10">Raw Source</text>`;
    svg += `<rect x="${pl + 120}" y="${h - 18}" width="10" height="10" fill="#22c55e" rx="2"/><text x="${pl + 134}" y="${h - 9}" fill="#888" font-size="10">AI Descriptor</text>`;
    return `<svg viewBox="0 0 ${w} ${h}" class="chart-svg">${svg}</svg>`;
  }

  // ── Model comparison table ──
  const tableRows = models
    .map((m) => {
      const slug = modelSlug(m.model);
      const raw = m.summary.byCondition["raw-source-only"] ?? {};
      const desc = m.summary.byCondition["descriptor-only"] ?? {};
      const rawEff = m.summary.tokenEfficiency["raw-source-only"] ?? {};
      const descEff = m.summary.tokenEfficiency["descriptor-only"] ?? {};
      const tokenRatio =
        raw.avgInputTokens && desc.avgInputTokens
          ? (raw.avgInputTokens / desc.avgInputTokens).toFixed(1)
          : "?";
      const effRatio = rawEff.scorePerKToken
        ? (descEff.scorePerKToken / rawEff.scorePerKToken).toFixed(1)
        : "?";
      const color = MODEL_COLORS[slug] ?? "#888";
      return `<tr>
        <td style="color:${color};font-weight:700">${modelShortName(m.model)}</td>
        <td>${((raw.avgOverall ?? 0) * 100).toFixed(0)}%</td>
        <td style="color:#22c55e;font-weight:700">${((desc.avgOverall ?? 0) * 100).toFixed(0)}%</td>
        <td>${Math.round(raw.avgInputTokens ?? 0)}</td>
        <td style="color:#22c55e;font-weight:700">${Math.round(desc.avgInputTokens ?? 0)}</td>
        <td style="color:#22c55e;font-weight:700">${tokenRatio}x</td>
        <td style="color:#3b82f6;font-weight:700">${effRatio}x</td>
        <td>${((raw.tsRate ?? 0) * 100).toFixed(0)}%</td>
        <td style="color:#22c55e;font-weight:700">${((desc.tsRate ?? 0) * 100).toFixed(0)}%</td>
      </tr>`;
    })
    .join("");

  // ── Key findings ──
  const avgTokenRatio =
    models.reduce((s, m) => {
      const raw = m.summary.byCondition["raw-source-only"]?.avgInputTokens ?? 1;
      const desc = m.summary.byCondition["descriptor-only"]?.avgInputTokens ?? 1;
      return s + raw / desc;
    }, 0) / models.length;

  const avgQualityGain =
    models.reduce((s, m) => {
      const raw = m.summary.byCondition["raw-source-only"]?.avgOverall ?? 0;
      const desc = m.summary.byCondition["descriptor-only"]?.avgOverall ?? 0;
      return s + (desc - raw);
    }, 0) / models.length;

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>uiUniverse — Cross-Model Eval Summary</title>
<style>
  ${BASE_STYLES}
  .findings { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
  .finding { background: #111; border: 1px solid #222; padding: 1.5rem; }
  .finding .finding-num { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
  .finding .finding-text { font-size: 0.85rem; color: #999; line-height: 1.5; }
  table { width: 100%; border-collapse: collapse; background: #111; border: 1px solid #222; margin-bottom: 2rem; }
  th { background: #161616; padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #888; border-bottom: 1px solid #222; }
  td { padding: 0.75rem 1rem; border-bottom: 1px solid #1a1a1a; font-size: 0.85rem; }
  tr:last-child td { border-bottom: none; }
  .model-links { display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }
  .model-links a { color: #ee502c; text-decoration: none; padding: 0.5rem 1.5rem; border: 1px solid #ee502c33; font-size: 0.85rem; }
  .model-links a:hover { background: #ee502c15; }
  @media (max-width: 900px) { .findings { grid-template-columns: 1fr; } }
</style></head>
<body>
  <div class="header">
    <h1>Cross-Model Eval Summary</h1>
    <div class="subtitle">AI Descriptors improve code generation quality across models while consuming ${avgTokenRatio.toFixed(0)}x fewer tokens</div>
    <div class="meta">
      Models: <strong>${models.map((m) => modelShortName(m.model)).join(" &amp; ")}</strong> &middot;
      ${totalRuns} total eval runs &middot;
      ${allComponents.length} components &middot;
      ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
    </div>
  </div>

  <div class="findings">
    <div class="finding">
      <div class="finding-num" style="color:#22c55e">${avgTokenRatio.toFixed(1)}x</div>
      <div class="finding-text">Fewer input tokens on average when using AI descriptors instead of raw source code. Consistent across both Claude and Gemini.</div>
    </div>
    <div class="finding">
      <div class="finding-num" style="color:#eab308">+${(avgQualityGain * 100).toFixed(0)}pp</div>
      <div class="finding-text">Average quality improvement with descriptors. The lightweight JSON contract captures the API surface better than hundreds of lines of implementation code.</div>
    </div>
    <div class="finding">
      <div class="finding-num" style="color:#3b82f6">${models.length}</div>
      <div class="finding-text">Models tested. The pattern holds across model providers — descriptors are a model-agnostic improvement to component distribution.</div>
    </div>
  </div>

  <h2 class="section-title">Model Comparison</h2>
  <table>
    <thead><tr>
      <th>Model</th>
      <th>Raw Score</th>
      <th>Descriptor Score</th>
      <th>Raw Tokens</th>
      <th>Desc Tokens</th>
      <th>Token Ratio</th>
      <th>Efficiency Gain</th>
      <th>Raw TS Valid</th>
      <th>Desc TS Valid</th>
    </tr></thead>
    <tbody>${tableRows}</tbody>
  </table>

  <h2 class="section-title">Cross-Model Analytics</h2>
  <div class="charts-grid">
    <div class="chart-card"><h3>Quality Score by Model</h3>${crossModelQualityChart()}</div>
    <div class="chart-card"><h3>Token Consumption by Model</h3>${crossModelTokenChart()}</div>
  </div>

  <h2 class="section-title">Detailed Reports</h2>
  <p class="section-desc">Individual model reports with full side-by-side code comparisons:</p>
  <div class="model-links">
    ${models.map((m) => `<a href="report-${modelSlug(m.model)}.html">${modelShortName(m.model)} Full Report &rarr;</a>`).join("")}
  </div>

  <div class="footer">
    <p>Generated by <a href="https://github.com/Sdunga1/ui-universe">uiUniverse</a> eval harness</p>
    <p style="margin-top:0.25rem;">Reproduce: <code>pnpm eval:comparative && pnpm eval:comparative:gemini && pnpm eval:report:comparative</code></p>
  </div>
</body></html>`;

  const outPath = resolve(RESULTS_DIR, "report-combined.html");
  writeFileSync(outPath, html);
  console.log(`  Combined summary: ${outPath}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════════════════════════════

console.log("\n  Generating reports...\n");

// 1. Individual model reports
for (const m of models) {
  generateModelReport(m);
}

// 2. Combined executive summary
if (models.length > 1) {
  generateCombinedReport();
}

console.log(
  `\n  Done! ${models.length} model reports + ${models.length > 1 ? "1 combined summary" : "no combined (need 2+ models)"}\n`,
);
