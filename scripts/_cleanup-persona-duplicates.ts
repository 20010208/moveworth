/**
 * simulator_personas の重複クリーンアップ
 * - 同国×属性で複数件ある場合、最新1件を残して旧RowをDELETE
 * - PL・RO は全件DELETE（再シード予定、旧税率が埋め込まれているため）
 * - --dry-run フラグで実行なしにプレビュー可能
 */
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

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DRY_RUN = process.argv.includes("--dry-run");
// PL・RO は税率が陳腐化しているため全件削除して再シード
const RESEED_COUNTRIES = new Set(["PL", "RO"]);

async function main() {
  const { data: all, error } = await sb
    .from("simulator_personas")
    .select("id, country_code, attribute, created_at")
    .order("country_code").order("created_at");

  if (error) { console.error("fetch error:", error.message); process.exit(1); }
  console.log(`全ペルソナ: ${all?.length}件\n`);

  const toDelete: string[] = [];

  // 国×属性でグループ化
  const byKey = new Map<string, typeof all>();
  for (const p of all ?? []) {
    const key = `${p.country_code}|${p.attribute}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(p);
  }

  for (const [key, rows] of byKey.entries()) {
    const [code] = key.split("|");

    if (RESEED_COUNTRIES.has(code)) {
      // 再シード対象国: 最新も含めて全件削除
      for (const r of rows!) toDelete.push(r.id);
    } else if (rows!.length > 1) {
      // 重複: 最新1件を残して旧件を削除
      const sorted = [...rows!].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      for (const r of sorted.slice(1)) toDelete.push(r.id);
    }
  }

  console.log(`削除対象: ${toDelete.length}件`);
  const reseedCount = [...byKey.entries()]
    .filter(([key]) => RESEED_COUNTRIES.has(key.split("|")[0]))
    .reduce((n, [, rows]) => n + rows!.length, 0);
  const dupCount = toDelete.length - reseedCount;
  console.log(`  うち PL/RO 全件: ${reseedCount}件`);
  console.log(`  うち 重複旧件: ${dupCount}件`);
  console.log(`残るペルソナ（PL/RO除く）: ${(all?.length ?? 0) - toDelete.length}件\n`);

  if (DRY_RUN) {
    console.log("=== DRY RUN — 実際には削除しません ===");
    process.exit(0);
  }

  // バッチ削除（100件ずつ）
  let deleted = 0;
  const BATCH = 100;
  for (let i = 0; i < toDelete.length; i += BATCH) {
    const batch = toDelete.slice(i, i + BATCH);
    const { error: delErr } = await sb
      .from("simulator_personas")
      .delete()
      .in("id", batch);
    if (delErr) {
      console.error(`DELETE バッチ ${i} エラー:`, delErr.message);
      process.exit(1);
    }
    deleted += batch.length;
    process.stdout.write(`\r削除済: ${deleted}/${toDelete.length}`);
  }
  console.log("\n✅ 削除完了");

  // 確認カウント
  const { count } = await sb
    .from("simulator_personas")
    .select("id", { count: "exact", head: true });
  console.log(`残りペルソナ: ${count}件`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
