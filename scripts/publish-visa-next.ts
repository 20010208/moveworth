/**
 * 最新の draft visa-{code} を公開する
 * GHA publish-visa.yml (月曜09:00) から呼び出す
 *
 * 安全策:
 *   - 品質チェック（example.com / GPT拒否 / 短すぎ）を通過したもののみ公開
 *   - 通過ゼロ → process.exit(0) でスキップ（エラーなし）
 *   - created_at DESC で最新1件を対象（古い週の記事を誤拾いしない）
 */
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

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const REFUSAL = ["申し訳ありません", "I cannot", "I'm sorry", "As an AI", "I'm unable"];

function qualityOk(content: Record<string, string>): { ok: boolean; reason?: string } {
  const ja = content.ja ?? "";
  const en = content.en ?? "";
  if (ja.length < 200) return { ok: false, reason: `content.ja 短すぎ (${ja.length}文字)` };
  if (en.length < 200) return { ok: false, reason: `content.en 短すぎ (${en.length}文字)` };
  if (ja.includes("example.com") || en.includes("example.com"))
    return { ok: false, reason: "example.com 混入" };
  for (const p of REFUSAL)
    if (ja.includes(p) || en.includes(p))
      return { ok: false, reason: `GPT拒否パターン: "${p}"` };
  return { ok: true };
}

async function main() {
  // draft visa-{code} を created_at 降順で全件取得（最新順）
  const { data, error } = await sb
    .from("blog_posts")
    .select("slug, content, created_at")
    .like("slug", "visa-%")
    .eq("is_published", false)
    .order("created_at", { ascending: false });

  if (error) { console.error("取得エラー:", error.message); process.exit(1); }
  if (!data || data.length === 0) {
    console.log("⏭ draft visa 記事なし → スキップ");
    process.exit(0);
  }

  console.log(`draft visa 候補: ${data.length}件（最新から検査）`);

  for (const r of data) {
    const content = r.content as Record<string, string> ?? {};
    const q = qualityOk(content);
    if (!q.ok) {
      console.log(`  ⏭ ${r.slug}: 品質NG (${q.reason}) → スキップ`);
      continue;
    }

    // 最初に品質OKの記事を公開
    const today = new Date().toISOString().slice(0, 10);
    const { error: upErr } = await sb
      .from("blog_posts")
      .update({ is_published: true, published_at: today })
      .eq("slug", r.slug);

    if (upErr) { console.error(`公開失敗 ${r.slug}:`, upErr.message); process.exit(1); }
    console.log(`✅ 公開: ${r.slug} (published_at=${today})`);
    process.exit(0);
  }

  console.log("⏭ 品質チェックを通過した draft visa なし → スキップ");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
