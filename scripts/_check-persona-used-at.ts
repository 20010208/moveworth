import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
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
  const { data: personas, error } = await sb
    .from("simulator_personas")
    .select("id, country_code, attribute, used_at, simulation_input, created_at")
    .order("country_code").order("attribute");
  if (error) { console.error(error.message); process.exit(1); }

  const all = personas ?? [];
  const used = all.filter(p => p.used_at != null);
  const unused = all.filter(p => p.used_at == null);

  console.log(`\n総ペルソナ数: ${all.length}件`);
  console.log(`  used_at 設定済み: ${used.length}件`);
  console.log(`  used_at null（未使用）: ${unused.length}件`);

  if (used.length === 0) {
    console.log("\n使用済みペルソナ: なし ✅");
    return;
  }

  console.log("\n=== 使用済みペルソナ一覧 ===");
  for (const p of used) {
    const si = p.simulation_input as Record<string, unknown> | null;
    const rentCurrent = si?.rentCurrent;
    const rentTarget = si?.rentTarget;
    const usedDate = (p.used_at ?? "").slice(0, 10);
    console.log(`  ${p.country_code} "${p.attribute}" used_at=${usedDate} rentCurrent=${rentCurrent} rentTarget=${rentTarget}`);
  }

  // used_at がある場合、対応する blog_posts / study_blog_posts を探す
  // simulator 記事のスラグ命名規則: simulator-{country_code}-... 等を想定
  // used_at がある国コードを抽出
  const usedCodes = [...new Set(used.map(p => p.country_code))];
  console.log(`\n使用済みペルソナの国コード: ${usedCodes.join(", ")}`);

  // blog_posts / study_blog_posts でシミュレーター関連記事を検索
  for (const code of usedCodes) {
    const lc = code.toLowerCase();
    const { data: bp } = await sb.from("blog_posts")
      .select("slug, is_published, updated_at")
      .ilike("slug", `%${lc}%`);
    const { data: sp } = await sb.from("study_blog_posts")
      .select("slug, is_published, updated_at")
      .ilike("slug", `%${lc}%`);
    const related = [...(bp ?? []), ...(sp ?? [])].filter(r =>
      r.slug.includes("simulator") || r.slug.includes("simulate") || r.slug.startsWith("study-")
    );
    if (related.length) {
      console.log(`  ${code}: 関連記事 → ${related.map(r => `${r.slug}(pub=${r.is_published})`).join(", ")}`);
    }
  }
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
