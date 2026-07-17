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

const OLD_JA = "税制については、24%の固定税率が適用され、所得が60万ユーロを超える場合は48%となります。";
const NEW_JA = "税制については、業務関連所得60万ユーロまでは24%の固定税率が適用され、60万ユーロを超える部分には48%の税率が適用されます（非居住者向け特例税制 IRNR に基づく）。";

const OLD_EN = "In terms of taxation, a fixed tax rate of 24% applies, rising to 48% for income exceeding €600,000.";
const NEW_EN = "Under the special non-resident income tax regime (IRNR), a fixed rate of 24% applies to work-related income up to €600,000, with 48% applying to any amount exceeding that threshold.";

const OLD_ZH = "在税务方面，适用24%的固定税率，收入超过60万欧元时税率为48%。";
const NEW_ZH = "在税务方面，根据非居民所得税（IRNR）特别制度，业务相关所得60万欧元以内适用24%的固定税率，超出部分适用48%的税率。";

async function main() {
  const { data } = await sb.from("blog_posts").select("content").eq("slug", "spain-digital-nomad-visa-guide-2026").single();
  if (!data) { console.error("not found"); process.exit(1); }
  const content = data.content as Record<string, string>;
  const newContent = { ...content };

  for (const [lang, oldStr, newStr] of [["ja", OLD_JA, NEW_JA], ["en", OLD_EN, NEW_EN], ["zh", OLD_ZH, NEW_ZH]] as const) {
    const txt = content[lang] ?? "";
    if (!txt.includes(oldStr)) {
      console.log(`[${lang}] ⚠️ 旧文字列が見つからず（スキップ）`);
      console.log(`  探した文字列: ${oldStr}`);
      continue;
    }
    newContent[lang] = txt.replace(oldStr, newStr);
    console.log(`[${lang}] ✅ 税制記述を修正`);
  }

  const { error } = await sb.from("blog_posts").update({ content: newContent }).eq("slug", "spain-digital-nomad-visa-guide-2026");
  if (error) { console.error("DB更新失敗:", error.message); process.exit(1); }
  console.log("\n✅ 更新完了");

  // 修正箇所確認
  const ja = newContent["ja"] ?? "";
  const taxSection = ja.match(/### 生活費と税金の目安[\s\S]*?(?=\n###|$)/);
  if (taxSection) console.log(`\n[ja] 修正後セクション:\n${taxSection[0]}`);
}
main().catch(e => { console.error(e); process.exit(1); });
