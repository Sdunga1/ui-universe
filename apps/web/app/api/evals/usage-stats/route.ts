import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

// GET /api/evals/usage-stats?runId=<uuid>
// Returns per-component per-condition stats for a specific run
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get("runId");

  if (!runId) {
    return NextResponse.json({ error: "runId required" }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({ stats: {} });
  }

  const { data, error } = await supabase
    .from("eval_usage_stats")
    .select(
      "component, condition, input_tokens, output_tokens, overall, prop_correctness, iterations",
    )
    .eq("run_id", runId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Shape into the same structure as stats.json:
  // { [component]: { "raw-source": {...}, "descriptor": {...} } }
  const result: Record<
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
  > = {};

  for (const row of data ?? []) {
    if (!result[row.component]) result[row.component] = {};
    const condKey = row.condition === "raw-source-only" ? "raw-source" : "descriptor";
    // biome-ignore lint/style/noNonNullAssertion: assigned on the line above
    result[row.component]![condKey] = {
      inputTokens: row.input_tokens ?? 0,
      outputTokens: row.output_tokens ?? 0,
      overall: row.overall ?? 0,
      propCorrectness: row.prop_correctness ?? 0,
      iterations: row.iterations ?? 1,
    };
  }

  return NextResponse.json({ stats: result });
}
