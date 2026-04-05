/**
 * Seed Supabase with existing eval result JSON files.
 * Run once after setting up the schema:
 *   pnpm eval:seed
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

// Load .env
const envPath = resolve(process.cwd(), ".env");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // no .env
}

const RESULTS_DIR = resolve(process.cwd(), "scripts/eval/results");

function slug(model: string): string {
  if (model.includes("claude")) return "claude";
  if (model.includes("gemini")) return "gemini";
  return "unknown";
}

async function seed() {
  const { supabase } = await import("./supabase.js");

  const files = readdirSync(RESULTS_DIR).filter(
    (f) => f.startsWith("comparative-") && f.endsWith(".json"),
  );

  if (files.length === 0) {
    console.log("No comparative result files found.");
    return;
  }

  console.log(`Found ${files.length} result files to seed.\n`);

  for (const file of files.sort()) {
    console.log(`  Processing ${file}...`);
    const report = JSON.parse(readFileSync(resolve(RESULTS_DIR, file), "utf-8"));

    const modelSlug = slug(report.model);
    const raw = report.summary.byCondition["raw-source-only"] ?? {};
    const desc = report.summary.byCondition["descriptor-only"] ?? {};
    const rawEff = report.summary.tokenEfficiency?.["raw-source-only"] ?? {};
    const descEff = report.summary.tokenEfficiency?.["descriptor-only"] ?? {};

    const rawTokens = raw.avgInputTokens ?? 0;
    const descTokens = desc.avgInputTokens ?? 0;
    const tokenRatio = rawTokens && descTokens ? rawTokens / descTokens : 1;
    const effGain =
      rawEff.scorePerKToken && descEff.scorePerKToken
        ? descEff.scorePerKToken / rawEff.scorePerKToken
        : 1;

    const { data: runData, error: runError } = await supabase
      .from("eval_runs")
      .insert({
        run_timestamp: report.timestamp,
        model: report.model,
        model_slug: modelSlug,
        total_results: report.results?.length ?? 0,
        raw_avg_overall: raw.avgOverall,
        raw_avg_prop_correctness: raw.avgPropCorrectness,
        raw_import_rate: raw.importRate,
        raw_ts_rate: raw.tsRate,
        raw_avg_input_tokens: rawTokens,
        raw_score_per_k_token: rawEff.scorePerKToken,
        desc_avg_overall: desc.avgOverall,
        desc_avg_prop_correctness: desc.avgPropCorrectness,
        desc_import_rate: desc.importRate,
        desc_ts_rate: desc.tsRate,
        desc_avg_input_tokens: descTokens,
        desc_score_per_k_token: descEff.scorePerKToken,
        token_ratio: tokenRatio,
        efficiency_gain: effGain,
      })
      .select()
      .single();

    if (runError) {
      console.error(`    Error inserting run: ${runError.message}`);
      continue;
    }

    const compStats = [];
    for (const [comp, conds] of Object.entries(
      report.summary.byComponent as Record<
        string,
        Record<string, { avgOverall: number; avgPropCorrectness: number; avgInputTokens: number }>
      >,
    )) {
      for (const [cond, stats] of Object.entries(conds)) {
        compStats.push({
          run_id: runData.id,
          component: comp,
          condition: cond,
          avg_overall: stats.avgOverall,
          avg_prop_correctness: stats.avgPropCorrectness,
          avg_input_tokens: stats.avgInputTokens,
        });
      }
    }

    const { error: statsError } = await supabase.from("eval_component_stats").insert(compStats);
    if (statsError) {
      console.error(`    Error inserting component stats: ${statsError.message}`);
      continue;
    }

    // Seed eval_usage_stats from basic-usage prompt results
    const usageStats = [];
    const slugify = (name: string) =>
      name
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, "");
    for (const result of (report.results ?? []) as Array<{
      component: string;
      prompt: string;
      condition: string;
      inputTokens: number;
      outputTokens: number;
      scores: { overall: number; propCorrectness: number };
      iterations?: number;
    }>) {
      if (result.prompt !== "basic-usage") continue;
      usageStats.push({
        run_id: runData.id,
        component: slugify(result.component),
        condition: result.condition,
        input_tokens: result.inputTokens,
        output_tokens: result.outputTokens,
        overall: result.scores?.overall ?? 0,
        prop_correctness: result.scores?.propCorrectness ?? 0,
        iterations: result.iterations ?? 1,
      });
    }

    if (usageStats.length > 0) {
      const { error: usageError } = await supabase.from("eval_usage_stats").insert(usageStats);
      if (usageError) {
        console.error(`    Error inserting usage stats: ${usageError.message}`);
      } else {
        console.log(
          `    Seeded run ${runData.id} (${compStats.length} comp stats, ${usageStats.length} usage stats)`,
        );
      }
    } else {
      console.log(`    Seeded run ${runData.id} (${compStats.length} comp stats)`);
    }
  }

  console.log("\nSeed complete.");
}

seed().catch(console.error);
