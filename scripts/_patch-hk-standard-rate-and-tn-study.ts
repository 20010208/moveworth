/**
 * 2件のDBパッチ:
 *  1. visa-hk: 標準税率を 15% → 二段階制（15%/16%）に修正 (JA/EN/ZH)
 *  2. study-country-tn / study-work-tn: JA本文の example.com 行を削除し安全文言に差し替え
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

// ─── 1. visa-hk 標準税率修正 ──────────────────────────────────────────────────

const HK_FIXES: Record<"ja" | "en" | "zh", [string, string]> = {
  ja: [
    "- 標準税率（2024/25年度）：15%",
    "- 標準税率（2024/25年度以降）：最初のHK$5,000,000は15%、超過分は16%（二段階制）",
  ],
  en: [
    "- Standard Rate: 15% for the 2024/25 tax year.",
    "- Standard Rate (from 2024/25): 15% on the first HK$5,000,000 of net income; 16% on the remainder (two-tier structure).",
  ],
  zh: [
    "- 标准税率：15%（2024/25年度）",
    "- 标准税率（2024/25年度起）：首HK$5,000,000适用15%，超出部分适用16%（两级制）",
  ],
};

async function patchHkStandardRate() {
  const { data, error } = await sb
    .from("blog_posts")
    .select("content")
    .eq("slug", "visa-hk")
    .single();
  if (error || !data) { console.error("visa-hk 取得失敗:", error?.message); return; }

  const content = data.content as Record<string, string>;
  let changed = false;

  for (const lang of ["ja", "en", "zh"] as const) {
    const [from, to] = HK_FIXES[lang];
    if (content[lang]?.includes(from)) {
      content[lang] = content[lang].replace(from, to);
      console.log(`  ✅ [${lang}] 置換: 「${from}」→「${to}」`);
      changed = true;
    } else {
      console.log(`  ⚠️  [${lang}] 対象テキスト未発見（スキップ）`);
    }
  }

  if (!changed) { console.log("visa-hk: 変更なし"); return; }

  const { error: updateErr } = await sb
    .from("blog_posts")
    .update({ content })
    .eq("slug", "visa-hk");
  if (updateErr) {
    console.error("visa-hk 更新失敗:", updateErr.message);
  } else {
    console.log("  ✅ visa-hk DB更新完了");
  }
}

// ─── 2. TN study記事 example.com 除去 ──────────────────────────────────────────

const TN_EMBASSY_NOTE_JA =
  "- 留学・ビザ手続きの詳細は在日チュニジア大使館または公式機関にお問い合わせください";

async function patchTnStudyExampleCom(slug: string) {
  const { data, error } = await sb
    .from("study_blog_posts")
    .select("content, is_published")
    .eq("slug", slug)
    .single();
  if (error || !data) { console.error(`${slug} 取得失敗:`, error?.message); return; }

  const content = data.content as Record<string, string>;
  const ja = content.ja ?? "";

  // example.com を含む行をすべて削除
  const lines = ja.split("\n");
  const removedLines: string[] = [];
  const cleanedLines = lines.filter(line => {
    if (line.includes("example.com")) {
      removedLines.push(line.trim());
      return false;
    }
    return true;
  });

  if (removedLines.length === 0) {
    console.log(`  ${slug}: example.com 行なし（スキップ）`);
    return;
  }

  console.log(`  ${slug}: ${removedLines.length}行削除`);
  removedLines.forEach(l => console.log(`    - ${l}`));

  // 参考資料セクションの最後に embassy note を追加（既にある場合はスキップ）
  let cleaned = cleanedLines.join("\n");
  const refMatch = cleaned.match(/###\s*(?:参考資料|References|参考资料)/);
  if (refMatch && !cleaned.includes("在日チュニジア大使館")) {
    // 参考資料セクション末尾に追加
    const refIdx = cleaned.search(/###\s*(?:参考資料|References|参考资料)/);
    const afterRef = cleaned.slice(refIdx);
    const lines2 = afterRef.split("\n");
    // セクション末尾（次の ### または EOF）を検出
    const sectionEnd = lines2.findIndex((l, i) => i > 0 && l.startsWith("###"));
    if (sectionEnd < 0) {
      cleaned = cleaned.trimEnd() + "\n" + TN_EMBASSY_NOTE_JA + "\n";
    } else {
      const insertAt = refIdx + lines2.slice(0, sectionEnd).join("\n").length;
      cleaned = cleaned.slice(0, insertAt).trimEnd() + "\n" + TN_EMBASSY_NOTE_JA + "\n" + cleaned.slice(insertAt);
    }
    console.log(`  大使館案内を追加: 「${TN_EMBASSY_NOTE_JA}」`);
  }

  content.ja = cleaned;

  const { error: updateErr } = await sb
    .from("study_blog_posts")
    .update({ content })
    .eq("slug", slug);
  if (updateErr) {
    console.error(`${slug} 更新失敗:`, updateErr.message);
  } else {
    console.log(`  ✅ ${slug} DB更新完了（is_published=${data.is_published}）`);
  }
}

// ─── メイン ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== visa-hk 標準税率修正 ===");
  await patchHkStandardRate();

  console.log("\n=== TN study記事 example.com 除去 ===");
  await patchTnStudyExampleCom("study-country-tn");
  await patchTnStudyExampleCom("study-work-tn");

  console.log("\n=== 完了 ===");
}

main().catch(e => { console.error(e); process.exit(1); });
