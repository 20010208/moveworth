/**
 * C-2: VN tax sources の入れ替え
 *  - tuyenquang.gdt.gov.vn（地方税務署、不適切）を削除
 *  - nif.mof.gov.vn（財務省NIFポータル、税率表あり）を登録
 *  - chinhphu.vn（政府ポータル、法令109/2025/QH15紹介）を登録
 */
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
  // 1. 削除: tuyenquang.gdt.gov.vn
  const { error: delErr, count } = await sb
    .from("country_sources")
    .delete({ count: "exact" })
    .eq("country_code", "vn")
    .ilike("url", "%tuyenquang.gdt.gov.vn%");
  if (delErr) { console.error("❌ 削除失敗:", delErr.message); process.exit(1); }
  console.log(`✅ 削除: tuyenquang.gdt.gov.vn (${count}件)`);

  // 2. 登録: 国レベル一次ソース2件
  const { error: insErr } = await sb.from("country_sources").insert([
    {
      country_code: "vn",
      url: "https://nif.mof.gov.vn/hoidapcstc/home/cthoidap/159079",
      purpose: "tax",
      source: "manual",
      status: "alive",
    },
    {
      country_code: "vn",
      url: "https://xaydungchinhsach.chinhphu.vn/gioi-thieu-luat-thue-thu-nhap-ca-nhan-so-109-2025-qh15-119260123145437408.htm",
      purpose: "tax",
      source: "manual",
      status: "alive",
    },
  ]);
  if (insErr) { console.error("❌ 登録失敗:", insErr.message); process.exit(1); }
  console.log("✅ 登録: nif.mof.gov.vn + chinhphu.vn");

  // 3. 確認: VN sources 全件
  const { data } = await sb
    .from("country_sources")
    .select("url, purpose, source, status")
    .eq("country_code", "vn")
    .order("purpose");
  console.log("\n=== VN country_sources 最終状態 ===");
  for (const r of data ?? []) console.log(`[${r.purpose}/${r.status}/${r.source}] ${r.url}`);
}
main().catch(e => { console.error(e); process.exit(1); });
