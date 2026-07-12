import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const sql = `
create table if not exists country_sources (
  id               uuid primary key default gen_random_uuid(),
  country_code     text not null,
  purpose          text not null check (purpose in ('visa', 'study', 'general')),
  url              text not null,
  last_verified_at timestamptz,
  status           text not null default 'unknown' check (status in ('alive', 'dead', 'unknown')),
  source           text not null default 'ai_suggested' check (source in ('ai_suggested', 'manual')),
  created_at       timestamptz not null default now(),
  unique (country_code, url)
);
create index if not exists country_sources_country_code_idx on country_sources (country_code);
create index if not exists country_sources_status_idx on country_sources (status);
`;

async function run() {
  const { error } = await supabase.rpc("exec_sql", { sql });
  if (error) {
    console.error("RPC exec_sql 未対応のため、Supabase SQL Editor で以下を実行してください:");
    console.log("\n--- supabase/create_country_sources.sql ---");
    console.log(sql);
    process.exit(1);
  }
  console.log("✅ country_sources テーブルを作成しました");
}

run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
