/**
 * 5日前（月曜）公開された visa-{code} と同国の就労記事を公開する
 * GHA publish-study-work.yml (土曜09:00) から呼び出す
 *
 * slug 優先順位:
 *   1. study-work-{code} （旧形式・公開済みなら既に完了）
 *   2. study-{code}（新形式）
 *
 * 安全策:
 *   - published_at = 5日前の exact date
 *   - 該当 visa なし → スキップ
 *   - study-work-{code} が既に公開済みなら → スキップ
 *   - study-{code} も見つからない / 既公開 → スキップ
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

async function tryPublish(table: string, slug: string): Promise<"published" | "skip" | "quality_fail"> {
  const { data } = await sb
    .from(table)
    .select("slug, is_published, content")
    .eq("slug", slug)
    .single();

  if (!data) return "skip";
  if (data.is_published) { console.log(`⏭ ${slug}: 既に公開済み → スキップ`); return "skip"; }

  const content = data.content as Record<string, string> ?? {};
  const q = qualityOk(content);
  if (!q.ok) {
    console.error(`❌ ${slug}: 品質NG (${q.reason}) → 公開中止`);
    return "quality_fail";
  }

  const { error } = await sb.from(table).update({ is_published: true }).eq("slug", slug);
  if (error) { console.error(`公開失敗 ${slug}:`, error.message); return "quality_fail"; }
  console.log(`✅ 公開: ${slug}`);
  return "published";
}

async function main() {
  const targetDay = new Date();
  targetDay.setDate(targetDay.getDate() - 5); // 土曜から5日前 = 月曜
  const targetDate = targetDay.toISOString().slice(0, 10);

  console.log(`対象日付（5日前=月曜）: ${targetDate}`);

  // 5日前に公開された visa-{code} を1件取得
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
  console.log(`対象 visa: ${visaSlug}`);

  // study-work-{code} を優先して試みる（既に公開済みの旧形式）
  const workSlug = `study-work-${code}`;
  const result1 = await tryPublish("study_blog_posts", workSlug);
  if (result1 === "published" || result1 === "quality_fail") process.exit(result1 === "quality_fail" ? 1 : 0);

  // フォールバック: study-{code}（新形式）
  const newSlug = `study-${code}`;
  const result2 = await tryPublish("study_blog_posts", newSlug);
  if (result2 === "published") process.exit(0);
  if (result2 === "quality_fail") process.exit(1);

  console.log(`⏭ ${workSlug} / ${newSlug} いずれも存在しないか既公開 → スキップ`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
