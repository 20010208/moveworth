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
  const { data } = await sb
    .from("blog_posts")
    .select("content")
    .eq("slug", "nordvpn-overseas-japanese-guide-2026")
    .single();
  if (!data) { console.error("not found"); process.exit(1); }
  const ja = (data.content as Record<string, string>).ja ?? "";
  // 拒否テキスト前後300字を出力
  const RE = /申し訳ありませんが、実在する正確なURLを提供することはできません。.{0,500}/;
  const m = ja.match(RE);
  if (!m) { console.log("拒否テキストなし"); return; }
  const idx = ja.indexOf(m[0]);
  console.log(`=== 拒否テキスト開始位置: ${idx}字目 ===`);
  console.log(`=== 前200字 ===`);
  console.log(JSON.stringify(ja.slice(Math.max(0, idx - 200), idx)));
  console.log(`=== 拒否テキスト ===`);
  console.log(JSON.stringify(m[0]));
  console.log(`=== 後200字 ===`);
  console.log(JSON.stringify(ja.slice(idx + m[0].length, idx + m[0].length + 200)));
  console.log(`\n全文長: ${ja.length}字`);
}
main().catch(e => { console.error(e); process.exit(1); });
