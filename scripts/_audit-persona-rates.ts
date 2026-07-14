/**
 * 全ペルソナの simulation_input.taxRateTarget を検査し、
 * 現プリセットの defaultTaxRate と比較して乖離を報告する
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
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// 現在のプリセット税率（country-presets.ts から手動同期）
const CURRENT_RATES: Record<string, number> = {
  JP:0.30,SG:0.09,MY:0.20,TH:0.20,KR:0.28,TW:0.20,HK:0.15,ID:0.20,PH:0.25,VN:0.20,
  US:0.30,CA:0.30,GB:0.30,DE:0.35,FR:0.35,NL:0.38,CH:0.25,AU:0.30,NZ:0.28,AE:0.00,
  PT:0.28,ES:0.30,GE:0.20,IE:0.40,SE:0.45,NO:0.35,DK:0.45,BR:0.275,CO:0.25,IT:0.38,
  GR:0.30,MT:0.35,ZA:0.25,FI:0.38,AT:0.35,CZ:0.22,CN:0.20,IN:0.20,MX:0.25,AR:0.25,
  BE:0.50,PL:0.29,TN:0.25,TR:0.27,RO:0.41,BG:0.21,CY:0.20,EE:0.19,HR:0.33,HU:0.34,
};

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
    const currentRate = CURRENT_RATES[code];
    if (seededRate === undefined) continue;
    const gap = currentRate !== undefined ? Math.abs(seededRate - currentRate) : null;
    const isStale = gap !== null && gap >= 0.01; // 1pt以上差があれば陳腐化
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
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
