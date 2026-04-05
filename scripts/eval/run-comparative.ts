import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import Anthropic from "@anthropic-ai/sdk";

// Load .env manually
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
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
} catch {
  // no .env
}

// Model selection: pass --model=gemini to use Gemini, default is Claude
// Iteration: pass --iterate to enable error-feedback loop (Gemini only)
const MODEL_ARG = process.argv.find((a) => a.startsWith("--model="))?.split("=")[1];
const USE_GEMINI = MODEL_ARG === "gemini";
const USE_ITERATE = process.argv.includes("--iterate") && USE_GEMINI;
const MAX_ITERATIONS = 3;
const CLAUDE_MODEL = "claude-sonnet-4-20250514";
const GEMINI_MODEL = "gemini-2.5-flash";
const MODEL_LABEL = USE_GEMINI ? GEMINI_MODEL : CLAUDE_MODEL;
const FIXTURES = resolve(process.cwd(), "scripts/eval/fixtures");
const RESULTS_DIR = resolve(process.cwd(), "scripts/eval/results");

interface ComponentFixture {
  name: string;
  sourceCode: string;
  sourceLines: number;
  descriptorJson: string;
  descriptorLines: number;
  descriptor: Record<string, unknown>;
}

interface ComparativeResult {
  component: string;
  prompt: string;
  condition: string;
  output: string;
  scores: {
    propCorrectness: number;
    importCorrectness: boolean;
    typescriptValid: boolean;
    overall: number;
  };
  inputTokens: number;
  outputTokens: number;
  iterations?: number;
  iterationErrors?: string[];
}

interface ComparativeReport {
  timestamp: string;
  model: string;
  type: "comparative";
  results: ComparativeResult[];
  summary: {
    byCondition: Record<
      string,
      {
        avgOverall: number;
        avgPropCorrectness: number;
        importRate: number;
        tsRate: number;
        avgInputTokens: number;
      }
    >;
    byComponent: Record<
      string,
      Record<
        string,
        {
          avgOverall: number;
          avgPropCorrectness: number;
          avgInputTokens: number;
        }
      >
    >;
    tokenEfficiency: Record<
      string,
      {
        avgInputTokens: number;
        avgOverall: number;
        scorePerKToken: number;
      }
    >;
  };
}

// Load fixtures
function loadFixture(slug: string): ComponentFixture {
  const source = readFileSync(resolve(FIXTURES, `${slug}.source.tsx`), "utf-8");
  const descriptorRaw = readFileSync(resolve(FIXTURES, `${slug}.descriptor.json`), "utf-8");
  const descriptor = JSON.parse(descriptorRaw);

  return {
    name: descriptor.name,
    sourceCode: source,
    sourceLines: source.split("\n").length,
    descriptorJson: descriptorRaw,
    descriptorLines: descriptorRaw.split("\n").length,
    descriptor,
  };
}

// Scoring
function scoreOutput(
  output: string,
  componentName: string,
  descriptor: Record<string, unknown>,
): ComparativeResult["scores"] {
  const code = output.match(/```(?:tsx?|jsx?)\n([\s\S]*?)```/)?.[1] ?? output;
  const props = Object.keys((descriptor.props as Record<string, unknown>) ?? {});
  const usedProps = props.filter((p) => p !== "children" && p !== "className" && code.includes(p));
  const requiredProps = Object.entries(
    (descriptor.props as Record<string, { required?: boolean }>) ?? {},
  ).filter(([, v]) => v.required);
  const requiredUsed = requiredProps.filter(([k]) => code.includes(k));

  const customizableProps = props.filter((p) => p !== "children" && p !== "className");
  const propScore =
    customizableProps.length > 0
      ? (usedProps.length + (requiredUsed.length === requiredProps.length ? 1 : 0)) /
        (customizableProps.length + 1)
      : 0.5;

  const importCorrectness = code.includes("import") && code.includes(componentName);
  const typescriptValid =
    code.includes("import") &&
    (code.includes("export") || code.includes("function")) &&
    code.includes("<");

  const propCorrectness = Math.min(propScore, 1);
  const overall = (propCorrectness + (importCorrectness ? 1 : 0) + (typescriptValid ? 1 : 0)) / 3;

  return { propCorrectness, importCorrectness, typescriptValid, overall };
}

