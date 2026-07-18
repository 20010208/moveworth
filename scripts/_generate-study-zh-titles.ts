/**
 * study_blog_posts の title.zh / description.zh を JA からバッチ翻訳
 *
 * 引数なし   : content.zh ありかつ title.zh 未設定の全件を処理（DB書き込みあり）
 * --dry-run  : 指定スラグのみ翻訳結果を標準出力（DB書き込みなし）
 * --slugs X,Y,Z : 対象スラグをカンマ区切りで指定
 */
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { readFileSync, existsSync } from "fs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const DRY_RUN = process.argv.includes("--dry-run");
const slugsArg = process.argv.find((a) => a.startsWith("--slugs="))?.replace("--slugs=", "");
const TARGET_SLUGS = slugsArg ? slugsArg.split(",") : null;

const REFUSAL_PATTERNS = ["申し訳", "I cannot", "我无法", "对不起", "很抱歉", "As an AI"];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function translateTitleDesc(titleJa: string, descJa: string): Promise<{ titleZh: string; descZh: string }> {
  const prompt = `以下の日本語のタイトルと説明文を、中国語（简体字）に翻訳してください。
翻訳ルール:
- 日本語の意味を正確に伝える自然な中国語にしてください
- 「【〇〇】」形式の装飾タグは中国語の習慣に合わせて調整可（「【〇〇】」のまま維持でも可）
- 固有名詞（MoveWorth.study, 国名等）は適切な中国語表記に
- 文体は丁寧・情報的（記事説明として自然な中国語）
- 数字・年号はそのまま
- JSON形式で返すこと

入力:
{
  "title_ja": "${titleJa.replace(/"/g, '\\"')}",
  "description_ja": "${descJa.replace(/"/g, '\\"')}"
}

出力形式（JSON）:
{
  "title_zh": "中国語タイトル",
  "description_zh": "中国語説明文"
}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const parsed = JSON.parse(res.choices[0].message.content!);
  return { titleZh: parsed.title_zh ?? "", descZh: parsed.description_zh ?? "" };
}

function qualityCheck(titleZh: string, descZh: string): string[] {
  const issues: string[] = [];
  if (!titleZh || titleZh.trim().length < 5) issues.push("title.zh が短すぎ");
  if (!descZh || descZh.trim().length < 20) issues.push("description.zh が短すぎ");
  for (const p of REFUSAL_PATTERNS) {
    if (titleZh.includes(p) || descZh.includes(p)) issues.push(`拒否パターン: "${p}"`);
  }
  if (titleZh.includes("example.com") || descZh.includes("example.com")) issues.push("example.com 混入");
  return issues;
}

async function main() {
  // 対象取得: content.zh あり かつ title.zh 未設定
  let query = sb.from("study_blog_posts")
    .select("slug,title,description,content")
    .order("slug");

  if (TARGET_SLUGS) {
    query = query.in("slug", TARGET_SLUGS) as typeof query;
  }

  const { data: all, error } = await query;
  if (error || !all) { console.error("取得失敗:", error?.message); process.exit(1); }

  const targets = all.filter((r) => {
    const c = r.content as Record<string, string>;
    const t = r.title as Record<string, string>;
    const hasZhContent = c?.zh && c.zh.trim().length > 50;
    const needsZhTitle = !t?.zh || t.zh.trim().length < 3;
    return hasZhContent && needsZhTitle;
  });

  console.log(`\n=== title.zh / description.zh 生成 ${DRY_RUN ? "[DRY-RUN]" : "[書き込みあり]"} ===`);
  console.log(`対象: ${targets.length}件\n`);

  let ok = 0, skipped = 0;

  for (let i = 0; i < targets.length; i++) {
    const row = targets[i];
    const slug = row.slug as string;
    const t = row.title as Record<string, string>;
    const d = row.description as Record<string, string>;

    if (i > 0) await sleep(1500);

    try {
      const { titleZh, descZh } = await translateTitleDesc(t.ja, d.ja);
      const issues = qualityCheck(titleZh, descZh);

      if (issues.length > 0) {
        console.error(`  ❌ ${slug}: ${issues.join(", ")}`);
        skipped++;
        continue;
      }

      if (DRY_RUN) {
        console.log(`\n[${slug}]`);
        console.log(`  title.ja:  ${t.ja}`);
        console.log(`  title.zh:  ${titleZh}`);
        console.log(`  desc.ja:   ${d.ja?.slice(0, 80)}...`);
        console.log(`  desc.zh:   ${descZh?.slice(0, 80)}...`);
        ok++;
      } else {
        const newTitle = { ...t, zh: titleZh };
        const newDesc = { ...d, zh: descZh };
        const { error: upErr } = await sb.from("study_blog_posts")
          .update({ title: newTitle, description: newDesc })
          .eq("slug", slug);
        if (upErr) {
          console.error(`  ❌ ${slug} 更新失敗: ${upErr.message}`);
          skipped++;
        } else {
          console.log(`  ✅ ${slug}`);
          console.log(`       title.zh: ${titleZh}`);
          ok++;
        }
      }
    } catch (e) {
      console.error(`  ❌ ${slug} 例外: ${(e as Error).message}`);
      skipped++;
    }
  }

  console.log(`\n=== 完了: ✅ ${ok}件 / ❌ ${skipped}件 ===`);
}

main().catch(e => { console.error(e); process.exit(1); });
