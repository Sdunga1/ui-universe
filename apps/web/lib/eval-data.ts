import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

export interface EvalModelSummary {
  model: string;
  modelShort: string;
  slug: string;
  totalRuns: number;
  timestamp: string;
  raw: {
    avgOverall: number;
    avgPropCorrectness: number;
    importRate: number;
    tsRate: number;
    avgInputTokens: number;
  };
  desc: {
    avgOverall: number;
    avgPropCorrectness: number;
    importRate: number;
    tsRate: number;
    avgInputTokens: number;
  };
  tokenRatio: number;
  efficiencyGain: number;
  components: Record<
    string,
    {
      raw: { avgOverall: number; avgInputTokens: number };
      desc: { avgOverall: number; avgInputTokens: number };
    }
  >;
}

export interface EvalPageData {
  models: EvalModelSummary[];
  totalRuns: number;
  totalComponents: number;
  avgTokenRatio: number;
  avgQualityGain: number;
  componentNames: string[];
  generatedAt: string;
}

function shortName(m: string): string {
  if (m.includes("claude")) return "Claude Sonnet 4";
  if (m.includes("gemini")) return "Gemini 2.5 Flash";
  return m;
}

function slug(m: string): string {
  if (m.includes("claude")) return "claude";
  if (m.includes("gemini")) return "gemini";
  return "unknown";
}

export function loadEvalData(): EvalPageData {
  const resultsDir = resolve(process.cwd(), "../../scripts/eval/results");
  const allFiles = readdirSync(resultsDir).filter(
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

  const modelFiles = [claudeFile, geminiFile].filter(Boolean) as string[];
  const models: EvalModelSummary[] = [];

  for (const file of modelFiles) {
    const report = JSON.parse(readFileSync(resolve(resultsDir, file), "utf-8"));
    const raw = report.summary.byCondition["raw-source-only"] ?? {};
    const desc = report.summary.byCondition["descriptor-only"] ?? {};
    const rawEff = report.summary.tokenEfficiency["raw-source-only"] ?? {};
    const descEff = report.summary.tokenEfficiency["descriptor-only"] ?? {};

    const tokenRatio =
      raw.avgInputTokens && desc.avgInputTokens ? raw.avgInputTokens / desc.avgInputTokens : 1;
    const effGain =
      rawEff.scorePerKToken && descEff.scorePerKToken
        ? descEff.scorePerKToken / rawEff.scorePerKToken
        : 1;

    const components: EvalModelSummary["components"] = {};
    for (const [comp, conds] of Object.entries(
      report.summary.byComponent as Record<string, Record<string, any>>,
    )) {
      components[comp] = {
        raw: {
          avgOverall: conds["raw-source-only"]?.avgOverall ?? 0,
          avgInputTokens: conds["raw-source-only"]?.avgInputTokens ?? 0,
        },
        desc: {
          avgOverall: conds["descriptor-only"]?.avgOverall ?? 0,
          avgInputTokens: conds["descriptor-only"]?.avgInputTokens ?? 0,
        },
      };
    }

    models.push({
      model: report.model,
      modelShort: shortName(report.model),
      slug: slug(report.model),
      totalRuns: report.results.length,
      timestamp: report.timestamp,
      raw,
      desc,
      tokenRatio,
      efficiencyGain: effGain,
      components,
    });
  }

  const allComponentNames = [...new Set(models.flatMap((m) => Object.keys(m.components)))];
  const totalRuns = models.reduce((s, m) => s + m.totalRuns, 0);
  const avgTokenRatio = models.reduce((s, m) => s + m.tokenRatio, 0) / models.length;
  const avgQualityGain =
    models.reduce((s, m) => s + (m.desc.avgOverall - m.raw.avgOverall), 0) / models.length;

  return {
    models,
    totalRuns,
    totalComponents: allComponentNames.length,
    avgTokenRatio,
    avgQualityGain,
    componentNames: allComponentNames,
    generatedAt: new Date().toISOString(),
  };
}
