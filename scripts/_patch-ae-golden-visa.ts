/**
 * visa-ae ゴールデンビザセクションの修正
 * u.ae 公式ポータル（2026-03-24付）掲載情報に基づき、2ルート構造を正確に記述する
 *
 * 修正前: 「最低条件や重要数値：なし / 有効期間：10年」（誤り）
 * 修正後: 5年ルート（不動産AED 200万 OR 年税AED 25万事業体出資）+ 10年ルート（公的投資AED 200万）
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

// ─── 置換定義 ──────────────────────────────────────────────────────────────────

const FIXES: Record<"ja" | "en" | "zh", [string, string]> = {
  ja: [
    `**ゴールデンビザ**
特定の条件を満たす投資家や専門職向けの長期ビザです。
- 要件：高額な投資または特定の専門職
- **最低条件や重要数値**：なし
- 有効期間：10年
- 申請費用：公式サイトでご確認ください`,
    `**ゴールデンビザ（5年・投資家ルート）**
投資家向けの長期居住ビザです。以下の2ルートのいずれかを満たすことで申請可能です（u.ae公式ポータル掲載情報）。
- **ルートA（不動産所有）**：最低元本AED 200万以上の不動産を所有していること
- **ルートB（事業体出資）**：年間AED 25万以上の税金を納める事業体への出資を行っていること
- 有効期間：5年（更新可能）
- 申請費用：公式サイトでご確認ください

**ゴールデンビザ（10年・公的投資ルート）**
UAE公的セクターへの高額投資者向けのビザです。
- **最低投資額**：AED 200万（公的投資ファンド・政府認定企業の設立等）
- 有効期間：10年（更新可能）
- 申請費用：公式サイトでご確認ください`,
  ],
  en: [
    `**Golden Visa**
A long-term residency visa for investors, entrepreneurs, and specialized talents.
- Requirements: Investment in UAE, or exceptional talent in specific fields.
- **Key threshold or figure**: N/A
- Validity: 5 to 10 years.
- Application fee: Check the official site for current fees.`,
    `**Golden Visa (5-Year — Investor Route)**
A long-term residency visa for investors. Eligible under either of the following two routes (source: u.ae official portal):
- **Route A (Property Ownership)**: Owning property with a minimum capital of AED 2 million.
- **Route B (Tax-Contributing Establishment)**: Contributing to an establishment that pays at least AED 250,000 annually in taxes.
- Validity: 5 years (renewable).
- Application fee: Check the official site for current fees.

**Golden Visa (10-Year — Public Investment Route)**
For those who make a major investment in UAE public sectors.
- **Minimum investment**: AED 2 million (public investment funds, establishing a government-approved company, etc.)
- Validity: 10 years (renewable).
- Application fee: Check the official site for current fees.`,
  ],
  zh: [
    `**工作机会探索签证**
为希望在阿联酋寻找工作机会的人士提供的短期签证。
- 要求：无特定要求，适合所有求职者
- **关键条件或数字**：单次入境
- 有效期：请参阅阿联酋政府官方网站确认
- 申请费用：请参阅阿联酋政府官方网站确认`,
    `**黄金签证（5年・投资者路线）**
面向投资者的长期居留签证，满足以下两条路线之一即可申请（来源：u.ae官方门户，2026年3月更新）。
- **路线A（房产持有）**：持有最低本金AED 200万以上的房产
- **路线B（纳税企业出资）**：向年纳税额不低于AED 25万的企业进行出资
- 有效期：5年（可续签）
- 申请费用：请参阅阿联酋政府官方网站确认

**黄金签证（10年・公共投资路线）**
面向向阿联酋公共部门进行大额投资者的签证。
- **最低投资额**：AED 200万（公共投资基金、设立政府认可企业等）
- 有效期：10年（可续签）
- 申请费用：请参阅阿联酋政府官方网站确认`,
  ],
};

async function main() {
  const { data, error } = await sb
    .from("blog_posts")
    .select("content")
    .eq("slug", "visa-ae")
    .single();
  if (error || !data) { console.error("visa-ae 取得失敗:", error?.message); process.exit(1); }

  const content = data.content as Record<string, string>;
  let changed = false;

  for (const lang of ["ja", "en", "zh"] as const) {
    const [from, to] = FIXES[lang];
    if (content[lang]?.includes(from)) {
      content[lang] = content[lang].replace(from, to);
      console.log(`  ✅ [${lang}] ゴールデンビザセクション修正完了`);
      changed = true;
    } else {
      console.log(`  ⚠️  [${lang}] 対象テキスト未発見（スキップ）`);
      // デバッグ用: 何が入っているか確認
      const lines = (content[lang] ?? "").split("\n");
      const visaLines = lines.filter(l => l.includes("Golden") || l.includes("ゴールデン") || l.includes("黄金") || l.includes("工作机会"));
      if (visaLines.length > 0) {
        console.log(`     現在の該当行: ${visaLines.join(" | ")}`);
      }
    }
  }

  if (!changed) {
    console.log("変更なし（既に修正済みか対象テキスト不一致）");
    return;
  }

  const { error: updateErr } = await sb
    .from("blog_posts")
    .update({ content })
    .eq("slug", "visa-ae");
  if (updateErr) {
    console.error("visa-ae 更新失敗:", updateErr.message);
    process.exit(1);
  }
  console.log("\n✅ visa-ae DB更新完了");
}

main().catch(e => { console.error(e); process.exit(1); });
