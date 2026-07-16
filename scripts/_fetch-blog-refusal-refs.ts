/**
 * blog_posts 拒否パターン混入10件の参考資料全文取得（パッチ設計用）
 */
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

const REFUSAL_RE = /申し訳ありませんが|I'?m sorry/i;
const REF_SECTION_RE = /### 参考資料[\s\S]*$/;

async function main() {
  const { data } = await sb
    .from("blog_posts")
    .select("slug, title, content")
    .eq("is_published", true)
    .order("slug");

  if (!data) { process.exit(1); }

  const affected = data.filter(r => {
    const c = (r.content ?? {}) as Record<string, string>;
    return Object.values(c).some(txt => REFUSAL_RE.test(txt ?? ""));
  });

  console.log(`拒否混入: ${affected.length}件\n`);
  for (const r of affected) {
    const c = (r.content ?? {}) as Record<string, string>;
    const t = (r.title ?? {}) as Record<string, string>;
    console.log(`\n${"═".repeat(70)}`);
    console.log(`slug: ${r.slug}`);
    console.log(`title(ja): ${t.ja ?? "(none)"}`);

    const ja = c.ja ?? "";
    // 拒否テキスト位置
    const refusalMatch = ja.match(/申し訳ありませんが[\s\S]*?(?=\n\n)/);
    if (refusalMatch) {
      console.log(`\n[拒否テキスト]: "${refusalMatch[0].slice(0, 100)}..."`);
    }
    // 参考資料セクション全体
    const refMatch = ja.match(REF_SECTION_RE);
    if (refMatch) {
      console.log(`\n[参考資料]:\n${refMatch[0]}`);
    } else {
      console.log(`\n[参考資料]: なし`);
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });
