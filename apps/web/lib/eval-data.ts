import { supabase } from "./supabase";

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

function emptyData(): EvalPageData {
  return {
    models: [],
    totalRuns: 0,
    totalComponents: 0,
    avgTokenRatio: 1,
    avgQualityGain: 0,
    componentNames: [],
    generatedAt: new Date().toISOString(),
  };
}

export async function loadEvalData(): Promise<EvalPageData> {
  // Fetch all runs ordered by timestamp descending
  const { data: allRuns, error: runsError } = await supabase
    .from("eval_runs")
    .select("*")
    .order("run_timestamp", { ascending: false });

  if (runsError || !allRuns?.length) {
    return emptyData();
  }

  // Pick the latest run per model_slug
  const latestBySlug: Record<string, (typeof allRuns)[0]> = {};
  for (const run of allRuns) {
    if (!latestBySlug[run.model_slug]) {
      latestBySlug[run.model_slug] = run;
    }
  }

  const selectedRuns = Object.values(latestBySlug);
  const runIds = selectedRuns.map((r) => r.id);

  // Fetch component stats for the selected runs
  const { data: componentStats } = await supabase
    .from("eval_component_stats")
    .select("*")
    .in("run_id", runIds);

  const models: EvalModelSummary[] = selectedRuns.map((run) => {
    const stats = componentStats?.filter((s) => s.run_id === run.id) ?? [];

    const components: EvalModelSummary["components"] = {};
    for (const stat of stats) {
      if (!components[stat.component]) {
        components[stat.component] = {
          raw: { avgOverall: 0, avgInputTokens: 0 },
          desc: { avgOverall: 0, avgInputTokens: 0 },
        };
      }
      if (stat.condition === "raw-source-only") {
        components[stat.component].raw = {
          avgOverall: stat.avg_overall ?? 0,
          avgInputTokens: stat.avg_input_tokens ?? 0,
        };
      } else if (stat.condition === "descriptor-only") {
        components[stat.component].desc = {
          avgOverall: stat.avg_overall ?? 0,
          avgInputTokens: stat.avg_input_tokens ?? 0,
        };
      }
    }

    return {
      model: run.model,
      modelShort: shortName(run.model),
      slug: run.model_slug,
      totalRuns: run.total_results,
      timestamp: run.run_timestamp,
      raw: {
        avgOverall: run.raw_avg_overall ?? 0,
        avgPropCorrectness: run.raw_avg_prop_correctness ?? 0,
        importRate: run.raw_import_rate ?? 0,
        tsRate: run.raw_ts_rate ?? 0,
        avgInputTokens: run.raw_avg_input_tokens ?? 0,
      },
      desc: {
        avgOverall: run.desc_avg_overall ?? 0,
        avgPropCorrectness: run.desc_avg_prop_correctness ?? 0,
        importRate: run.desc_import_rate ?? 0,
        tsRate: run.desc_ts_rate ?? 0,
        avgInputTokens: run.desc_avg_input_tokens ?? 0,
      },
      tokenRatio: run.token_ratio ?? 1,
      efficiencyGain: run.efficiency_gain ?? 1,
      components,
    };
  });

  const allComponentNames = [...new Set(models.flatMap((m) => Object.keys(m.components)))];
  const totalRuns = models.reduce((s, m) => s + m.totalRuns, 0);
  const avgTokenRatio =
    models.length > 0 ? models.reduce((s, m) => s + m.tokenRatio, 0) / models.length : 1;
  const avgQualityGain =
    models.length > 0
      ? models.reduce((s, m) => s + (m.desc.avgOverall - m.raw.avgOverall), 0) / models.length
      : 0;

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
