import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function main() {
  const { data } = await sb.from("blog_posts").select("content").eq("slug", "spain-digital-nomad-visa-guide-2026").single();
  if (!data) { console.error("not found"); process.exit(1); }
  const c = data.content as Record<string, string>;
  for (const lang of ["en", "zh"] as const) {
    const m = (c[lang] ?? "").match(/(?:Living Costs|生活费)[^\n]*\n[\s\S]*?(?=\n###|$)/i)
           ?? (c[lang] ?? "").match(/24%[\s\S]{0,300}/);
    console.log(`\n[${lang}] 税制周辺:\n${m?.[0] ?? "(マッチなし)"}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
