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
  let en = content["en"] ?? "";

  // EN content uses full-width parens — fix the remaining exteriores label
  const before = en;
  en = en.replace(
    "[exteriores.gob.es（Consular）]",
    "[Spanish Ministry of Foreign Affairs – Consular (Visados-nacionales)]"
  );

  if (en === before) { console.log("❌ ラベル未変更（マッチしなかった可能性あり）"); }
  else { console.log("✅ EN ラベル更新"); }

  const { error } = await sb.from("blog_posts").update({ content: { ...content, en } }).eq("slug", "spain-digital-nomad-visa-guide-2026");
  if (error) { console.error("DB更新失敗:", error.message); process.exit(1); }

  const refMatch = en.match(/### References[\s\S]*$/);
  if (refMatch) console.log(`\n[en] 修正後参考資料:\n${refMatch[0]}`);
}
main().catch(e => { console.error(e); process.exit(1); });
