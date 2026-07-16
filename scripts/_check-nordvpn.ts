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

const REFUSAL_RE = /申し訳ありませんが|I'm sorry.*can'?t|I cannot assist|実在する正確なURL/i;

async function main() {
  const { data } = await sb
    .from("blog_posts")
    .select("slug, content, locales")
    .eq("slug", "nordvpn-overseas-japanese-guide-2026")
    .single();

  if (!data) { console.error("レコードが見つかりません"); process.exit(1); }

  const c = data.content as Record<string, string>;
  for (const lang of ["ja", "en", "zh"] as const) {
    const text = c?.[lang] ?? "";
    const hit = text.match(REFUSAL_RE);
    const len = text.trim().length;
    if (hit) {
      // 前後100字のコンテキスト
      const idx = text.search(REFUSAL_RE);
      const ctx = text.slice(Math.max(0, idx - 80), idx + hit[0].length + 80).replace(/\n/g, " ");
      console.log(`[${lang}] ❌ 拒否パターン検出 (${len}字)`);
      console.log(`  位置: ${idx}字目`);
      console.log(`  文脈: 「…${ctx}…」`);
    } else {
      console.log(`[${lang}] ✅ 拒否パターンなし (${len}字)`);
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });
