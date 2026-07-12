/**
 * visa-pl / visa-be の所得税セクションを修正
 * - 知識ベースで書かれた税率・閾値を削除
 * - 「最新の税制は公式情報でご確認ください」への誘導に変更
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
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 所得税セクション内の具体的な税率・閾値を「公式情報で確認」に置き換える
// アプローチ: 税率行（%や PLN/EUR 閾値を含む行）を削除し、代替文を挿入
function fixIncomeTax(text: string, lang: "ja" | "en" | "zh", countryJa: string): string {
  const lines = text.split("\n");
  const result: string[] = [];
  let inTaxSection = false;
  let taxSectionReplaced = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 所得税セクション（**所得税** や **Income tax** など）の検出
    if (/^\*\*(所得税|Income tax|所得税率)\*\*/.test(line) && !taxSectionReplaced) {
      inTaxSection = true;
      result.push(line);

      // 代替文を挿入
      const replacements: Record<"ja" | "en" | "zh", string> = {
        ja: `最新の税率・控除額は${countryJa}の税務当局または公式情報でご確認ください。`,
        en: "Please refer to the official tax authority for current tax rates and thresholds.",
        zh: "请参阅目的国税务机关的官方信息，获取最新税率及扣除标准。",
      };
      result.push(replacements[lang]);
      taxSectionReplaced = true;
      continue;
    }

    if (inTaxSection) {
      // 所得税セクション内の行かどうかを判定
      // 次のセクション（**{別項目}** や ### など）が来たらセクション終了
      if (
        /^\*\*(?!所得税|Income tax|所得税率)/.test(line) ||
        /^#{1,3}\s/.test(line) ||
        line.trim() === ""
      ) {
        inTaxSection = false;
        result.push(line);
        continue;
      }

      // 所得税セクション内の具体的な税率・閾値行はスキップ
      // 例: "- 25%: 年収0〜13,250ユーロ" / "- 17%（年収85,528 PLN以下）" / "- 年収85,528 PLN以下：17%"
      if (/[\d,]+\s*%|[\d,]+\s*(PLN|EUR|ポンド|ズウォティ)/i.test(line)) {
        continue; // 税率・閾値行を削除
      }

      result.push(line);
      continue;
    }

    result.push(line);
  }

  return result.join("\n");
}

const TARGETS = [
  { slug: "visa-pl", countryJa: "ポーランド" },
  { slug: "visa-be", countryJa: "ベルギー" },
];

async function main() {
  for (const { slug, countryJa } of TARGETS) {
    console.log(`\n[${slug}] 所得税セクション修正`);

    const { data, error } = await sb
      .from("blog_posts")
      .select("id, content")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      console.error(`  取得失敗: ${error?.message}`);
      continue;
    }

    const content = data.content as Record<string, string>;
    const newContent: Record<string, string> = { ...content };
    const langs: Array<"ja" | "en" | "zh"> = ["ja", "en", "zh"];

    for (const lang of langs) {
      const original = content[lang];
      if (!original) { console.log(`  [${lang}] なし — スキップ`); continue; }

      const fixed = fixIncomeTax(original, lang, countryJa);
      if (fixed === original) {
        console.log(`  [${lang}] 変更なし`);
        continue;
      }
      newContent[lang] = fixed;
      console.log(`  [${lang}] 所得税セクション修正 ✓`);
    }

    const { error: updateErr } = await sb
      .from("blog_posts")
      .update({ content: newContent })
      .eq("id", data.id);

    if (updateErr) {
      console.error(`  更新エラー: ${updateErr.message}`);
    } else {
      console.log(`  ✅ ${slug} 更新完了`);
    }
  }
}

main().catch(console.error);
