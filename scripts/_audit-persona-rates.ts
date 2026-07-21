/**
 * 全ペルソナの simulation_input.taxRateTarget を検査し、
 * 現プリセットの defaultTaxRate と比較して乖離を報告する
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { countryPresets } from "../src/data/country-presets";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const currentRates = new Map(
  countryPresets.map((preset) => [preset.code.toUpperCase(), preset.defaultTaxRate])
);

async function main() {
  const { data: all, error } = await sb.from("simulator_personas")
    .select("id, country_code, attribute, simulation_input, created_at")
    .order("country_code").order("created_at");
  if (error) { console.error(error.message); return; }

  console.log(`\n全ペルソナ: ${all?.length ?? 0}件\n`);

  // country×attribute でグループ化して最新1件を特定
  type Row = typeof all extends (infer T)[] | null ? T : never;
  const byKey = new Map<string, Row[]>();
  for (const p of all ?? []) {
    const key = `${p.country_code}|${p.attribute}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(p);
  }

  const stale: Row[] = [];
  const dupToDelete: Row[] = [];

  console.log("=== 重複ペルソナ（同国×属性が複数件） ===");
  let dupCount = 0;
  for (const [key, rows] of byKey.entries()) {
    if (rows.length > 1) {
      dupCount++;
      const [code, attr] = key.split("|");
      // 最新1件を残し、残りは削除候補
      const sorted = [...rows].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const toKeep = sorted[0];
      const toDelete = sorted.slice(1);
      console.log(`  ${code} "${attr}" → ${rows.length}件 (最新 ${toKeep.created_at?.slice(0,10)}, ${toDelete.length}件削除候補)`);
      dupToDelete.push(...toDelete);
    }
  }
  if (!dupCount) console.log("  なし");

  console.log("\n=== 税率乖離チェック（全ペルソナ最新1件） ===");
  console.log("  " + ["国","属性","seed時Rate","現Rate","乖離","作成日"].map(s=>s.padEnd(16)).join(""));

  let staleCount = 0;
  for (const [key, rows] of byKey.entries()) {
    const [code, attr] = key.split("|");
    const latest = [...rows].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    const si = latest.simulation_input as Record<string, unknown> | null;
    const seededRate = si?.taxRateTarget as number | undefined;
    const currentRate = currentRates.get(code);
    if (seededRate === undefined || currentRate === undefined) continue;
    const gap = Math.abs(seededRate - currentRate);
    const isStale = gap >= 0.01; // 1pt以上差があれば陳腐化
    if (isStale) {
      stale.push(latest);
      staleCount++;
      const row = [
        code.padEnd(6),
        attr.slice(0,14).padEnd(14),
        `${(seededRate*100).toFixed(1)}%`.padEnd(10),
        `${(currentRate*100).toFixed(1)}%`.padEnd(10),
        `${(gap*100).toFixed(1)}pt`.padEnd(8),
        (latest.created_at ?? "").slice(0,10)
      ];
      console.log("  ⚠️  " + row.join("  "));
    }
  }
  if (!staleCount) console.log("  乖離なし ✅");

  console.log(`\n=== サマリー ===`);
  console.log(`  総ペルソナ数: ${all?.length}`);
  console.log(`  重複削除候補: ${dupToDelete.length}件`);
  console.log(`  税率陳腐化: ${staleCount}件（ユニークkey）`);

  // 削除候補 ID 一覧
  if (dupToDelete.length > 0) {
    console.log(`\n削除候補ID (重複): ${dupToDelete.map(r=>r.id).join(", ")}`);
  }
  if (stale.length > 0) {
    console.log(`陳腐化ID (最新): ${stale.map(r=>r.id).join(", ")}`);
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
