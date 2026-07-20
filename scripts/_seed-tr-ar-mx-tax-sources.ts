/**
 * TR / AR / MX の tax country_sources 登録
 * TR: GIB CDN PDF (2025 Gelir Vergisi Tarifesi) ✅
 * AR: AFIP Art.94 年間スケール 2025 ✅
 * MX: SAT Anexo8 RMF2025 PDF（504のため unverified で登録）
 */
import { existsSync, readFileSync } from "fs";
if (existsSync(".env.local")) {
  for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = l.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(); if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const ROWS = [
  {
    country_code: "tr",
    url: "https://cdn.gib.gov.tr/api/gibportal-file/file/getFileResources?objectKey=arsiv%2Fyardim-kaynaklar%2Fyararli-bilgiler%2Fgelir-vergisi-tarifeleri%2Fgelir-vergisi-tarifesi-2025.pdf",
    purpose: "tax",
    source: "manual",
    status: "alive",
    notes: "GIB 2025 Gelir Vergisi Tarifesi PDF (GVK 103. madde): 0-158K TL=15%, 158K-330K=20%, 330K-800K=27%, 800K-4300K=35%, 4300K+=40%",
  },
  {
    country_code: "ar",
    url: "https://www.afip.gob.ar/gananciasYBienes/ganancias/personas-humanas-sucesiones-indivisas/declaracion-jurada/documentos/Tabla-Art-94-LIG-liquidacion-anual-y-final-2025.pdf",
    purpose: "tax",
    source: "manual",
    status: "alive",
    notes: "AFIP Art.94 Escala anual 2025: 5/9/12/15/19/23/27/31/35%. Max bracket 35% on 53.2M+ ARS",
  },
  {
    country_code: "mx",
    url: "http://omawww.sat.gob.mx/normatividad_RMF_RGCE/Paginas/documentos2025/rmf/anexos/Anexo8_RMF2025-30122024.pdf",
    purpose: "tax",
    source: "manual",
    status: "alive",
    notes: "SAT Anexo8 RMF2025 PDF (ISR tarifa anual). omawww サブドメイン経由で取得。11段階: 1.92-35%。年間上限 4,511,707+ MXN=35%",
  },
];

// country_sources に notes カラムがない可能性があるため、notesは除外したバージョンも用意
const ROWS_NO_NOTES = ROWS.map(({ notes: _, ...r }) => r);

async function main() {
  console.log("=== TR/AR/MX tax sources 登録 ===\n");

  for (let i = 0; i < ROWS.length; i++) {
    const r = ROWS[i];
    // まず notes 付きで試みる
    const { error } = await sb.from("country_sources").insert(ROWS_NO_NOTES[i]);
    if (error) {
      console.error(`❌ ${r.country_code} tax: ${error.message}`);
    } else {
      console.log(`✅ ${r.country_code} [tax]: ${r.url.slice(0, 80)}`);
      console.log(`   status=${r.status}`);
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });
