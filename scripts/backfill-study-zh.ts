/**
 * study_blog_posts の全記事に content.zh を生成してバックフィルする
 *
 * 動作:
 *   (引数なし)  content.zh が未設定の記事を順次処理（draft 更新）
 *   --publish-only  content.zh 生成済みの draft を一括 publish
 *   --verify        機械検証のみ（DB 書き込みなし）
 *
 * 安全設計:
 *   - is_published の変更は --publish-only のみ行う
 *   - example.com を含む JA 行は翻訳前に除去
 *   - 品質チェック失敗時はスキップして次の記事へ（エラー終了しない）
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

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

const PUBLISH_ONLY = process.argv.includes("--publish-only");
const VERIFY_ONLY  = process.argv.includes("--verify");
const BATCH_SIZE   = 1; // 順次処理（TPM 制限対策）
const REQUEST_DELAY_MS = 3000; // リクエスト間隔（ms）

const REFUSAL_PATTERNS = [
  "申し訳ありません", "I cannot", "I'm sorry", "As an AI", "I'm unable",
  "cannot access the internet", "インターネットへのアクセス", "我无法", "对不起", "很抱歉",
];

// ─── 前処理 ───────────────────────────────────────────────────────────────────

function cleanJaForTranslation(ja: string): string {
  return ja.split("\n").filter(line => !line.includes("example.com")).join("\n");
}

function cleanZhOutput(zh: string): string {
  // GPT が付加する「## 文章标题 / ## 中文翻译」ヘッダーを除去
  return zh
    .replace(/^[\s\S]*?##\s*(?:中文翻译|文章内容|翻译内容)\s*\n/, "")
    .replace(/^##\s*文章标题[^\n]*\n[^\n]*\n\n?/, "")
    .trim();
}

// ─── 生成 ─────────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generateZhWithRetry(ja: string, jaTitle: string, retries = 3): Promise<string> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await generateZh(ja, jaTitle);
    } catch (e: unknown) {
      const msg = (e as Error).message ?? "";
      if (msg.includes("429") && attempt < retries - 1) {
        const waitMs = 15000 * (attempt + 1); // 15s / 30s / 45s
        await sleep(waitMs);
        continue;
      }
      throw e;
    }
  }
  throw new Error("リトライ上限到達");
}

async function generateZh(ja: string, jaTitle: string): Promise<string> {
  const jaClean = cleanJaForTranslation(ja);
  const prompt = `以下は日本語の留学情報記事です。同じ構成・見出し順序を維持しながら、中国語（简体字）に翻訳してください。

## 翻訳ルール
- 見出し（###）は構造を維持し日本語→中国語に翻訳すること
- 数値・費用・固有名詞はそのまま（日本語名称は中国語の一般的な表記に変換可）
- URLは変更しない（https://study.moveworthapp.com/simulate 等）
- 「MoveWorth.study」は「MoveWorth.study」のまま維持
- 文体は丁寧体（正式な情報記事として）
- 参考資料セクションがある場合はそのまま維持
- 創作や追加情報は一切加えないこと

## 記事タイトル
${jaTitle}

## 日本語原文
${jaClean.slice(0, 6000)}

中国語本文のみ返すこと（タイトル・説明文・メタ情報不要）。見出し（###）から始めること。`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 3000,
  });
  return cleanZhOutput(res.choices[0].message.content ?? "");
}

// ─── 品質チェック ─────────────────────────────────────────────────────────────

interface QcResult { pass: boolean; issues: string[] }

function qualityCheck(zh: string, ja: string): QcResult {
  const issues: string[] = [];
  if (zh.length < 300) issues.push(`短すぎ: ${zh.length}字`);
  if (zh.length < ja.length * 0.3) issues.push(`JA比率低: zh=${zh.length} ja=${ja.length}`);
  if (zh.includes("example.com")) issues.push("example.com 混入");
  for (const p of REFUSAL_PATTERNS) {
    if (zh.includes(p)) issues.push(`拒否パターン: "${p}"`);
  }
  const jaH = (ja.match(/^###\s/gm) ?? []).length;
  const zhH = (zh.match(/^###\s/gm) ?? []).length;
  if (jaH > 0 && Math.abs(jaH - zhH) > 2) issues.push(`見出し数差大: ja=${jaH} zh=${zhH}`);
  return { pass: issues.length === 0, issues };
}

// ─── バックフィルモード ───────────────────────────────────────────────────────

async function backfill() {
  // zh 未生成の全記事を取得（content に zh キーがない or content.zh が空）
  const { data: allRows, error } = await sb
    .from("study_blog_posts")
    .select("slug, title, content, is_published")
    .order("slug");
  if (error) { console.error("❌ 取得失敗:", error.message); process.exit(1); }

  const targets = (allRows ?? []).filter((r) => {
    const c = r.content as Record<string, string>;
    return !c?.zh || c.zh.trim() === "";
  });

  console.log(`\n=== study zh バックフィル ===`);
  console.log(`対象: ${targets.length}件 / 全${(allRows ?? []).length}件`);

  let passed = 0, skipped = 0;
  const failedSlugs: string[] = [];

  // 順次処理（TPM 制限対策 + リクエスト間隔）
  for (let i = 0; i < targets.length; i += BATCH_SIZE) {
    const batch = targets.slice(i, i + BATCH_SIZE);
    if (i > 0) await sleep(REQUEST_DELAY_MS);
    await Promise.all(batch.map(async (row) => {
      const slug: string = row.slug;
      const content = row.content as Record<string, string>;
      const ja = content.ja ?? "";
      const jaTitle = (row.title as Record<string, string>).ja ?? slug;

      try {
        const zh = await generateZhWithRetry(ja, jaTitle);
        const { pass, issues } = qualityCheck(zh, ja);

        if (!pass) {
          console.error(`  ❌ ${slug}: ${issues.join(", ")}`);
          failedSlugs.push(slug);
          skipped++;
          return;
        }

        // content を zh 追加した形で更新
        const newContent = { ...content, zh };
        const { error: updateErr } = await sb
          .from("study_blog_posts")
          .update({ content: newContent })
          .eq("slug", slug);
        if (updateErr) {
          console.error(`  ❌ ${slug} 更新失敗:`, updateErr.message);
          failedSlugs.push(slug);
          skipped++;
          return;
        }

        console.log(`  ✅ ${slug}  ZH: ${zh.length}字`);
        passed++;
      } catch (e: unknown) {
        console.error(`  ❌ ${slug} 例外:`, (e as Error).message);
        failedSlugs.push(slug);
        skipped++;
      }
    }));
  }

  console.log(`\n=== バックフィル完了 ===`);
  console.log(`✅ 成功: ${passed}件 / ❌ スキップ: ${skipped}件`);
  if (failedSlugs.length > 0) {
    console.log("スキップ一覧:");
    failedSlugs.forEach(s => console.log(`  - ${s}`));
  }
}

// ─── 機械検証モード ───────────────────────────────────────────────────────────

async function verify() {
  const { data: allRows } = await sb
    .from("study_blog_posts")
    .select("slug, content, is_published")
    .order("slug");

  let ok = 0, ng = 0;
  const issues: { slug: string; problems: string[] }[] = [];

  for (const row of allRows ?? []) {
    const c = row.content as Record<string, string>;
    const zh = c?.zh ?? "";
    const ja = c?.ja ?? "";
    const problems: string[] = [];

    if (!zh || zh.trim() === "") {
      problems.push("zh 未生成");
    } else {
      const { issues: qcIssues } = qualityCheck(zh, ja);
      problems.push(...qcIssues);
    }

    if (problems.length > 0) {
      ng++;
      issues.push({ slug: row.slug, problems });
    } else {
      ok++;
    }
  }

  console.log(`\n=== study zh 機械検証 ===`);
  console.log(`✅ 通過: ${ok}件 / ❌ 問題あり: ${ng}件`);
  if (issues.length > 0) {
    console.log("\n問題あり記事:");
    for (const { slug, problems } of issues) {
      console.log(`  ${slug}: ${problems.join(", ")}`);
    }
  }
  return ng;
}

// ─── publish-only モード ──────────────────────────────────────────────────────

async function publishOnly() {
  // zh 生成済みかつ is_published=false の記事を公開
  const { data: allRows } = await sb
    .from("study_blog_posts")
    .select("slug, content, is_published")
    .eq("is_published", false);

  const publishTargets = (allRows ?? []).filter((r) => {
    const c = r.content as Record<string, string>;
    return c?.zh && c.zh.trim() !== "";
  });

  if (publishTargets.length === 0) {
    console.log("✅ 公開待ちのdraft（zh生成済み）が見つかりません");
    return;
  }

  // 機械検証パスした記事のみ公開
  let published = 0, skipped = 0;
  const failedSlugs: string[] = [];

  for (const row of publishTargets) {
    const c = row.content as Record<string, string>;
    const { pass, issues } = qualityCheck(c.zh, c.ja ?? "");
    if (!pass) {
      console.error(`  ❌ 公開スキップ ${row.slug}: ${issues.join(", ")}`);
      failedSlugs.push(row.slug);
      skipped++;
      continue;
    }
    const { error } = await sb
      .from("study_blog_posts")
      .update({ is_published: true })
      .eq("slug", row.slug);
    if (error) {
      console.error(`  ❌ 公開失敗 ${row.slug}:`, error.message);
      skipped++;
      continue;
    }
    console.log(`  ✅ 公開: ${row.slug}`);
    published++;
  }

  console.log(`\n✅ 公開: ${published}件 / ❌ スキップ: ${skipped}件`);
  if (failedSlugs.length > 0) {
    console.log("個別確認が必要なslug:", failedSlugs.join(", "));
  }
}

// ─── エントリーポイント ───────────────────────────────────────────────────────

async function main() {
  if (VERIFY_ONLY) {
    const ng = await verify();
    process.exit(ng > 0 ? 1 : 0);
  } else if (PUBLISH_ONLY) {
    await publishOnly();
  } else {
    await backfill();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
