export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function extractCode(output: string): string {
  const m = output.match(/```(?:tsx?|jsx?)\n([\s\S]*?)```/);
  return m ? m[1].trim() : output.trim();
}

export function scoreColor(s: number): string {
  if (s >= 0.9) return "#22c55e";
  if (s >= 0.7) return "#eab308";
  return "#ef4444";
}

export function modelShortName(m: string): string {
  if (m.includes("claude")) return "Claude Sonnet 4";
  if (m.includes("gemini")) return "Gemini 2.5 Flash";
  return m;
}

export function modelSlug(m: string): string {
  if (m.includes("claude")) return "claude";
  if (m.includes("gemini")) return "gemini";
  return "unknown";
}

export const MODEL_COLORS: Record<string, string> = {
  claude: "#ee502c",
  gemini: "#4285f4",
};

export const CONDITION_COLORS: Record<string, string> = {
  "raw-source-only": "#ef4444",
  "descriptor-only": "#22c55e",
};

export const BASE_STYLES = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e5e5; padding: 2rem 4rem; line-height: 1.6; max-width: 1600px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid #222; }
    .header h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem; background: linear-gradient(135deg, #ee502c, #ff8a5c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .header .subtitle { font-size: 1.05rem; color: #999; margin-bottom: 0.5rem; }
    .header .meta { color: #666; font-size: 0.85rem; }
    .section-title { font-size: 1.15rem; font-weight: 700; color: #ccc; margin-bottom: 1rem; margin-top: 2.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #1a1a1a; }
    .section-desc { color: #777; font-size: 0.85rem; margin-bottom: 1.5rem; }
    .key-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
    .stat-card { background: #111; border: 1px solid #222; padding: 1.5rem; text-align: center; }
    .stat-card .stat-value { font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: 0.25rem; }
    .stat-card .stat-label { font-size: 0.8rem; color: #888; }
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
    .chart-card { background: #111; border: 1px solid #222; padding: 1.25rem; }
    .chart-card h3 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin-bottom: 1rem; font-weight: 600; }
    .chart-full { grid-column: 1 / -1; }
    .chart-svg { width: 100%; height: auto; }
    .eval-card { background: #111; border: 1px solid #222; margin-bottom: 1.5rem; overflow: hidden; max-width: 100%; }
    .eval-card-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: #161616; border-bottom: 1px solid #222; }
    .component-name { font-weight: 700; font-size: 0.95rem; color: #ee502c; }
    .prompt-name { font-size: 0.8rem; color: #777; font-style: italic; }
    .conditions-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); overflow: hidden; }
    .condition-col { padding: 1.25rem; border-right: 1px solid #1a1a1a; min-width: 0; overflow: hidden; }
    .condition-col:last-child { border-right: none; }
    .condition-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; font-weight: 700; }
    .score-bar { position: relative; height: 22px; background: #1a1a1a; margin-bottom: 0.5rem; overflow: hidden; }
    .score-fill { height: 100%; }
    .score-text { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); font-size: 0.75rem; font-weight: 700; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
    .score-details { font-size: 0.7rem; color: #999; margin-bottom: 0.75rem; display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .badge { display: inline-block; padding: 1px 6px; font-size: 0.65rem; font-weight: 700; border-radius: 2px; }
    .badge-pass { background: #22c55e; color: #000; }
    .badge-fail { background: #ef4444; color: #fff; }
    .code-block { background: #0d0d0d; border: 1px solid #1a1a1a; padding: 0.75rem; overflow-x: auto; overflow-y: auto; max-height: 280px; min-width: 0; }
    .code-block pre { margin: 0; min-width: 0; }
    .code-block code { font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace; font-size: 0.72rem; line-height: 1.6; color: #b0b0b0; white-space: pre; }
    .token-count { font-size: 0.65rem; color: #555; margin-top: 0.5rem; text-align: right; }
    .footer { text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #222; color: #555; font-size: 0.8rem; }
    .footer a { color: #ee502c; text-decoration: none; }
    @media (max-width: 900px) {
      .conditions-row { grid-template-columns: 1fr; }
      .key-stats { grid-template-columns: repeat(2, 1fr); }
      .charts-grid { grid-template-columns: 1fr; }
      body { padding: 1rem; }
    }
`;
