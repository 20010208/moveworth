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

// 今回補正した referenceRent の新値
const NEW_RENTS: Record<string, number> = {
  JP: 140000, SG: 3900, MY: 2700, TH: 20000, TW: 22000, ID: 7000000, PH: 35000, VN: 15000000,
  NL: 1800, ES: 1350, GE: 1300, GR: 1000, MT: 1200, CN: 7000, MX: 20000, AR: 750000,
  CO: 2500000, TN: 850, TR: 20000,
  // 前回補正分
  FI: 1100, AT: 1200, IT: 1300, CH: 2500, AE: 7000,
};

// 今回補正した referenceLivingCost の新値（VNのみ変更）
const NEW_LIVING: Record<string, number> = {
  VN: 9000000,
};

async function main() {
  const { data, error } = await sb
    .from("simulator_personas")
    .select("id, country_code, attribute, simulation_input, created_at")
    .order("country_code").order("created_at");
  if (error) { console.error(error.message); process.exit(1); }

  const personas = data ?? [];
  console.log(`\n総ペルソナ数: ${personas.length}件\n`);

  const JP_NEW_RENT = NEW_RENTS["JP"]!; // 140000

  let jpContam = 0;
  let rentTargetContam = 0;
  let livingContam = 0;

  // ① rentCurrent 汚染: JP referenceRent が旧値(80000)で焼き込まれているペルソナ
  console.log("=== ① rentCurrent 汚染チェック (JP: 80000→140000) ===");
  for (const p of personas) {
    const si = p.simulation_input as Record<string, unknown> | null;
    const rentCurrent = si?.rentCurrent as number | undefined;
    if (rentCurrent !== undefined && rentCurrent !== JP_NEW_RENT) {
      jpContam++;
      console.log(`  ⚠️  ${p.country_code} "${p.attribute}" rentCurrent=${rentCurrent} (→ 要: ${JP_NEW_RENT})`);
    }
  }
  if (!jpContam) console.log("  汚染なし ✅");

  // ② rentTarget 汚染: 補正対象国の旧 referenceRent が焼き込まれているペルソナ
  console.log("\n=== ② rentTarget 汚染チェック (19+5カ国) ===");
  for (const p of personas) {
    const newRent = NEW_RENTS[p.country_code];
    if (newRent === undefined) continue;
    const si = p.simulation_input as Record<string, unknown> | null;
    const rentTarget = si?.rentTarget as number | undefined;
    if (rentTarget !== undefined && rentTarget !== newRent) {
      rentTargetContam++;
      console.log(`  ⚠️  ${p.country_code} "${p.attribute}" rentTarget=${rentTarget} (→ 要: ${newRent})`);
    }
  }
  if (!rentTargetContam) console.log("  汚染なし ✅");

  // ③ livingCostTarget 汚染: VN の旧値(6000000)が焼き込まれているペルソナ
  console.log("\n=== ③ livingCostTarget 汚染チェック (VN: 6000000→9000000) ===");
  for (const p of personas) {
    const newLiving = NEW_LIVING[p.country_code];
    if (newLiving === undefined) continue;
    const si = p.simulation_input as Record<string, unknown> | null;
    const livingTarget = si?.livingCostTarget as number | undefined;
    if (livingTarget !== undefined && livingTarget !== newLiving) {
      livingContam++;
      console.log(`  ⚠️  ${p.country_code} "${p.attribute}" livingCostTarget=${livingTarget} (→ 要: ${newLiving})`);
    }
  }
  if (!livingContam) console.log("  汚染なし ✅");

  console.log("\n=== サマリー ===");
  console.log(`  rentCurrent汚染 (JP新値不一致): ${jpContam}件`);
  console.log(`  rentTarget汚染 (補正国旧値):   ${rentTargetContam}件`);
  console.log(`  livingCostTarget汚染 (VN):     ${livingContam}件`);
  console.log(`  合計汚染ペルソナ数: ${jpContam + rentTargetContam + livingContam}件`);
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
