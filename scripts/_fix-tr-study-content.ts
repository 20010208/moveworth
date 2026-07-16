/**
 * TR study記事の修正 + ME非公開化
 *
 * 修正1: study-country-tr JA — 指示文漏れ削除・CTA自然文化
 * 修正2: study-work-tr JA/EN — 就労ルール矛盾解消（休暇中を安全表現に統一）
 * 修正3: study-country-tr JA — 参考資料ラベル「トルコ大使館」→「在トルコ日本国大使館」
 * 修正4: study-work-me・study-country-me → is_published=false
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const APPLY = process.argv.includes("--apply");

async function getContent(slug: string) {
  const { data, error } = await sb.from("study_blog_posts")
    .select("content, title, description")
    .eq("slug", slug)
    .single();
  if (error) throw new Error(`${slug}: ${error.message}`);
  return data;
}

function fixStudyWorkJa(text: string): string {
  // 矛盾する「制限なし」→ 安全な表現に
  return text
    .replace(
      /\*\*休暇中：\*\*\s*制限なし/,
      "**休暇中：** 労働許可証の条件や在籍機関により異なります（個別に確認が必要）"
    );
}

function fixStudyWorkEn(text: string): string {
  // 矛盾する「Up to 40 hrs/week」→ 安全な表現に
  // 学部生/大学院生の言及も安全表現に統一
  return text
    .replace(
      /\*\*During holidays:\*\*\s*Up to 40 hrs\/week/,
      "**During holidays:** Varies by work permit conditions and institution — confirm directly"
    )
    .replace(
      /Note that undergraduate students are generally not allowed to work off-campus, while graduate students may have more opportunities\./,
      "Work eligibility may differ between undergraduate and graduate students; always confirm with your institution and the Ministry of Labor."
    );
}

function fixStudyCountryJa(text: string): string {
  // 指示文漏れ削除 + 自然なCTA文に統一
  return text
    .replace(
      /MoveWorth\.studyのシミュレーターでトルコ留学の総費用を計算できます。必ずマークダウンリンク形式 \[MoveWorth\.studyシミュレーター\]\(https:\/\/study\.moveworthapp\.com\/simulate\) で記載してください。/,
      "MoveWorth.studyのシミュレーターでトルコ留学の総費用を計算してみましょう。[MoveWorth.studyシミュレーター](https://study.moveworthapp.com/simulate)"
    )
    // 参考資料ラベル修正
    .replace(
      "[トルコ大使館](https://www.tr.emb-japan.go.jp/)",
      "[在トルコ日本国大使館](https://www.tr.emb-japan.go.jp/)"
    );
}

async function main() {
  console.log(`=== TR study 修正 + ME 非公開化 ${APPLY ? "[--apply]" : "[--dry-run]"} ===\n`);

  // --- study-work-tr ---
  const workData = await getContent("study-work-tr");
  const workJaFixed = fixStudyWorkJa(workData.content.ja);
  const workEnFixed = fixStudyWorkEn(workData.content.en);

  const workJaChanged = workJaFixed !== workData.content.ja;
  const workEnChanged = workEnFixed !== workData.content.en;

  console.log("--- study-work-tr ---");
  if (workJaChanged) {
    const before = (workData.content.ja.match(/\*\*休暇中：\*\*.+/) ?? ["(not found)"])[0];
    const after  = (workJaFixed.match(/\*\*休暇中：\*\*.+/) ?? ["(not found)"])[0];
    console.log(`  JA 休暇中: "${before}"`);
    console.log(`         → "${after}"`);
  } else { console.log("  JA: 変更なし（パターン不一致）"); }

  if (workEnChanged) {
    const before = (workData.content.en.match(/\*\*During holidays:\*\*.+/) ?? ["(not found)"])[0];
    const after  = (workEnFixed.match(/\*\*During holidays:\*\*.+/) ?? ["(not found)"])[0];
    console.log(`  EN During holidays: "${before}"`);
    console.log(`                    → "${after}"`);
  } else { console.log("  EN: 変更なし（パターン不一致）"); }

  if (APPLY && (workJaChanged || workEnChanged)) {
    const newContent = { ...workData.content, ja: workJaFixed, en: workEnFixed };
    const { error } = await sb.from("study_blog_posts")
      .update({ content: newContent })
      .eq("slug", "study-work-tr");
    if (error) console.error(`  ❌ ${error.message}`);
    else console.log("  ✅ study-work-tr 更新完了");
  }

  // --- study-country-tr ---
  const guideData = await getContent("study-country-tr");
  const guideJaFixed = fixStudyCountryJa(guideData.content.ja);
  const guideJaChanged = guideJaFixed !== guideData.content.ja;

  console.log("\n--- study-country-tr ---");
  if (guideJaChanged) {
    // CTA修正の確認
    const ctaAfter = guideJaFixed.match(/MoveWorth\.studyの.+\]\(https:\/\/study\.moveworthapp/)
      ?? ["(not found)"];
    console.log(`  JA CTA → "${ctaAfter[0]}..."`);
    // ラベル修正の確認
    const labelAfter = guideJaFixed.includes("在トルコ日本国大使館");
    console.log(`  JA 参考資料ラベル → ${labelAfter ? "✅ 修正済み" : "❌ 修正されていない"}`);
    // 指示文が残っていないか確認
    const hasInstruction = guideJaFixed.includes("必ずマークダウンリンク形式");
    console.log(`  JA 指示文残存 → ${hasInstruction ? "❌ まだ残っている" : "✅ 削除済み"}`);
  } else {
    console.log("  JA: 変更なし（パターン不一致）");
  }

  if (APPLY && guideJaChanged) {
    const newContent = { ...guideData.content, ja: guideJaFixed };
    const { error } = await sb.from("study_blog_posts")
      .update({ content: newContent })
      .eq("slug", "study-country-tr");
    if (error) console.error(`  ❌ ${error.message}`);
    else console.log("  ✅ study-country-tr 更新完了");
  }

  // --- ME 非公開化 ---
  console.log("\n--- ME 非公開化（study-work-me / study-country-me → is_published=false）---");
  for (const slug of ["study-work-me", "study-country-me"]) {
    const { data: cur } = await sb.from("study_blog_posts")
      .select("is_published").eq("slug", slug).single();
    console.log(`  ${slug}: is_published=${cur?.is_published} → false`);
    if (APPLY) {
      const { error } = await sb.from("study_blog_posts")
        .update({ is_published: false }).eq("slug", slug);
      if (error) console.error(`    ❌ ${error.message}`);
      else console.log(`    ✅ 非公開化完了`);
    }
  }

  if (!APPLY) console.log("\n--apply で実行すると変更が適用されます。");
}

main().catch(e => { console.error(e); process.exit(1); });
