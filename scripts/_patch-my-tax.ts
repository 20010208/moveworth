// visa-my 税金セクション targeted patch — hasil.gov.my 公式データ挿入
// MM2H・その他セクションは変更しない
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const HASIL_URL = "https://www.hasil.gov.my/en/individu/kadar-cukai/";

const JA_OLD = "**所得税**：最新の税制は移住先国の税務当局または公式情報でご確認ください。\n**消費税**：現在の税率は公式情報でご確認ください。";
const JA_NEW = `**所得税**（居住者・2023〜2025年度、HASiL公式資料より）：

| 課税所得（RM）| 税率 |
|---|---|
| 0 – 5,000 | 0% |
| 5,001 – 20,000 | 1% |
| 20,001 – 35,000 | 3% |
| 35,001 – 50,000 | 6% |
| 50,001 – 70,000 | 11% |
| 70,001 – 100,000 | 19% |
| 100,001 – 400,000 | 25% |
| 400,001 – 600,000 | 26% |
| 600,001 – 2,000,000 | 28% |
| 2,000,000超 | 30% |

**消費税**：マレーシアでは GST は廃止済みのため現在課されません。一部商品・サービスには SST（売上・サービス税）が課されます。詳細は公式サイトでご確認ください。`;

const EN_OLD = "**Income tax**: For current tax rates, please refer to the official tax authority of the destination country.";
const EN_NEW = `**Income tax** (residents, YA 2023–2025, source: HASiL):

| Chargeable Income (RM) | Rate |
|---|---|
| 0 – 5,000 | 0% |
| 5,001 – 20,000 | 1% |
| 20,001 – 35,000 | 3% |
| 35,001 – 50,000 | 6% |
| 50,001 – 70,000 | 11% |
| 70,001 – 100,000 | 19% |
| 100,001 – 400,000 | 25% |
| 400,001 – 600,000 | 26% |
| 600,001 – 2,000,000 | 28% |
| Exceeding 2,000,000 | 30% |`;

const ZH_OLD = "**所得税**：\n- Malaysia的所得税率根据收入水平而定，有关当前税率，请参阅Malaysia税务机关的官方信息。";
const ZH_NEW = `**所得税**（居民，2023–2025纳税年度，来源：HASiL）：

| 应纳税所得额（RM）| 税率 |
|---|---|
| 0 – 5,000 | 0% |
| 5,001 – 20,000 | 1% |
| 20,001 – 35,000 | 3% |
| 35,001 – 50,000 | 6% |
| 50,001 – 70,000 | 11% |
| 70,001 – 100,000 | 19% |
| 100,001 – 400,000 | 25% |
| 400,001 – 600,000 | 26% |
| 600,001 – 2,000,000 | 28% |
| 超过2,000,000 | 30% |`;

const FIXES = {
  ja: {
    tax_old: JA_OLD, tax_new: JA_NEW,
    ref_old: "- [マレーシア観光省 MM2H - ガイドライン - 観光・芸術・文化省](https://www.mm2h.gov.my/apply/guidelines)",
    ref_new: `- [マレーシア内国歳入庁（HASiL）- 個人所得税率](${HASIL_URL})\n- [マレーシア観光省 MM2H - ガイドライン - 観光・芸術・文化省](https://www.mm2h.gov.my/apply/guidelines)`,
  },
  en: {
    tax_old: EN_OLD, tax_new: EN_NEW,
    ref_old: "- [マレーシア観光省 MM2H - Guidelines - Ministry of Tourism, Arts and Culture](https://www.mm2h.gov.my/apply/guidelines)",
    ref_new: `- [Inland Revenue Board of Malaysia (HASiL) – Individual Tax Rates](${HASIL_URL})\n- [マレーシア観光省 MM2H - Guidelines - Ministry of Tourism, Arts and Culture](https://www.mm2h.gov.my/apply/guidelines)`,
  },
  zh: {
    tax_old: ZH_OLD, tax_new: ZH_NEW,
    ref_old: "- [マレーシア観光省 MM2H - 指南 - 旅游、艺术和文化部](https://www.mm2h.gov.my/apply/guidelines)",
    ref_new: `- [马来西亚内陆税收局（HASiL）- 个人所得税率](${HASIL_URL})\n- [マレーシア観光省 MM2H - 指南 - 旅游、艺术和文化部](https://www.mm2h.gov.my/apply/guidelines)`,
  },
};

async function main() {
  const { data, error } = await sb.from("blog_posts").select("content,is_published").eq("slug","visa-my").single();
  if (error || !data) { console.error("visa-my 取得失敗:", error?.message); process.exit(1); }

  const content = data.content as Record<string,string>;
  let changed = false;

  for (const lang of ["ja","en","zh"] as const) {
    const fix = FIXES[lang];
    if (!content[lang]) { console.log(`  ⚠️  [${lang}] コンテンツなし`); continue; }

    if (content[lang].includes(fix.tax_old)) {
      content[lang] = content[lang].replace(fix.tax_old, fix.tax_new);
      console.log(`  ✅ [${lang}] 税率テーブル挿入`);
      changed = true;
    } else {
      const idx = content[lang].indexOf("所得税") >= 0 ? content[lang].indexOf("所得税") : content[lang].indexOf("Income tax");
      console.log(`  ⚠️  [${lang}] tax_old 未発見（現在: "${content[lang].slice(idx, idx + 60)}"）`);
    }

    if (content[lang].includes(fix.ref_old) && !content[lang].includes(HASIL_URL)) {
      content[lang] = content[lang].replace(fix.ref_old, fix.ref_new);
      console.log(`  ✅ [${lang}] 参考資料に HASiL 追加`);
    }
  }

  if (!changed) { console.log("変更なし"); return; }

  const { error: upErr } = await sb.from("blog_posts").update({ content }).eq("slug","visa-my");
  if (upErr) { console.error("更新失敗:", upErr.message); process.exit(1); }
  console.log("\n✅ visa-my 税率パッチ完了（is_published:", data.is_published, "）");
  console.log("  MM2H セクションは変更なし ✅");
}
main().catch(e => { console.error(e); process.exit(1); });
