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

async function main() {
  const { data } = await sb.from("blog_posts").select("content").eq("slug", "spain-digital-nomad-visa-guide-2026").single();
  if (!data) { console.error("not found"); process.exit(1); }
  const content = data.content as Record<string, string>;
  const newContent = { ...content };

  // EN: add the 48% rate for amounts over €600k
  const enOld = "The visa offers a fixed tax rate of 24% on income up to €600,000. For detailed tax obligations, consult a tax advisor.";
  const enNew = "Under the special non-resident income tax regime (IRNR), a fixed rate of 24% applies to work-related income up to €600,000, with 48% applying to amounts exceeding that threshold. For detailed tax obligations, consult a tax advisor.";
  if (content.en?.includes(enOld)) {
    newContent.en = content.en.replace(enOld, enNew);
    console.log("[en] ✅ 税制記述を修正");
  } else {
    console.log("[en] ⚠️ 旧文字列なし（スキップ）");
    console.log(`  EN tax section: ${content.en?.match(/24%[^。\n]*/)?.[0]}`);
  }

  // ZH: add the €600k threshold qualifier
  const zhOld = "工作收入的税率为24%，资本利得税率为19%至28%。";
  const zhNew = "根据非居民所得税（IRNR）特别制度，业务相关所得60万欧元以内的工作收入税率为24%，超出部分适用48%的税率；资本利得税率为19%至28%。";
  if (content.zh?.includes(zhOld)) {
    newContent.zh = content.zh.replace(zhOld, zhNew);
    console.log("[zh] ✅ 税制記述を修正");
  } else {
    console.log("[zh] ⚠️ 旧文字列なし（スキップ）");
    console.log(`  ZH tax section: ${content.zh?.match(/24%[^。\n]*/)?.[0]}`);
  }

  const { error } = await sb.from("blog_posts").update({ content: newContent }).eq("slug", "spain-digital-nomad-visa-guide-2026");
  if (error) { console.error("DB更新失敗:", error.message); process.exit(1); }
  console.log("\n✅ 更新完了");
}
main().catch(e => { console.error(e); process.exit(1); });
