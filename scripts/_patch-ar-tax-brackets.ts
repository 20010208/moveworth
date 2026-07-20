/**
 * AR visa-ar 税率テーブルのターゲットパッチ
 * 現在の古いブラケット（2024年以前の低いARS値）を
 * AFIP Art.94 2025年度確認済みデータに更新する。
 * JA/EN/ZHすべての言語の税率テーブルを更新。
 * その他のセクション（ビザ情報・家賃・チェックリスト）は一切変更しない。
 */
import { existsSync, readFileSync } from "fs";
if (existsSync(".env.local")) {
  for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = l.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(); if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// AFIP Art.94 Tabla 2025 liquidacion-anual-y-final
// Source: https://www.afip.gob.ar/.../Tabla-Art-94-LIG-liquidacion-anual-y-final-2025.pdf
// Verified 2026-07-20

const NEW_TAX_TABLE_JA = `**個人所得税（Ganancias：居住者）**

| 年間課税所得（ARS） | 税率 |
|----------------|------|
| 0〜1,749,901 | 5% |
| 1,749,902〜3,499,803 | 9% |
| 3,499,803〜5,249,704 | 12% |
| 5,249,705〜7,874,557 | 15% |
| 7,874,557〜15,749,113 | 19% |
| 15,749,114〜23,623,670 | 23% |
| 23,623,670〜35,435,504 | 27% |
| 35,435,505〜53,153,257 | 31% |
| 53,153,257以上 | **35%** |

※2025年度確認値（AFIP Art.94 Tabla LIG 2025）。ARS金額はCPI（IPC INDEC）連動で四半期ごとに改定。最新値はAFIP（afip.gob.ar）またはARCA（新機関名）でご確認ください。`;

const NEW_TAX_TABLE_EN = `**Personal Income Tax (Ganancias — Residents)**

| Annual Taxable Income (ARS) | Rate |
|----------------------------|------|
| 0–1,749,901 | 5% |
| 1,749,902–3,499,803 | 9% |
| 3,499,803–5,249,704 | 12% |
| 5,249,705–7,874,557 | 15% |
| 7,874,557–15,749,113 | 19% |
| 15,749,114–23,623,670 | 23% |
| 23,623,670–35,435,504 | 27% |
| 35,435,505–53,153,257 | 31% |
| Above 53,153,257 | **35%** |

*2025 verified figures (AFIP Art.94 Tabla LIG 2025, Ley N°27.743). ARS thresholds are indexed quarterly to CPI (IPC INDEC). Always verify current figures at AFIP (afip.gob.ar) or ARCA.*`;

const NEW_TAX_TABLE_ZH = `**个人所得税（Ganancias：居民）**

| 年度应税所得（ARS） | 税率 |
|----------------|------|
| 0〜1,749,901 | 5% |
| 1,749,902〜3,499,803 | 9% |
| 3,499,803〜5,249,704 | 12% |
| 5,249,705〜7,874,557 | 15% |
| 7,874,557〜15,749,113 | 19% |
| 15,749,114〜23,623,670 | 23% |
| 23,623,670〜35,435,504 | 27% |
| 35,435,505〜53,153,257 | 31% |
| 超过53,153,257 | **35%** |

*2025年度确认值（AFIP Art.94 Tabla LIG 2025，Ley N°27.743）。ARS金额与CPI（IPC INDEC）挂钩，每季度更新。请在AFIP（afip.gob.ar）或ARCA核实最新数值。*`;

// 旧テーブルにマッチするパターン（ja/en/zh でそれぞれ異なる可能性）
// ja のマッチ: "| 〜1,091,403 | 5%" が含まれる表全体を置換
const OLD_JA_TABLE_RE = /\*\*個人所得税.*?(?=###|\n\n\*\*モノトリブート)/s;
const OLD_EN_TABLE_RE = /\*\*Personal Income Tax.*?(?=###|\n\n\*\*Monotributo)/s;
const OLD_ZH_TABLE_RE = /\*\*个人所得税.*?(?=###|\n\n\*\*Monotributo)/s;

function patchContent(content: string, lang: "ja" | "en" | "zh"): { patched: string; changed: boolean } {
  const re = lang === "ja" ? OLD_JA_TABLE_RE : lang === "en" ? OLD_EN_TABLE_RE : OLD_ZH_TABLE_RE;
  const newTable = lang === "ja" ? NEW_TAX_TABLE_JA : lang === "en" ? NEW_TAX_TABLE_EN : NEW_TAX_TABLE_ZH;

  if (!re.test(content)) {
    // fallback: 古いブラケット行を含むテーブルを特定してみる
    const oldBracketJa = "〜1,091,403";
    const oldBracketEn = "1,091,403";
    if (!content.includes(oldBracketJa) && !content.includes(oldBracketEn)) {
      console.log(`  [${lang}] 旧ブラケットが見つからない（既に更新済みか別パターン）`);
      return { patched: content, changed: false };
    }
    // 手動マッチ
    const tableStart = content.indexOf("| 〜1,091,403");
    if (tableStart === -1) {
      console.log(`  [${lang}] テーブル開始が見つからない`);
      return { patched: content, changed: false };
    }
    // テーブルヘッダーを含む範囲を特定
    const headerStart = content.lastIndexOf("\n| ", tableStart);
    const tableEnd = content.indexOf("\n\n", tableStart);
    const oldTable = content.slice(headerStart, tableEnd === -1 ? content.length : tableEnd);
    const patched = content.replace(oldTable, "\n" + newTable);
    return { patched, changed: patched !== content };
  }

  const patched = content.replace(re, newTable + "\n\n");
  return { patched, changed: patched !== content };
}

async function main() {
  console.log("=== visa-ar 税率テーブル ターゲットパッチ ===\n");

  const { data, error } = await sb
    .from("blog_posts")
    .select("slug, is_published, content")
    .eq("slug", "visa-ar")
    .single();

  if (error || !data) {
    console.error("取得エラー:", error?.message);
    process.exit(1);
  }

  console.log(`取得: visa-ar is_published=${data.is_published}`);
  const content = data.content as Record<string, string>;

  // 各言語のテーブルを確認
  for (const lang of ["ja", "en", "zh"] as const) {
    const text = content[lang] || "";
    const old1091 = text.includes("1,091,403") || text.includes("1.091.403");
    console.log(`  [${lang}] len=${text.length} 旧ブラケット含む=${old1091}`);
    if (old1091) {
      const idx = text.indexOf("1,091,403");
      console.log(`    旧ブラケット周辺: ...${text.slice(Math.max(0,idx-100), idx+300)}...`);
    }
  }

  // パッチ適用
  const newContent: Record<string, string> = { ...content };
  let anyChanged = false;

  for (const lang of ["ja", "en", "zh"] as const) {
    const text = content[lang] || "";
    const { patched, changed } = patchContent(text, lang);
    if (changed) {
      newContent[lang] = patched;
      anyChanged = true;
      console.log(`  ✅ [${lang}] パッチ適用: ${text.length} → ${patched.length} chars`);
    } else {
      console.log(`  ℹ️  [${lang}] 変更なし（旧ブラケットが見つからないか既に更新済み）`);
    }
  }

  if (!anyChanged) {
    console.log("\n全言語で変更なし。パッチ不要です。");
    process.exit(0);
  }

  // 更新（is_published は変更しない）
  const { error: updateErr } = await sb
    .from("blog_posts")
    .update({ content: newContent })
    .eq("slug", "visa-ar");

  if (updateErr) {
    console.error("UPDATE エラー:", updateErr.message);
    process.exit(1);
  }

  console.log("\n✅ visa-ar 税率テーブル更新完了（is_published 変更なし）");
  console.log("次のステップ: 全文レビュー後に --publish-only で公開");
}

main().catch(e => { console.error(e); process.exit(1); });
