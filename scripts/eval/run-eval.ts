import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import fg from "fast-glob";
import { evalConditions } from "./conditions";
import { evalPrompts } from "./prompts";
import { scoreOutput } from "./scorer";
import type { EvalReport, EvalResult } from "./types";

const MODEL = "claude-sonnet-4-20250514";
const UI_SRC = resolve(process.cwd(), "packages/ui/src");
const RESULTS_DIR = resolve(process.cwd(), "scripts/eval/results");

// 5 components for eval — one from each tier
const EVAL_COMPONENTS = [
  "animations/fade-up", // Tier 1: Animation primitive
  "text/type-writer", // Tier 2: Text animation
  "animations/tilt-card", // Tier 3: Interactive effect
  "backgrounds/dot-grid", // Tier 4: Background
  "sections/hero-section", // Tier 5: Section composition
];

async function loadComponent(categorySlug: string) {
  const [category, slug] = categorySlug.split("/");
  const dir = `${UI_SRC}/components/${category}/${slug}`;

  const descriptorPath = fg.sync(`${dir}/*.descriptor.json`)[0];
  const sourcePath = fg.sync(`${dir}/*.tsx`, { ignore: ["**/*.test.tsx"] })[0];

  if (!descriptorPath || !sourcePath) {
    throw new Error(`Missing files for ${categorySlug}`);
  }

  const descriptor = JSON.parse(readFileSync(descriptorPath, "utf-8"));
  const source = readFileSync(sourcePath, "utf-8");

  return {
    name: descriptor.name,
    descriptor,
    source,
    descriptorJson: JSON.stringify(descriptor, null, 2),
  };
}

async function runEval() {
  console.log("\n  uiUniverse — AI Eval Harness\n");

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("  Error: Set ANTHROPIC_API_KEY environment variable");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  const results: EvalResult[] = [];

  mkdirSync(RESULTS_DIR, { recursive: true });

  const total = EVAL_COMPONENTS.length * evalPrompts.length * evalConditions.length;
  let current = 0;

  for (const componentPath of EVAL_COMPONENTS) {
    const component = await loadComponent(componentPath);
    console.log(`  Component: ${component.name}`);

    for (const prompt of evalPrompts) {
      for (const condition of evalConditions) {
        current++;
        const userPrompt = prompt.template(component.name, component.descriptor);
        const systemPrompt = condition.buildContext(
          component.name,
          component.descriptorJson,
          component.source,
        );

        console.log(`    [${current}/${total}] ${prompt.name} / ${condition.name}`);

        try {
          const response = await client.messages.create({
            model: MODEL,
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
          });

          const output = response.content
            .filter((block): block is Anthropic.TextBlock => block.type === "text")
            .map((block) => block.text)
            .join("\n");

          const scores = scoreOutput(output, component.name, component.descriptor);

          results.push({
            component: component.name,
            prompt: prompt.name,
            condition: condition.name,
            output,
            scores,
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
          });

          console.log(
            `      Score: ${(scores.overall * 100).toFixed(0)}% (props: ${(scores.propCorrectness * 100).toFixed(0)}%, import: ${scores.importCorrectness ? "\u2713" : "\u2717"}, tokens: ${scores.motionTokenized ? "\u2713" : "\u2717"}, ts: ${scores.typescriptValid ? "\u2713" : "\u2717"})`,
          );
        } catch (err) {
          console.error(`      Error: ${(err as Error).message}`);
        }
      }
    }
  }

  // Build summary
  const byCondition: Record<
    string,
    {
      avgOverall: number;
      avgPropCorrectness: number;
      importRate: number;
      tokenRate: number;
      tsRate: number;
      avgInputTokens: number;
    }
  > = {};

  for (const condName of evalConditions.map((c) => c.name)) {
    const condResults = results.filter((r) => r.condition === condName);
    if (condResults.length === 0) continue;

    byCondition[condName] = {
      avgOverall: condResults.reduce((s, r) => s + r.scores.overall, 0) / condResults.length,
      avgPropCorrectness:
        condResults.reduce((s, r) => s + r.scores.propCorrectness, 0) / condResults.length,
      importRate: condResults.filter((r) => r.scores.importCorrectness).length / condResults.length,
      tokenRate: condResults.filter((r) => r.scores.motionTokenized).length / condResults.length,
      tsRate: condResults.filter((r) => r.scores.typescriptValid).length / condResults.length,
      avgInputTokens: condResults.reduce((s, r) => s + r.inputTokens, 0) / condResults.length,
    };
  }

  const report: EvalReport = {
    timestamp: new Date().toISOString(),
    model: MODEL,
    results,
    summary: { byCondition },
  };

  const outPath = `${RESULTS_DIR}/eval-${Date.now()}.json`;
  writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log("\n  -- Summary --\n");
  for (const [cond, stats] of Object.entries(byCondition)) {
    console.log(
      `  ${cond.padEnd(20)} | Overall: ${(stats.avgOverall * 100).toFixed(0)}% | Props: ${(stats.avgPropCorrectness * 100).toFixed(0)}% | Import: ${(stats.importRate * 100).toFixed(0)}% | Tokens: ${(stats.tokenRate * 100).toFixed(0)}% | TS: ${(stats.tsRate * 100).toFixed(0)}% | Avg input: ${stats.avgInputTokens.toFixed(0)}`,
    );
  }

  console.log(`\n  Results written to: ${outPath}\n`);
}

runEval().catch(console.error);
