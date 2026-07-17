/**
 * spain-digital-nomad-visa-guide-2026 参考資料修正
 * 1. no-lucrativa 参考資料行を削除（全言語）
 * 2. exteriores.gob.es のラベルにパスサフィックスを付与（全言語）
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

const SLUG = "spain-digital-nomad-visa-guide-2026";
const NO_LUCRATIVA_URL = "Visado-de-residencia-no-lucrativa";

async function main() {
  const { data } = await sb.from("blog_posts").select("content").eq("slug", SLUG).single();
  if (!data) { console.error("not found"); process.exit(1); }

  const content = data.content as Record<string, string>;

  // 全言語の参考資料を確認・修正
  const langs: Array<["ja" | "en" | "zh", string, string]> = [
    ["ja", "exteriores.gob.es（Consular）", "スペイン外務省領事局（Visados-nacionales）"],
    ["en", "exteriores.gob.es (Consular)", "Spanish Ministry of Foreign Affairs – Consular (Visados-nacionales)"],
    ["zh", "exteriores.gob.es（Consular）", "西班牙外交部领事局（Visados-nacionales）"],
  ];

  const newContent = { ...content };

  for (const [lang, oldLabel, newLabel] of langs) {
    let txt = content[lang] ?? "";
    if (!txt) { console.log(`[${lang}] コンテンツなし、スキップ`); continue; }

    const refMatch = txt.match(/### 参考資料[\s\S]*$|### References[\s\S]*$|### 参考资料[\s\S]*$/);
    if (refMatch) {
      console.log(`\n[${lang}] 現在の参考資料:\n${refMatch[0]}`);
    }

    // 1. no-lucrativa 行削除
    const before = txt.length;
    txt = txt.split("\n").filter(line => !line.includes(NO_LUCRATIVA_URL)).join("\n");
    const removed = before - txt.length;

    // 2. ラベル置換（exteriores.gob.es に重複ラベルが2件ある場合の最初の1件のみ → 削除後は1件）
    txt = txt.replace(
      new RegExp(`\\[${oldLabel.replace(/[()]/g, "\\$&")}\\]`, "g"),
      `[${newLabel}]`
    );

    console.log(`[${lang}] no-lucrativa削除: ${removed > 0 ? `${removed}字削除` : "なし"}、ラベル更新`);
    newContent[lang] = txt;
  }

  const { error } = await sb.from("blog_posts").update({ content: newContent }).eq("slug", SLUG);
  if (error) { console.error("❌ DB更新失敗:", error.message); process.exit(1); }

  console.log("\n✅ 更新完了");

  // 修正後の参考資料を確認
  for (const lang of ["ja", "en", "zh"] as const) {
    const txt = newContent[lang] ?? "";
    const refMatch = txt.match(/### 参考資料[\s\S]*$|### References[\s\S]*$|### 参考资料[\s\S]*$/);
    if (refMatch) console.log(`\n[${lang}] 修正後参考資料:\n${refMatch[0]}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
