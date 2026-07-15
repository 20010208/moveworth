/**
 * 昨日（月曜）公開された visa-{code} と同国の study-country-{code} を公開する
 * GHA publish-study-country.yml (火曜09:00) から呼び出す
 *
 * 安全策:
 *   - published_at = 厳密に昨日の日付（範囲ではなく exact）
 *   - 該当 visa なし → スキップ（エラーなし）
 *   - study-country-{code} が存在しない / 既に公開済み → スキップ
 *   - 品質チェック通過しないものは公開しない
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
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const targetDate = yesterday.toISOString().slice(0, 10);

  console.log(`対象日付（昨日=月曜）: ${targetDate}`);

  // 昨日公開された visa-{code} を1件取得（exact date match）
  const { data: visas } = await sb
    .from("blog_posts")
    .select("slug, published_at")
    .like("slug", "visa-%")
    .eq("is_published", true)
    .eq("published_at", targetDate)
    .order("published_at", { ascending: false })
    .limit(1);

  if (!visas || visas.length === 0) {
    console.log(`⏭ ${targetDate} に公開された visa なし → スキップ`);
    process.exit(0);
  }

  const visaSlug = visas[0].slug;
  const code = visaSlug.replace("visa-", "");
  const targetSlug = `study-country-${code}`;
  console.log(`対象: ${visaSlug} → ${targetSlug}`);

  // study-country-{code} の状態確認
  const { data: sc } = await sb
    .from("study_blog_posts")
    .select("slug, is_published, content")
    .eq("slug", targetSlug)
    .single();

  if (!sc) {
    console.log(`⏭ ${targetSlug} が存在しない → スキップ`);
    process.exit(0);
  }
  if (sc.is_published) {
    console.log(`⏭ ${targetSlug} は既に公開済み → スキップ`);
    process.exit(0);
  }

  const content = sc.content as Record<string, string> ?? {};
  const q = qualityOk(content);
  if (!q.ok) {
    console.error(`❌ ${targetSlug}: 品質NG (${q.reason}) → 公開中止`);
    process.exit(1);
  }

  const { error } = await sb
    .from("study_blog_posts")
    .update({ is_published: true })
    .eq("slug", targetSlug);

  if (error) { console.error("公開失敗:", error.message); process.exit(1); }
  console.log(`✅ 公開: ${targetSlug}`);
}

main().catch(e => { console.error(e); process.exit(1); });
