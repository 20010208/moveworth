import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(); if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const MASTER = ["nz","be","tn","pl","ee","cy","hr","hu","ro","fi","bg","my","th","au","us","sg","gb","nl","fr","it","at","ie","ca","kr","se","no","dk","cz","gr","mt","ae","de","ge","hk","in","jp","ph","tw","za","br","cn","co","id","vn","ar","ch","pt","es","mx","tr"];
const MASTER_SET = new Set(MASTER);
const PRESET_UPPER = ["JP","SG","MY","TH","KR","TW","HK","ID","PH","VN","US","CA","GB","DE","FR","NL","CH","AU","NZ","AE","PT","ES","GE","IE","SE","NO","DK","BR","CO","IT","GR","MT","ZA","FI","AT","CZ","CN","IN","MX","AR","BE","PL","TN","TR","RO","BG","CY","EE","HR","HU"];
const PRESET_SET = new Set(PRESET_UPPER.map(c => c.toLowerCase()));

async function main() {
  // [1] PRESET vs MASTER
  console.log("=== [1] country-presets vs master-countries ===");
  console.log(`PRESET: ${PRESET_SET.size}カ国, MASTER: ${MASTER_SET.size}カ国`);
  const onlyInPreset = [...PRESET_SET].filter(c => !MASTER_SET.has(c));
  const onlyInMaster = [...MASTER_SET].filter(c => !PRESET_SET.has(c));
  if (onlyInPreset.length === 0 && onlyInMaster.length === 0) {
    console.log("✅ 完全一致（50カ国, 国コードも全一致）");
  } else {
    if (onlyInPreset.length) console.log("PRESET のみ:", onlyInPreset.sort());
    if (onlyInMaster.length) console.log("MASTER のみ:", onlyInMaster.sort());
  }

  // [2] DB取得
  const [{ data: visaRows }, { data: studyRows }] = await Promise.all([
    sb.from("blog_posts").select("slug,is_published").ilike("slug","visa-%").order("slug"),
    sb.from("study_blog_posts").select("slug,is_published").order("slug"),
  ]);

  // visa-{code}
  const visaMap = new Map<string, boolean>();
  for (const r of visaRows ?? []) {
    const m = r.slug.match(/^visa-([a-z]+)$/);
    if (m && MASTER_SET.has(m[1])) visaMap.set(m[1], r.is_published);
  }

  // study-country-{code}
  const scMap = new Map<string, boolean>();
  for (const r of studyRows ?? []) {
    const m = r.slug.match(/^study-country-([a-z]+)$/);
    if (m && MASTER_SET.has(m[1])) scMap.set(m[1], r.is_published);
  }

  // study-work-{code}（就労ルール記事）
  const swMap = new Map<string, boolean>();
  for (const r of studyRows ?? []) {
    const m = r.slug.match(/^study-work-([a-z]+)$/);
    if (m && MASTER_SET.has(m[1])) swMap.set(m[1], r.is_published);
  }

  // [3] 対照表
  console.log("\n=== [2] MASTER 50カ国 × DB 実態 対照表 ===");
  const H = (s: string, w: number) => s.padEnd(w);
  console.log(H("code",5) + "| " + H("visa(blog_posts)",18) + "| " + H("study-country",16) + "| study-work-{code}");
  console.log("-----|------------------|----------------|------------------");
  for (const code of [...MASTER].sort()) {
    const v = visaMap.has(code) ? (visaMap.get(code) ? "✅公開" : "📝draft") : "❌なし";
    const sc = scMap.has(code) ? (scMap.get(code) ? "✅公開" : "📝draft") : "❌なし";
    const sw = swMap.has(code) ? (swMap.get(code) ? "✅公開" : "📝draft") : "❌なし";
    console.log(H(code,5) + "| " + H(v,18) + "| " + H(sc,16) + "| " + sw);
  }

  // [4] サマリー
  const fmt = (m: Map<string,boolean>) =>
    `公開 ${[...m.values()].filter(Boolean).length} / draft ${[...m.values()].filter(x=>!x).length} / なし ${50 - m.size}`;
  console.log("\n=== [3] サマリー（全50カ国中）===");
  console.log("visa(blog_posts):   " + fmt(visaMap));
  console.log("study-country:      " + fmt(scMap));
  console.log("study-work-{code}:  " + fmt(swMap));

  // [5] 未生成国コード
  const noVisa = MASTER.filter(c => !visaMap.has(c)).sort();
  const noSC = MASTER.filter(c => !scMap.has(c)).sort();
  const noSW = MASTER.filter(c => !swMap.has(c)).sort();
  if (noVisa.length) console.log("\nvisa 未生成:              [" + noVisa.join(", ") + "]");
  if (noSC.length) console.log("study-country 未生成:     [" + noSC.join(", ") + "]");
  if (noSW.length) console.log("study-work-{code} 未生成: [" + noSW.join(", ") + "]");

  // [6] draft のみ（公開されていない）
  const draftVisa = MASTER.filter(c => visaMap.has(c) && !visaMap.get(c)).sort();
  const draftSC = MASTER.filter(c => scMap.has(c) && !scMap.get(c)).sort();
  const draftSW = MASTER.filter(c => swMap.has(c) && !swMap.get(c)).sort();
  if (draftVisa.length) console.log("\nvisa draft（未公開）:              [" + draftVisa.join(", ") + "]");
  if (draftSC.length) console.log("study-country draft（未公開）:     [" + draftSC.join(", ") + "]");
  if (draftSW.length) console.log("study-work-{code} draft（未公開）: [" + draftSW.join(", ") + "]");
}

main().catch(e => { console.error(e); process.exit(1); });