// Syntax check for iteration loop
function checkSyntax(output: string): string | null {
  const code = output.match(/```(?:tsx?|jsx?)\n([\s\S]*?)```/)?.[1] ?? output;

  // Check for unterminated strings
  const lines = code.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Count unescaped quotes
    const singleQuotes = (line.match(/(?<!\\)'/g) || []).length;
    const doubleQuotes = (line.match(/(?<!\\)"/g) || []).length;
    const backticks = (line.match(/(?<!\\)`/g) || []).length;
    if (singleQuotes % 2 !== 0 && !line.includes("//") && !line.includes("/*")) {
      return `Unterminated string at line ${i + 1}: ${line.trim().slice(0, 80)}`;
    }
    if (doubleQuotes % 2 !== 0 && !line.includes("//") && !line.includes("/*")) {
      return `Unterminated string at line ${i + 1}: ${line.trim().slice(0, 80)}`;
    }
  }

  // Check for balanced braces
  let braces = 0;
  let parens = 0;
  for (const ch of code) {
    if (ch === "{") braces++;
    if (ch === "}") braces--;
    if (ch === "(") parens++;
    if (ch === ")") parens--;
  }
  if (braces !== 0)
    return `Unbalanced braces: ${braces > 0 ? `${braces} unclosed {` : `${-braces} extra }`}`;
  if (parens !== 0)
    return `Unbalanced parentheses: ${parens > 0 ? `${parens} unclosed (` : `${-parens} extra )`}`;

  // Check for export
  if (!code.includes("export")) return "Missing export statement";

  // Check for basic JSX
  if (!code.includes("<")) return "No JSX found in output";

  return null; // No errors
}

// Prompts
const PROMPTS = [
  {
    name: "basic-usage",
    template: (name: string) =>
      `Write a React component that uses ${name} with sensible default props. Include some example content. Export a default function component called Example.`,
  },
  {
    name: "prop-customization",
    template: (name: string, descriptor: Record<string, unknown>) => {
      const props = Object.entries(
        descriptor.props as Record<
          string,
          { type: string; default?: unknown; description: string }
        >,
      )
        .filter(
          ([key, val]) => key !== "children" && key !== "className" && val.default !== undefined,
        )
        .slice(0, 3);
      const instructions = props
        .map(
          ([key, val]) =>
            `- ${key}: set to a non-default value (default is ${JSON.stringify(val.default)})`,
        )
        .join("\n");
      return `Write a React component that uses ${name} with these customizations:\n${instructions}\nExport a default function component called Example.`;
    },
  },
  {
    name: "complex-usage",
    template: (name: string) =>
      `Write a React component that uses ${name} in a realistic production scenario — for example, as part of a dashboard, landing page, or app section. Style it well with Tailwind CSS. Export a default function component called Example.`,
  },
];

// Conditions
function buildConditions(fixture: ComponentFixture) {
  return [
    {
      name: "raw-source-only",
      system: `You are building a React component. Here is the complete source code for the ${fixture.name} component:\n\n\`\`\`tsx\n${fixture.sourceCode}\n\`\`\`\n\nUse this source code to understand the API and write code that correctly uses ${fixture.name}. Import it as a default import.`,
    },
    {
      name: "descriptor-only",
      system: `You are building a React component. Here is the AI descriptor (machine-readable contract) for the ${fixture.name} component:\n\n\`\`\`json\n${fixture.descriptorJson}\n\`\`\`\n\nUse ONLY the props listed in this descriptor. Import ${fixture.name} as a default import. Do not guess — only use props described above.`,
    },
  ];
}

// Gemini API call helper (REST API, no SDK needed)
async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: { maxOutputTokens: 4096 },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n") ?? "";
  const usage = data.usageMetadata ?? {};
  return {
    text,
    inputTokens: usage.promptTokenCount ?? 0,
    outputTokens: usage.candidatesTokenCount ?? 0,
  };
}

async function runComparativeEval() {
  console.log(
    `\n  uiUniverse — Comparative Eval (Source Code vs Descriptor)\n  Model: ${MODEL_LABEL}\n`,
  );

  let anthropicClient: Anthropic | null = null;

  if (USE_GEMINI) {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      console.error("  Error: Set GEMINI_API_KEY in .env");
      process.exit(1);
    }
  } else {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("  Error: Set ANTHROPIC_API_KEY in .env");
      process.exit(1);
    }
    anthropicClient = new Anthropic({ apiKey });
  }

  const results: ComparativeResult[] = [];
  mkdirSync(RESULTS_DIR, { recursive: true });

  const fixtures = [
    loadFixture("counter"),
    loadFixture("circular-gallery"),
    loadFixture("infinite-menu"),
    loadFixture("soft-aurora"),
    loadFixture("flowing-menu"),
    loadFixture("shape-grid"),
  ];

  console.log("  Components:");
  for (const f of fixtures) {
    console.log(
      `    ${f.name}: ${f.sourceLines} lines source (${f.sourceCode.length} chars) vs ${f.descriptorLines} lines descriptor (${f.descriptorJson.length} chars)`,
    );
  }
  console.log();

  const total = fixtures.length * PROMPTS.length * 2; // 2 conditions
  let current = 0;

  for (const fixture of fixtures) {
    const conditions = buildConditions(fixture);
    console.log(`  Component: ${fixture.name}`);

    for (const prompt of PROMPTS) {
      for (const condition of conditions) {
        current++;
        const userPrompt =
          typeof prompt.template === "function"
            ? prompt.template.length === 2
              ? (prompt.template as (n: string, d: Record<string, unknown>) => string)(
                  fixture.name,
                  fixture.descriptor,
                )
              : (prompt.template as (n: string) => string)(fixture.name)
            : prompt.template;

        console.log(`    [${current}/${total}] ${prompt.name} / ${condition.name}`);

        try {
          let output: string;
          let inputTokens: number;
          let outputTokens: number;

          let iterations = 1;
          const iterationErrors: string[] = [];

          if (USE_GEMINI) {
            const geminiResult = await callGemini(
              condition.system,
              userPrompt,
              process.env.GEMINI_API_KEY!,
            );
            output = geminiResult.text;
            inputTokens = geminiResult.inputTokens;
            outputTokens = geminiResult.outputTokens;

            // Iteration loop: if --iterate, check syntax and retry
            if (USE_ITERATE) {
              let syntaxError = checkSyntax(output);
              while (syntaxError && iterations < MAX_ITERATIONS) {
                iterationErrors.push(syntaxError);
                console.log(
                  `      ⚠ Syntax error (attempt ${iterations}): ${syntaxError.slice(0, 80)}`,
                );
                console.log("      → Sending error back to Gemini for fix...");

                const fixPrompt = `The code you generated has this error:\n\n${syntaxError}\n\nHere was your code:\n\`\`\`tsx\n${output.match(/\`\`\`(?:tsx?|jsx?)\n([\s\S]*?)\`\`\`/)?.[1] ?? output}\n\`\`\`\n\nPlease fix the error and return the complete corrected code. Export a default function component called Example.`;

                const fixResult = await callGemini(
                  condition.system,
                  fixPrompt,
                  process.env.GEMINI_API_KEY!,
                );
                output = fixResult.text;
                inputTokens += fixResult.inputTokens;
                outputTokens += fixResult.outputTokens;
                iterations++;

                syntaxError = checkSyntax(output);
              }
              if (iterations > 1) {
                console.log(
                  `      ✓ Fixed after ${iterations} iterations (${iterationErrors.length} errors)`,
                );
              }
            }
          } else {
            const response = await anthropicClient?.messages.create({
              model: CLAUDE_MODEL,
              max_tokens: 4096,
              system: condition.system,
              messages: [{ role: "user", content: userPrompt }],
            });
            output = response.content
              .filter((block): block is Anthropic.TextBlock => block.type === "text")
              .map((block) => block.text)
              .join("\n");
            inputTokens = response.usage.input_tokens;
            outputTokens = response.usage.output_tokens;
          }

          const scores = scoreOutput(output, fixture.name, fixture.descriptor);

          const result: ComparativeResult = {
            component: fixture.name,
            prompt: prompt.name,
            condition: condition.name,
            output,
            scores,
            inputTokens,
            outputTokens,
          };
          if (iterations > 1) {
            result.iterations = iterations;
            result.iterationErrors = iterationErrors;
          }
          results.push(result);

          const iterLabel = iterations > 1 ? ` | Iters: ${iterations}` : "";
          console.log(
            `      Score: ${(scores.overall * 100).toFixed(0)}% | Props: ${(scores.propCorrectness * 100).toFixed(0)}% | Import: ${scores.importCorrectness ? "\u2713" : "\u2717"} | TS: ${scores.typescriptValid ? "\u2713" : "\u2717"} | Tokens in: ${inputTokens}${iterLabel}`,
          );
        } catch (err) {
          console.error(`      Error: ${(err as Error).message}`);
        }
      }
    }
  }

  // Build summary
  const condNames = ["raw-source-only", "descriptor-only"];
  const byCondition: ComparativeReport["summary"]["byCondition"] = {};
  const byComponent: ComparativeReport["summary"]["byComponent"] = {};
  const tokenEfficiency: ComparativeReport["summary"]["tokenEfficiency"] = {};

  for (const condName of condNames) {
    const condResults = results.filter((r) => r.condition === condName);
    if (condResults.length === 0) continue;

    const avgOverall = condResults.reduce((s, r) => s + r.scores.overall, 0) / condResults.length;
    const avgInputTokens = condResults.reduce((s, r) => s + r.inputTokens, 0) / condResults.length;

    byCondition[condName] = {
      avgOverall,
      avgPropCorrectness:
        condResults.reduce((s, r) => s + r.scores.propCorrectness, 0) / condResults.length,
      importRate: condResults.filter((r) => r.scores.importCorrectness).length / condResults.length,
      tsRate: condResults.filter((r) => r.scores.typescriptValid).length / condResults.length,
      avgInputTokens,
    };

    tokenEfficiency[condName] = {
      avgInputTokens,
      avgOverall,
      scorePerKToken: avgInputTokens > 0 ? avgOverall / (avgInputTokens / 1000) : 0,
    };
  }

  for (const comp of fixtures) {
    byComponent[comp.name] = {};
    for (const condName of condNames) {
      const compCondResults = results.filter(
        (r) => r.component === comp.name && r.condition === condName,
      );
      if (compCondResults.length === 0) continue;
      byComponent[comp.name][condName] = {
        avgOverall:
          compCondResults.reduce((s, r) => s + r.scores.overall, 0) / compCondResults.length,
        avgPropCorrectness:
          compCondResults.reduce((s, r) => s + r.scores.propCorrectness, 0) /
          compCondResults.length,
        avgInputTokens:
          compCondResults.reduce((s, r) => s + r.inputTokens, 0) / compCondResults.length,
      };
    }
  }

  const report: ComparativeReport = {
    timestamp: new Date().toISOString(),
    model: MODEL_LABEL,
    type: "comparative",
    results,
    summary: { byCondition, byComponent, tokenEfficiency },
  };

  const modelSlug = USE_GEMINI ? "gemini" : "claude";
  const outPath = `${RESULTS_DIR}/comparative-${modelSlug}-${Date.now()}.json`;
  writeFileSync(outPath, JSON.stringify(report, null, 2));

  // Push to Supabase
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { supabase } = await import("./supabase.js");
      const raw = report.summary.byCondition["raw-source-only"] ?? {};
      const desc = report.summary.byCondition["descriptor-only"] ?? {};
      const rawEff = report.summary.tokenEfficiency["raw-source-only"] ?? {};
      const descEff = report.summary.tokenEfficiency["descriptor-only"] ?? {};

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
          total_results: results.length,
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
        console.error(`  Supabase run insert error: ${runError.message}`);
      } else {
        const compStats = [];
        for (const [comp, conds] of Object.entries(report.summary.byComponent)) {
          for (const [cond, stats] of Object.entries(
            conds as Record<
              string,
              { avgOverall: number; avgPropCorrectness: number; avgInputTokens: number }
            >,
          )) {
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
          console.error(`  Supabase stats insert error: ${statsError.message}`);
        }

        // Insert basic-usage stats for the snapshot selector
        const slugify = (name: string) =>
          name
            .replace(/([A-Z])/g, "-$1")
            .toLowerCase()
            .replace(/^-/, "");
        const usageStats = results
          .filter((r) => r.prompt === "basic-usage")
          .map((r) => ({
            run_id: runData.id,
            component: slugify(r.component),
            condition: r.condition,
            input_tokens: r.inputTokens,
            output_tokens: r.outputTokens,
            overall: r.scores.overall,
            prop_correctness: r.scores.propCorrectness,
            iterations: r.iterations ?? 1,
          }));
        const { error: usageError } = await supabase.from("eval_usage_stats").insert(usageStats);
        if (usageError) {
          console.error(`  Supabase usage stats insert error: ${usageError.message}`);
        } else {
          console.log(`  Supabase: saved run ${runData.id}\n`);
        }
      }
    } catch (err) {
      console.error(`  Supabase error: ${(err as Error).message}`);
    }
  }

  // Print summary
  console.log("\n  ── Summary ──\n");
  for (const [cond, stats] of Object.entries(byCondition)) {
    console.log(
      `  ${cond.padEnd(22)} | Overall: ${(stats.avgOverall * 100).toFixed(0)}% | Props: ${(stats.avgPropCorrectness * 100).toFixed(0)}% | Import: ${(stats.importRate * 100).toFixed(0)}% | TS: ${(stats.tsRate * 100).toFixed(0)}% | Avg tokens: ${stats.avgInputTokens.toFixed(0)}`,
    );
  }

  console.log("\n  ── Token Efficiency ──\n");
  for (const [cond, eff] of Object.entries(tokenEfficiency)) {
    console.log(
      `  ${cond.padEnd(22)} | ${eff.avgInputTokens.toFixed(0)} avg tokens | ${(eff.avgOverall * 100).toFixed(0)}% score | ${eff.scorePerKToken.toFixed(2)} score/k-token`,
    );
  }

  console.log("\n  ── Per Component ──\n");
  for (const [comp, conds] of Object.entries(byComponent)) {
    for (const [cond, stats] of Object.entries(conds)) {
      console.log(
        `  ${comp.padEnd(18)} ${cond.padEnd(22)} | Overall: ${(stats.avgOverall * 100).toFixed(0)}% | Props: ${(stats.avgPropCorrectness * 100).toFixed(0)}% | Tokens: ${stats.avgInputTokens.toFixed(0)}`,
      );
    }
  }

  console.log(`\n  Results: ${outPath}\n`);
  console.log("  Generate report: pnpm eval:report:comparative\n");
}

runComparativeEval().catch(console.error);
