/**
 * B-3: visa-{code} ↔ visa-guide クロスリンク追加
 *
 * - visa-{code} 記事フッターに対応するガイドへのリンクを追加
 * - visa-guide 記事フッターに対応する visa-{code} 概要へのリンクを追加
 * - 冪等: <!-- b3-crosslink --> マーカーが既にある場合はスキップ
 * - assertBlogPayload でバリデーション後に update
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
import { assertBlogPayload } from "./utils/validate-blog-payload";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const MARKER = "<!-- b3-crosslink -->";

interface Pair {
  code: string;
  visaSlug: string;
  guideSlug: string;
  country: { ja: string; en: string; zh: string };
  guideLabel: { ja: string; en: string; zh: string };
}

const PAIRS: Pair[] = [
  {
    code: "es", visaSlug: "visa-es", guideSlug: "spain-digital-nomad-visa-guide-2026",
    country: { ja: "スペイン", en: "Spain", zh: "西班牙" },
    guideLabel: { ja: "スペイン デジタルノマドビザ 完全ガイド 2026", en: "Spain Digital Nomad Visa – Complete Guide 2026", zh: "西班牙数字游民签证完整指南 2026" },
  },
  {
    code: "ca", visaSlug: "visa-ca", guideSlug: "canada-express-entry-guide-2026",
    country: { ja: "カナダ", en: "Canada", zh: "加拿大" },
    guideLabel: { ja: "カナダ エクスプレスエントリー 完全ガイド 2026", en: "Canada Express Entry – Complete Guide 2026", zh: "加拿大快速通道完整指南 2026" },
  },
  {
    code: "au", visaSlug: "visa-au", guideSlug: "australia-skilled-independent-visa-189-guide-2026",
    country: { ja: "オーストラリア", en: "Australia", zh: "澳大利亚" },
    guideLabel: { ja: "オーストラリア 技術独立ビザ（189）完全ガイド 2026", en: "Australia Skilled Independent Visa (189) – Complete Guide 2026", zh: "澳大利亚独立技术移民签证（189）完整指南 2026" },
  },
  {
    code: "sg", visaSlug: "visa-sg", guideSlug: "singapore-ep-employment-pass-guide-2026",
    country: { ja: "シンガポール", en: "Singapore", zh: "新加坡" },
    guideLabel: { ja: "シンガポール エンプロイメントパス 完全ガイド 2026", en: "Singapore Employment Pass – Complete Guide 2026", zh: "新加坡就业准证完整指南 2026" },
  },
  {
    code: "th", visaSlug: "visa-th", guideSlug: "thailand-ltr-visa-guide-2026",
    country: { ja: "タイ", en: "Thailand", zh: "泰国" },
    guideLabel: { ja: "タイ LTRビザ 完全ガイド 2026", en: "Thailand LTR Visa – Complete Guide 2026", zh: "泰国长期居留签证完整指南 2026" },
  },
  {
    code: "my", visaSlug: "visa-my", guideSlug: "malaysia-mm2h-visa-complete-guide-2026",
    country: { ja: "マレーシア", en: "Malaysia", zh: "马来西亚" },
    guideLabel: { ja: "マレーシア MM2H ビザ 完全ガイド 2026", en: "Malaysia MM2H Visa – Complete Guide 2026", zh: "马来西亚MM2H签证完整指南 2026" },
  },
  {
    code: "ae", visaSlug: "visa-ae", guideSlug: "dubai-uae-golden-visa-guide-2026",
    country: { ja: "UAE（ドバイ）", en: "UAE (Dubai)", zh: "阿联酋（迪拜）" },
    guideLabel: { ja: "UAE ゴールデンビザ 完全ガイド 2026", en: "UAE Golden Visa – Complete Guide 2026", zh: "阿联酋黄金签证完整指南 2026" },
  },
  {
    code: "nz", visaSlug: "visa-nz", guideSlug: "new-zealand-skilled-migrant-visa-guide-2026",
    country: { ja: "ニュージーランド", en: "New Zealand", zh: "新西兰" },
    guideLabel: { ja: "ニュージーランド 技能移民ビザ 完全ガイド 2026", en: "New Zealand Skilled Migrant Visa – Complete Guide 2026", zh: "新西兰技术移民签证完整指南 2026" },
  },
  {
    code: "vn", visaSlug: "visa-vn", guideSlug: "vietnam-visa-guide-2026",
    country: { ja: "ベトナム", en: "Vietnam", zh: "越南" },
    guideLabel: { ja: "ベトナム ビザ 完全ガイド 2026", en: "Vietnam Visa – Complete Guide 2026", zh: "越南签证完整指南 2026" },
  },
];

function buildVisaToGuideAppend(p: Pair, lang: "ja" | "en" | "zh"): string {
  if (lang === "ja") return (
    `\n\n${MARKER}\n\n---\n\n## 詳細ガイド\n\n` +
    `${p.country.ja}のビザプログラムの詳細については、以下のガイドをご参照ください。\n\n` +
    `- [${p.guideLabel.ja}](/blog/${p.guideSlug})\n`
  );
  if (lang === "en") return (
    `\n\n${MARKER}\n\n---\n\n## Detailed Guide\n\n` +
    `For more details on a specific ${p.country.en} visa program, see the guide below.\n\n` +
    `- [${p.guideLabel.en}](/blog/${p.guideSlug})\n`
  );
  return (
    `\n\n${MARKER}\n\n---\n\n## 详细指南\n\n` +
    `如需了解${p.country.zh}特定签证项目的详情，请参阅以下指南。\n\n` +
    `- [${p.guideLabel.zh}](/blog/${p.guideSlug})\n`
  );
}

function buildGuideToVisaAppend(p: Pair, lang: "ja" | "en" | "zh"): string {
  if (lang === "ja") return (
    `\n\n${MARKER}\n\n---\n\n## 関連情報\n\n` +
    `${p.country.ja}のビザ・移住手続き全般については、以下の概要ページもご覧ください。\n\n` +
    `- [${p.country.ja} ビザ・移住ガイド（概要）](/blog/${p.visaSlug})\n`
  );
  if (lang === "en") return (
    `\n\n${MARKER}\n\n---\n\n## Related\n\n` +
    `For a general overview of visas and immigration in ${p.country.en}, see the page below.\n\n` +
    `- [${p.country.en} Visa & Immigration Overview](/blog/${p.visaSlug})\n`
  );
  return (
    `\n\n${MARKER}\n\n---\n\n## 相关信息\n\n` +
    `如需了解${p.country.zh}签证和移民手续的综合概览，请参阅以下页面。\n\n` +
    `- [${p.country.zh}签证与移民概览](/blog/${p.visaSlug})\n`
  );
}

type ContentMap = { ja?: string; en?: string; zh?: string };

async function fetchContent(slug: string): Promise<ContentMap | null> {
  const { data, error } = await sb
    .from("blog_posts")
    .select("content")
    .eq("slug", slug)
    .single();
  if (error || !data) { console.error(`  ❌ fetch failed: ${slug} — ${error?.message}`); return null; }
  return data.content as ContentMap;
}

async function updateContent(slug: string, content: ContentMap): Promise<void> {
  const langs = (Object.keys(content) as ("ja" | "en" | "zh")[]).filter(k => content[k]);
  assertBlogPayload({ content, locales: langs }, slug);
  const { error } = await sb.from("blog_posts").update({ content }).eq("slug", slug);
  if (error) throw new Error(`update failed for ${slug}: ${error.message}`);
}

async function main() {
  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const p of PAIRS) {
    console.log(`\n--- ${p.code.toUpperCase()} ---`);

    // 1. visa-{code} → append guide link
    const visaContent = await fetchContent(p.visaSlug);
    if (visaContent) {
      const newContent: ContentMap = {};
      let modified = false;
      for (const lang of ["ja", "en", "zh"] as const) {
        const existing = visaContent[lang];
        if (!existing) continue;
        if (existing.includes(MARKER)) {
          newContent[lang] = existing;
          console.log(`  ⏭  ${p.visaSlug} [${lang}] 既にマーカーあり、スキップ`);
          totalSkipped++;
        } else {
          newContent[lang] = existing + buildVisaToGuideAppend(p, lang);
          modified = true;
        }
      }
      if (modified) {
        await updateContent(p.visaSlug, newContent);
        console.log(`  ✅ ${p.visaSlug} — ガイドリンク追加`);
        totalUpdated++;
      }
    }

    // 2. guide → append visa-{code} link
    const guideContent = await fetchContent(p.guideSlug);
    if (guideContent) {
      const newContent: ContentMap = {};
      let modified = false;
      for (const lang of ["ja", "en", "zh"] as const) {
        const existing = guideContent[lang];
        if (!existing) continue;
        if (existing.includes(MARKER)) {
          newContent[lang] = existing;
          console.log(`  ⏭  ${p.guideSlug} [${lang}] 既にマーカーあり、スキップ`);
          totalSkipped++;
        } else {
          newContent[lang] = existing + buildGuideToVisaAppend(p, lang);
          modified = true;
        }
      }
      if (modified) {
        await updateContent(p.guideSlug, newContent);
        console.log(`  ✅ ${p.guideSlug} — visa概要リンク追加`);
        totalUpdated++;
      }
    }
  }

  console.log(`\n=== 完了: ${totalUpdated} 件更新 / ${totalSkipped} 件スキップ ===`);
}

main().catch(e => { console.error(e); process.exit(1); });
