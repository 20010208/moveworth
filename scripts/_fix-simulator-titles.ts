/**
 * simulator-* 記事のタイトル・descriptionに残存する国コード（AE/KR/NL/SG）を
 * 日本語・英語・中国語の国名に置換する。
 * content（記事本文）は一切変更しない。
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const UPDATES = [
  {
    slug: "simulator-ae-eng-single-2026",
    title: {
      ja: "シミュレーション：30代エンジニアがUAE（ドバイ）移住で資産形成を目指す場合の10年後",
      en: "Simulation: 10 Years Later for a 30s Engineer Aiming for Asset Formation by Moving to UAE (Dubai)",
      zh: "模拟：30多岁工程师通过移居阿联酋（迪拜）实现资产增值的10年后",
    },
    description: {
      ja: "30代エンジニアがUAE（ドバイ）に移住した場合の資産形成シミュレーション結果を解説。日本との収入・支出比較や5年後・10年後の資産推移を詳しく紹介します。",
      en: "Explanation of the asset formation simulation results for a 30s engineer moving to UAE (Dubai). Detailed introduction of income and expenditure comparison with Japan and asset transition after 5 and 10 years.",
      zh: "解读30多岁工程师移居阿联酋（迪拜）后的资产增值模拟结果。详细介绍与日本的收入和支出比较，以及5年后和10年后的资产变化。",
    },
  },
  {
    slug: "simulator-kr-eng-single-2026",
    title: {
      ja: "30代エンジニアが韓国移住で10年後の資産形成をシミュレーション",
      en: "Simulation of Asset Formation for a 30s Engineer Moving to South Korea in 10 Years",
      zh: "30多岁工程师通过移居韩国模拟10年后的资产形成",
    },
    description: {
      ja: "30代エンジニアが韓国に移住した場合の資産形成をシミュレーション。月間キャッシュフローや資産推移を詳しく解説。",
      en: "Simulation of asset formation for a 30s engineer moving to South Korea. Detailed explanation of monthly cash flow and asset trends.",
      zh: "模拟30多岁工程师移居韩国时的资产形成。详细解说月度现金流和资产变化。",
    },
  },
  {
    slug: "simulator-nl-eng-single-2026",
    title: {
      ja: "シミュレーション：30代エンジニアがオランダ移住で資産形成を目指したら？",
      en: "Simulation: What if a 30s Engineer Aims for Asset Building by Moving to the Netherlands?",
      zh: "模拟：30多岁的工程师如果移居荷兰以实现资产增值会怎样？",
    },
    description: {
      ja: "30代エンジニアがオランダに移住した場合の資産形成シミュレーション。日本とオランダでの生活費、税率、為替の影響を比較し、5年後・10年後の資産推移を分析します。",
      en: "A simulation of asset building if a 30s engineer moves to the Netherlands. We compare living costs, tax rates, and currency impacts between Japan and the Netherlands, and analyze asset trends after 5 and 10 years.",
      zh: "模拟30多岁的工程师移居荷兰后的资产增值情况。比较日本和荷兰的生活费用、税率、汇率影响，分析5年后和10年后的资产变化。",
    },
  },
  {
    slug: "simulator-sg-couple-2026",
    title: {
      ja: "シミュレーション：30代夫婦共働きがシンガポール移住で資産形成を目指す",
      en: "Simulation: 30s Dual-Income Couple Aiming for Asset Building by Moving to Singapore",
      zh: "模拟：30多岁双职工夫妇通过移居新加坡实现资产增值",
    },
    description: {
      ja: "30代共働き夫婦がシンガポール移住を検討した場合の資産形成シミュレーション。5年後・10年後の資産推移や税制、生活費の影響を分析します。",
      en: "A simulation of asset building for a dual-income couple in their 30s considering moving to Singapore. Analyzes asset trends, tax systems, and living expenses 5 and 10 years later.",
      zh: "30多岁双职工夫妇考虑移居新加坡时的资产增值模拟。分析5年后和10年后的资产变化、税制和生活费用的影响。",
    },
  },
] as const;

async function main() {
  console.log("=== simulator-* タイトル・description 国コード置換 ===\n");

  for (const u of UPDATES) {
    const { error } = await sb
      .from("blog_posts")
      .update({ title: u.title, description: u.description })
      .eq("slug", u.slug);

    if (error) {
      console.error(`❌ ${u.slug}: ${error.message}`);
      process.exit(1);
    }
    console.log(`✅ ${u.slug}`);
    console.log(`   title.ja:  ${u.title.ja}`);
    console.log(`   title.en:  ${u.title.en}`);
    console.log(`   title.zh:  ${u.title.zh}`);
    console.log(`   desc.ja:   ${u.description.ja}`);
    console.log(`   desc.en:   ${u.description.en}`);
    console.log(`   desc.zh:   ${u.description.zh}`);
    console.log();
  }

  console.log(`合計 ${UPDATES.length}件 更新完了`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
