// study-country-my: 到達不可能なMM2H参照URLを削除
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const BAD_LINE = "- [マレーシア移民局（IMI）](https://www.imi.gov.my/index.php/en/main-services/mm2h.html)";

async function main() {
  const { data, error } = await sb.from("study_blog_posts")
    .select("content,is_published")
    .eq("slug", "study-country-my")
    .single();
  if (error || !data) { console.error("取得失敗:", error?.message); process.exit(1); }

  const content = data.content as Record<string, string>;
  let changed = false;

  for (const lang of ["ja", "en", "zh"] as const) {
    if (!content[lang]) continue;
    if (content[lang].includes(BAD_LINE)) {
      content[lang] = content[lang].replace(`\n${BAD_LINE}`, "").replace(BAD_LINE, "");
      console.log(`  ✅ [${lang}] MM2H参照削除`);
      changed = true;
    } else {
      console.log(`  — [${lang}] 対象行なし`);
    }
  }

  if (!changed) { console.log("変更なし"); return; }

  const { error: upErr } = await sb.from("study_blog_posts")
    .update({ content })
    .eq("slug", "study-country-my");
  if (upErr) { console.error("更新失敗:", upErr.message); process.exit(1); }
  console.log("\n✅ パッチ完了（is_published:", data.is_published, "）");
}
main().catch(e => { console.error(e); process.exit(1); });
