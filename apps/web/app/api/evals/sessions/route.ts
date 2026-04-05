import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

const SESSION_GAP_MS = 30 * 60 * 1000; // 30 min

export interface EvalSession {
  id: string; // earliest run timestamp in the session
  date: string; // ISO string
  models: string[]; // ['claude', 'gemini']
  runIds: Record<string, string>; // model_slug → run_id
}

export async function GET() {
  const { data: runs, error } = await supabase
    .from("eval_runs")
    .select("id, run_timestamp, model_slug")
    .order("run_timestamp", { ascending: false });

  if (error || !runs?.length) {
    return NextResponse.json({ sessions: [] });
  }

  // Group runs into sessions (runs within 30 min of each other = same session)
  const sessions: EvalSession[] = [];

  for (const run of runs) {
    const ts = new Date(run.run_timestamp).getTime();
    const match = sessions.find(
      (s) =>
        s.runIds &&
        Object.keys(s.runIds).length > 0 &&
        Math.abs(new Date(s.date).getTime() - ts) < SESSION_GAP_MS,
    );

    if (match) {
      match.runIds[run.model_slug] = run.id;
      if (!match.models.includes(run.model_slug)) match.models.push(run.model_slug);
    } else {
      sessions.push({
        id: run.run_timestamp,
        date: run.run_timestamp,
        models: [run.model_slug],
        runIds: { [run.model_slug]: run.id },
      });
    }
  }

  return NextResponse.json({ sessions });
}
