-- uiUniverse Eval Schema
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/_/sql

-- ── Tables ──

create table if not exists eval_runs (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz default now(),
  run_timestamp    timestamptz not null,
  model            text not null,
  model_slug       text not null,        -- 'claude' | 'gemini'
  total_results    integer not null default 0,

  -- raw-source-only condition
  raw_avg_overall          float8,
  raw_avg_prop_correctness float8,
  raw_import_rate          float8,
  raw_ts_rate              float8,
  raw_avg_input_tokens     float8,
  raw_score_per_k_token    float8,

  -- descriptor-only condition
  desc_avg_overall          float8,
  desc_avg_prop_correctness float8,
  desc_import_rate          float8,
  desc_ts_rate              float8,
  desc_avg_input_tokens     float8,
  desc_score_per_k_token    float8,

  -- derived metrics
  token_ratio    float8,
  efficiency_gain float8
);

create table if not exists eval_component_stats (
  id                   uuid primary key default gen_random_uuid(),
  run_id               uuid not null references eval_runs(id) on delete cascade,
  component            text not null,
  condition            text not null,   -- 'raw-source-only' | 'descriptor-only'
  avg_overall          float8,
  avg_prop_correctness float8,
  avg_input_tokens     float8
);

create index if not exists eval_component_stats_run_id_idx
  on eval_component_stats(run_id);

-- Per-component, per-condition stats for the basic-usage prompt
-- Used to power the snapshot selector in the live comparison UI
create table if not exists eval_usage_stats (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references eval_runs(id) on delete cascade,
  component       text not null,   -- 'counter', 'circular-gallery', etc.
  condition       text not null,   -- 'raw-source-only' | 'descriptor-only'
  input_tokens    integer,
  output_tokens   integer,
  overall         float8,
  prop_correctness float8,
  iterations      integer default 1
);

create index if not exists eval_usage_stats_run_id_idx
  on eval_usage_stats(run_id);

-- ── Row Level Security ──

alter table eval_runs enable row level security;
alter table eval_component_stats enable row level security;

-- Public read access (for the website)
create policy "public read eval_runs"
  on eval_runs for select using (true);

create policy "public read eval_component_stats"
  on eval_component_stats for select using (true);

alter table eval_usage_stats enable row level security;

create policy "public read eval_usage_stats"
  on eval_usage_stats for select using (true);
