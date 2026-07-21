/**
 * BL-20260721-06 — visa-bg / visa-cy 参考資料セクション欠落の対象限定パッチ
 *
 * - visa-bg: content.ja / content.en / content.zh に参考資料を追加
 * - visa-cy: content.zh に参考資料を追加
 * - 登録済みの政府公式visaソースだけを使用
 * - 対象外blog_posts、対象外言語、title、description、公開状態を変更しない
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { assertBlogPayload } from "./utils/validate-blog-payload";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 0) continue;
    const key = trimmed.slice(0, separator).trim();
    if (!(key in process.env)) {
      process.env[key] = trimmed.slice(separator + 1).trim();
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が未設定です");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const targetSlugs = ["visa-bg", "visa-cy"] as const;
type TargetSlug = (typeof targetSlugs)[number];
type Lang = "ja" | "en" | "zh";

type BlogRow = {
  slug: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string | null;
  locales: string[] | null;
  title: Record<string, string> | null;
  description: Record<string, string> | null;
  content: Record<string, string> | null;
};

type SourceSpec = {
  url: string;
  labels: Record<Lang, string>;
};

const sourceSpecs: Record<TargetSlug, readonly SourceSpec[]> = {
  "visa-bg": [
    {
      url: "https://iisda.government.bg/adm_services/services/service_provision/38527",
      labels: {
        ja: "ブルガリア政府行政サービス登録 — Visa D（長期滞在査証）",
        en: "Bulgarian Government Administrative Services Register — Visa D",
        zh: "保加利亚政府行政服务登记 — D类长期居留签证",
      },
    },
    {
      url: "https://iisda.government.bg/adm_services/services/service_provision/21815",
      labels: {
        ja: "ブルガリア政府行政サービス登録 — 非EU市民の継続滞在許可",
        en: "Bulgarian Government Administrative Services Register — Continued Residence for Non-EU Citizens",
        zh: "保加利亚政府行政服务登记 — 非欧盟公民继续居留许可",
      },
    },
  ],
  "visa-cy": [
    {
      url: "https://www.gov.cy/en/information/visas/",
      labels: {
        ja: "キプロス政府 — ビザ",
        en: "Cyprus Government — Visas",
        zh: "塞浦路斯政府 — 签证",
      },
    },
    {
      url: "https://www.gov.cy/mip-md/en/documents/procedure-for-application-submission-for-entry-and-residence-and-processing-time/",
      labels: {
        ja: "キプロス移民局 — 入国・居住申請手順",
        en: "Cyprus Migration Department — Entry and Residence Application Procedure",
        zh: "塞浦路斯移民局 — 入境与居留申请程序",
      },
    },
    {
      url: "https://www.gov.cy/mip-md/en/documents/visitors-and-family-members/",
      labels: {
        ja: "キプロス移民局 — 訪問者と家族",
        en: "Cyprus Migration Department — Visitors and Family Members",
        zh: "塞浦路斯移民局 — 访客及家庭成员",
      },
    },
    {
      url: "https://www.gov.cy/mip-md/en/documents/companies-investors-permanent-residence-3/immigration-permits/",
      labels: {
        ja: "キプロス移民局 — 移民許可",
        en: "Cyprus Migration Department — Immigration Permits",
        zh: "塞浦路斯移民局 — 移民许可",
      },
    },
  ],
};

const patchLangs: Record<TargetSlug, readonly Lang[]> = {
  "visa-bg": ["ja", "en", "zh"],
  "visa-cy": ["zh"],
};

const headings: Record<Lang, string> = {
  ja: "参考資料",
  en: "References",
  zh: "参考资料",
};

const introductions: Record<TargetSlug, Record<Lang, string>> = {
  "visa-bg": {
    ja: "本記事のビザ・滞在許可情報は、以下のブルガリア政府公式資料を参照しています。",
    en: "Visa and residence permit information in this article is based on the following official Bulgarian government sources.",
    zh: "本文的签证及居留许可信息参考以下保加利亚政府官方资料。",
  },
  "visa-cy": {
    ja: "本記事のビザ・滞在許可情報は、以下のキプロス政府公式資料を参照しています。",
    en: "Visa and residence permit information in this article is based on the following official Cyprus government sources.",
    zh: "本文的签证及居留许可信息参考以下塞浦路斯政府官方资料。",
  },
};

function countReferenceSections(text: string): number {
  return (text.match(/###\s*(?:参考資料|References|参考资料)/g) ?? []).length;
}

function appendReferenceSection(slug: TargetSlug, lang: Lang, text: string): string {
  if (countReferenceSections(text) !== 0) {
    throw new Error(`${slug} content.${lang}: 参考資料セクションが0個ではありません`);
  }
  const references = sourceSpecs[slug]
    .map((source) => `- [${source.labels[lang]}](${source.url})`)
    .join("\n");
  return `${text.trimEnd()}\n\n---\n\n### ${headings[lang]}\n${introductions[slug][lang]}\n${references}`;
}

async function readAllPosts(): Promise<BlogRow[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug,is_published,published_at,created_at,locales,title,description,content")
    .order("slug");
  if (error) throw new Error(`blog_posts読込失敗: ${error.message}`);
  return (data ?? []) as BlogRow[];
}

async function assertRegisteredSources(): Promise<void> {
  for (const slug of targetSlugs) {
    const countryCode = slug.replace("visa-", "");
    const expectedUrls = sourceSpecs[slug].map((source) => source.url).sort();
    const { data, error } = await supabase
      .from("country_sources")
      .select("url")
      .eq("country_code", countryCode)
      .eq("purpose", "visa")
      .eq("status", "alive")
      .in("url", expectedUrls);
    if (error) throw new Error(`${slug}: country_sources読込失敗: ${error.message}`);
    const actualUrls = (data ?? []).map((row: { url: string }) => row.url).sort();
    if (JSON.stringify(actualUrls) !== JSON.stringify(expectedUrls)) {
      throw new Error(`${slug}: 登録済み公式visaソースが期待値と一致しません`);
    }
  }
}

function findTarget(rows: BlogRow[], slug: TargetSlug): BlogRow {
  const row = rows.find((candidate) => candidate.slug === slug);
  if (!row) throw new Error(`${slug}: blog_postsに存在しません`);
  if (!row.content) throw new Error(`${slug}: contentがnullです`);
  return row;
}

async function main() {
  await assertRegisteredSources();
  const before = await readAllPosts();
  const beforeNonTargets = before.filter((row) => !targetSlugs.includes(row.slug as TargetSlug));
  const plannedContent = new Map<TargetSlug, Record<string, string>>();

  for (const slug of targetSlugs) {
    const row = findTarget(before, slug);
    const patchedContent = { ...row.content };
    for (const lang of patchLangs[slug]) {
      const original = patchedContent[lang];
      if (typeof original !== "string" || original.trim() === "") {
        throw new Error(`${slug} content.${lang}: 本文が空または文字列ではありません`);
      }
      patchedContent[lang] = appendReferenceSection(slug, lang, original);
    }

    assertBlogPayload({ content: patchedContent, locales: row.locales }, slug);
    plannedContent.set(slug, patchedContent);

    const { error } = await supabase
      .from("blog_posts")
      .update({ content: patchedContent })
      .eq("slug", slug);
    if (error) throw new Error(`${slug}: content更新失敗: ${error.message}`);
  }

  const after = await readAllPosts();
  const afterNonTargets = after.filter((row) => !targetSlugs.includes(row.slug as TargetSlug));
  if (JSON.stringify(beforeNonTargets) !== JSON.stringify(afterNonTargets)) {
    throw new Error("対象外blog_postsに変更を検出しました");
  }

  for (const slug of targetSlugs) {
    const beforeRow = findTarget(before, slug);
    const afterRow = findTarget(after, slug);
    const expectedContent = plannedContent.get(slug);
    if (!expectedContent || JSON.stringify(afterRow.content) !== JSON.stringify(expectedContent)) {
      throw new Error(`${slug}: 再読込contentが計画値と一致しません`);
    }
    if (
      JSON.stringify(beforeRow.title) !== JSON.stringify(afterRow.title) ||
      JSON.stringify(beforeRow.description) !== JSON.stringify(afterRow.description) ||
      JSON.stringify(beforeRow.locales) !== JSON.stringify(afterRow.locales) ||
      beforeRow.is_published !== afterRow.is_published ||
      beforeRow.published_at !== afterRow.published_at ||
      beforeRow.created_at !== afterRow.created_at
    ) {
      throw new Error(`${slug}: content以外のフィールドに変更を検出しました`);
    }

    for (const lang of patchLangs[slug]) {
      const text = afterRow.content?.[lang] ?? "";
      if (countReferenceSections(text) !== 1) {
        throw new Error(`${slug} content.${lang}: 参考資料セクション数が1ではありません`);
      }
      for (const source of sourceSpecs[slug]) {
        if ((text.split(source.url).length - 1) !== 1) {
          throw new Error(`${slug} content.${lang}: ${source.url} の出現数が1ではありません`);
        }
      }
    }

    for (const lang of (["ja", "en", "zh"] as const)) {
      if (patchLangs[slug].includes(lang)) continue;
      if (beforeRow.content?.[lang] !== afterRow.content?.[lang]) {
        throw new Error(`${slug} content.${lang}: 対象外言語に変更を検出しました`);
      }
    }

    console.log(
      `✅ ${slug}: content.${patchLangs[slug].join(" / content.")} を補完、is_published=${afterRow.is_published}維持`
    );
  }

  console.log(`対象外blog_posts不変: ${afterNonTargets.length}件`);
  console.log("assertBlogPayload: 2/2件通過");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
