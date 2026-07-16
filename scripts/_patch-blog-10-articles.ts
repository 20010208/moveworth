/**
 * blog_posts 9件 一括パッチ（承認済み）
 * 1. 拒否前置き文削除
 * 2. 飾り参考文献・民間URL・URLなし行 削除
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

// 拒否前置き文パターン（参考資料セクション直前まで）
const REFUSAL_RE = /申し訳ありませんが[\s\S]*?\n\n(?=### 参考資料)/g;

// 参考資料セクション全体を削除するパターン
const REF_SECTION_FULL_RE = /\n\n### 参考資料[\s\S]*$/;

// 特定行を削除するヘルパー
function removeLines(text: string, patterns: RegExp[]): string {
  return text
    .split("\n")
    .filter(line => !patterns.some(p => p.test(line)))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

// パッチ定義
const PATCHES: Record<string, (ja: string) => string> = {
  "fire-overseas-relocation": (ja) => {
    // 拒否テキスト削除 + 参考資料セクション全体削除
    let s = ja.replace(REFUSAL_RE, "");
    s = s.replace(REF_SECTION_FULL_RE, "");
    return s.trim();
  },

  "overseas-relocation-failure-money": (ja) => {
    // 拒否テキスト削除 + IMF/WorldBank/OECD/IOM削除（外務省保持）
    let s = ja.replace(REFUSAL_RE, "");
    s = removeLines(s, [
      /imf\.org/i,
      /worldbank\.org/i,
      /oecd\.org/i,
      /iom\.int/i,
    ]);
    return s;
  },

  "accurate-living-cost-estimation": (ja) => {
    // 拒否テキスト削除 + IMF/WorldBank/OECD/ILO削除（外務省保持）
    let s = ja.replace(REFUSAL_RE, "");
    s = removeLines(s, [
      /imf\.org/i,
      /worldbank\.org/i,
      /oecd\.org/i,
      /ilo\.org/i,
    ]);
    return s;
  },

  "5-year-asset-career-plan": (ja) => {
    // 拒否テキスト削除 + WorldBank/IMF削除（日本銀行・内閣府ESRI・経産省保持）
    let s = ja.replace(REFUSAL_RE, "");
    s = removeLines(s, [
      /worldbank\.org/i,
      /imf\.org/i,
    ]);
    return s;
  },

  "comparing-currency-exchange-and-transfer-costs-for-expa-2026": (ja) => {
    // 拒否テキスト削除 + 三菱UFJ（民間）・IMF・WorldBank削除（日銀・財務省保持）
    let s = ja.replace(REFUSAL_RE, "");
    s = removeLines(s, [
      /bk\.mufg\.jp/i,
      /imf\.org/i,
      /worldbank\.org/i,
    ]);
    return s;
  },

  "initial-costs-overseas-relocation-2026": (ja) => {
    // 拒否テキスト削除 + embassy-worldwide.com削除 + OECD削除
    let s = ja.replace(REFUSAL_RE, "");
    s = removeLines(s, [
      /embassy-worldwide\.com/i,
      /oecd\.org/i,
    ]);
    return s;
  },

  "essential-insurance-review-points-before-moving-abroad-2026": (ja) => {
    // 拒否テキスト削除 + AU移民局削除（保険記事に無関係）（外務省・厚労省・IOM・WHO保持）
    let s = ja.replace(REFUSAL_RE, "");
    s = removeLines(s, [
      /immi\.homeaffairs\.gov\.au/i,
    ]);
    return s;
  },

  "overseas-relocation-tax-savings-tips": (ja) => {
    // 拒否テキスト削除 + URLなし行（移住先国の大使館～）削除
    let s = ja.replace(REFUSAL_RE, "");
    s = removeLines(s, [
      /移住先国の大使館/,
    ]);
    return s;
  },

  "maximize-tax-savings-with-overseas-relocation-key-insig-2026": (ja) => {
    // 拒否テキスト削除 + OECD行削除（国税庁・外務省・IRS・HMRC保持）
    let s = ja.replace(REFUSAL_RE, "");
    s = removeLines(s, [
      /oecd\.org/i,
    ]);
    return s;
  },
};

async function main() {
  const slugs = Object.keys(PATCHES);
  const { data } = await sb
    .from("blog_posts")
    .select("slug, content")
    .in("slug", slugs);

  if (!data || data.length !== slugs.length) {
    console.error(`❌ 取得件数不一致: 期待${slugs.length}件, 実際${data?.length ?? 0}件`);
    process.exit(1);
  }

  let successCount = 0;
  const REFUSAL_CHECK_RE = /申し訳ありませんが|I'?m sorry/i;

  for (const row of data) {
    const slug = row.slug as string;
    const content = row.content as Record<string, string>;
    const patch = PATCHES[slug];
    if (!patch) continue;

    const originalJa = content.ja ?? "";
    const patchedJa = patch(originalJa);

    // 検証
    if (REFUSAL_CHECK_RE.test(patchedJa)) {
      console.error(`❌ ${slug}: 拒否パターン残存`);
      continue;
    }
    if (/embassy-worldwide\.com/i.test(patchedJa)) {
      console.error(`❌ ${slug}: embassy-worldwide.com 残存`);
      continue;
    }

    const deletedChars = originalJa.length - patchedJa.length;

    const newContent = { ...content, ja: patchedJa };
    const { error } = await sb.from("blog_posts").update({ content: newContent }).eq("slug", slug);
    if (error) {
      console.error(`❌ ${slug}: DB更新失敗 - ${error.message}`);
    } else {
      console.log(`✅ ${slug}: -${deletedChars}字`);
      successCount++;
    }
  }

  console.log(`\n完了: ${successCount}/${slugs.length}件成功`);
}
main().catch(e => { console.error(e); process.exit(1); });
