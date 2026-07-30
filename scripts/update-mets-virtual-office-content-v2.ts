/**
 * mets-virtual-office-overseas-japanese-guide-2026 の追加修正（1〜3＋軽微問題）
 * 現在のDB本文に対する対象限定の文字列置換・セクション挿入で実施する。
 * is_publishedは変更しない。アフィリエイトリンク（href/pixel）は変更しない。
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { assertBlogPayload } from "./utils/validate-blog-payload";

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
const SLUG = "mets-virtual-office-overseas-japanese-guide-2026";
const AFFILIATE_HREF = "https://px.a8.net/svt/ejp?a8mat=4B8110+A4E2A+50NC+61C2Q";
const PIXEL_SRC = "https://www15.a8.net/0.gif?a8mat=4B8110+A4E2A+50NC+61C2Q";

/** 出現回数を検証しつつ置換する（想定回数と異なれば例外） */
function replaceExact(text: string, from: string, to: string, expectedCount: number, label: string): string {
  const count = text.split(from).length - 1;
  if (count !== expectedCount) {
    throw new Error(`[${label}] 置換対象の出現回数が想定(${expectedCount})と異なります: ${count}件\n対象文字列: ${from.slice(0, 60)}...`);
  }
  return text.split(from).join(to);
}

// ───────────────────────── JA ─────────────────────────

const JA_NEW_SECTION = `## 海外在住者がバーチャルオフィスを選ぶ際のポイント

バーチャルオフィスはMETSバーチャルオフィス以外にも多数のサービスが存在します。海外在住者がサービスを選ぶ際は、以下のような観点で比較検討することをおすすめします。

**立地**

法人登記や名刺に記載する住所は、取引先や金融機関から見た印象に直結します。都心のアクセスの良いエリアかどうかは、比較検討する上で重要な観点の一つです。

**運営の安定性**

自社ビル運営か賃貸物件運営かによって、サービスの継続性に差が出る可能性があります。長期的に同じ住所を使い続けたい海外在住者にとって、運営体制の安定性は特に重視したいポイントです。

**郵便物対応の範囲**

プランによって、通常郵便のみ対応なのか、簡易書留等の受取にも対応しているのかが異なります。自分が受け取る予定の郵便物の種類を踏まえて、対応範囲を事前に確認しておく必要があります。

**プランの柔軟性**

住所だけを使いたい場合と、法人登記まで見据える場合とでは、必要なプランが異なります。将来的にプランを変更できるかどうかも、あわせて確認しておきたいポイントです。

**海外在住者向けの対応実績**

海外在住のまま契約する場合、代理人選任などの追加手続きが必要になることがあります。海外在住者の契約実績・サポート体制が整っているかどうかも、事前に確認しておくと安心です。

`;

const JA_REQUIRED_DOCS = `

申し込みの際は、主に以下の書類が必要です（公式サイトのFAQ等に基づく一般的な例）。

1. 契約者・代表者本人の身分証明書
2. 日本国内在住の代理人の本人確認書類
3. 委任状
4. 法人契約の場合：発行から3か月以内の履歴事項全部証明書

具体的に必要な書類は契約形態やプランによって異なるため、必ず公式サイトで最新情報をご確認ください。`;

const JA_FAQ1_ADDITION = " 必要書類としては、契約者本人の身分証明書に加え、日本国内在住の代理人の本人確認書類・委任状が必要です。法人契約の場合は、発行から3か月以内の履歴事項全部証明書も必要になります。詳細は公式サイトでご確認ください。";

function applyJaFixes(ja: string): string {
  let text = ja;

  // 軽微問題: 正式名称の修正
  text = replaceExact(text, "ネットショップラン", "ネットショッププラン", 1, "ja/plan-name");

  // 修正3: 重要郵便の誤認表現
  text = replaceExact(
    text,
    "海外では直接受け取れない重要な郵便物を、安全かつ確実に管理する必要があります",
    "海外では直接受け取れない重要な郵便物を管理する必要があります",
    1,
    "ja/intro-mail"
  );
  text = replaceExact(
    text,
    "METSバーチャルオフィスでは、簡易書留を含む郵便物の受取に無料で対応しており、重要な書類も安心して預けることができます。",
    "METSバーチャルオフィスでは、郵便物の受取・管理に対応していますが、本人限定受取郵便・特別送達・裁判文書等は受取不可の場合があります。詳細は公式サイトでご確認ください。",
    1,
    "ja/mail-claim"
  );

  // 修正1: 新セクション挿入（「プラン別の特徴と料金」の直前）
  text = replaceExact(text, "## プラン別の特徴と料金", `${JA_NEW_SECTION}## プラン別の特徴と料金`, 1, "ja/new-section-anchor");

  // 修正2: 必要書類（申し込み方法セクション末尾に追加、代理人注記の前）
  text = replaceExact(
    text,
    "必要書類の詳細や審査にかかる期間については、公式サイトで最新情報をご確認ください。",
    `必要書類の詳細や審査にかかる期間については、公式サイトで最新情報をご確認ください。${JA_REQUIRED_DOCS}`,
    1,
    "ja/apply-section-anchor"
  );

  // 修正2: FAQ Q1への追記
  text = replaceExact(
    text,
    "また、海外在住者が契約する際は日本国内在住の代理人を立てる必要があり、代理人の本人確認書類・委任状が必要です。",
    `また、海外在住者が契約する際は日本国内在住の代理人を立てる必要があり、代理人の本人確認書類・委任状が必要です。${JA_FAQ1_ADDITION}`,
    1,
    "ja/faq1"
  );

  // PR表記への追記（冒頭・末尾）
  text = replaceExact(
    text,
    "【PR】本記事はアフィリエイト広告を含みます。（本記事の作成日：2026年7月30日）",
    "【PR】本記事はアフィリエイト広告を含みます。本リンク経由での申込みにより、当サイトに報酬が発生する場合があります。（本記事の作成日：2026年7月30日）",
    1,
    "ja/pr-top"
  );
  text = replaceExact(
    text,
    "*本記事はアフィリエイト広告を含みます。*",
    "*本記事はアフィリエイト広告を含みます。本リンク経由での申込みにより、当サイトに報酬が発生する場合があります。*",
    1,
    "ja/pr-bottom"
  );

  return text;
}

// ───────────────────────── EN ─────────────────────────

const EN_NEW_SECTION = `## Points to consider when choosing a virtual office as an overseas resident

METS Virtual Office is just one of many virtual office providers. When comparing options as an overseas resident, it's worth evaluating a few key factors.

**Location**

The address you use for company registration or on your business cards directly affects how you're perceived by business partners and financial institutions. Whether the address is in a well-connected, central area of Tokyo is one of the most important factors to compare.

**Operational stability**

Whether a provider owns its buildings or leases them can affect how reliably the service continues over time. For overseas residents who want to keep using the same address long-term, the stability of the operator is a factor worth weighing carefully.

**Scope of mail handling**

Depending on the plan, some providers only handle ordinary mail, while others also accept registered mail and similar items. It's worth checking what kinds of mail you expect to receive and confirming the provider's scope of support in advance.

**Plan flexibility**

The right plan differs depending on whether you just need an address or also plan to register a company. It's also worth checking whether you can change plans later as your needs evolve.

**Track record with overseas residents**

Signing a contract while living overseas often requires additional steps, such as appointing a representative in Japan. Checking whether a provider has experience and support systems in place for overseas residents can offer added peace of mind.

`;

const EN_REQUIRED_DOCS = `

To sign up, you will generally need the following documents (a typical example based on the official site's FAQ, etc.):

1. Identity verification document for the contracting party / representative
2. Identity verification document for the representative residing in Japan
3. Power of attorney
4. For company contracts: a certified copy of full corporate registry information (rireki jikou zenbu shoumeisho) issued within the past 3 months

The specific documents required vary by contract type and plan, so please check the official website for the latest information.`;

const EN_FAQ1_ADDITION = " Required documents typically include an identity verification document for the contracting party, as well as identity verification documents and a power of attorney for the representative residing in Japan. For company contracts, a certified copy of full corporate registry information issued within the past 3 months is also required. Please check the official website for details.";

function applyEnFixes(en: string): string {
  let text = en;

  text = replaceExact(
    text,
    "important pieces of mail you can't safely receive while living overseas",
    "important pieces of mail that can be difficult to receive directly while living overseas",
    1,
    "en/intro-mail"
  );
  text = replaceExact(
    text,
    "METS Virtual Office accepts registered mail (including simple registered mail) free of charge, so you can trust that important documents will be handled properly.",
    "METS Virtual Office accepts and manages mail, but certain categories — such as mail requiring in-person identity verification, special delivery (tokubetsu sotatsu), and court documents — may not be accepted. Please check the official website for details.",
    1,
    "en/mail-claim"
  );

  text = replaceExact(text, "## Plans and pricing", `${EN_NEW_SECTION}## Plans and pricing`, 1, "en/new-section-anchor");

  text = replaceExact(
    text,
    "Please check the official website for the latest details on required documents and screening timelines.",
    `Please check the official website for the latest details on required documents and screening timelines.${EN_REQUIRED_DOCS}`,
    1,
    "en/apply-section-anchor"
  );

  text = replaceExact(
    text,
    "Overseas residents must also appoint a representative residing in Japan, who will need to provide identity verification documents and a power of attorney.",
    `Overseas residents must also appoint a representative residing in Japan, who will need to provide identity verification documents and a power of attorney.${EN_FAQ1_ADDITION}`,
    1,
    "en/faq1"
  );

  text = replaceExact(
    text,
    "【PR】This article contains affiliate links. (Article created: July 30, 2026)",
    "【PR】This article contains affiliate links. We may receive compensation if you sign up through the links in this article. (Article created: July 30, 2026)",
    1,
    "en/pr-top"
  );
  text = replaceExact(
    text,
    "*This article contains affiliate links.*",
    "*This article contains affiliate links. We may receive compensation if you sign up through the links in this article.*",
    1,
    "en/pr-bottom"
  );

  return text;
}

// ───────────────────────── ZH ─────────────────────────

const ZH_NEW_SECTION = `## 海外居住者选择虚拟办公室时的考量要点

除METS虚拟办公室外，市面上还有许多其他虚拟办公室服务。海外居住者在比较选择时，建议从以下几个方面进行考量。

**地理位置**

用于法人登记或印在名片上的地址，会直接影响合作伙伴及金融机构对您的印象。地址是否位于东京都内交通便利的核心区域，是比较时需要重点考虑的因素之一。

**运营的稳定性**

究竟是自有大楼运营还是租赁物业运营，可能会影响服务持续运营的可靠程度。对于希望长期使用同一地址的海外居住者而言，运营体制的稳定性尤其值得重视。

**邮件处理范围**

不同套餐对邮件的处理范围也有所不同，有些仅支持普通邮件，有些则也支持挂号信等邮件的接收。建议提前确认自己可能收到的邮件类型，并核实该服务的处理范围。

**套餐的灵活性**

如果只是想使用地址，与希望进一步办理法人登记，所需的套餐并不相同。今后是否可以灵活变更套餐，也是值得提前确认的一点。

**面向海外居住者的服务实绩**

人在海外签约时，往往需要办理指定代理人等额外手续。确认该服务商是否具备海外居住者的服务实绩及相应的支持体系，会让人更加安心。

`;

const ZH_REQUIRED_DOCS = `

申请时，通常需要提交以下文件（基于官方网站FAQ等的一般示例）。

1. 签约人・代表人本人的身份证明文件
2. 居住在日本国内的代理人的身份证明文件
3. 委托书
4. 法人签约时：签发3个月以内的历史事项全部证明书

具体所需文件会因签约形式及套餐而异，请务必以官方网站的最新信息为准。`;

const ZH_FAQ1_ADDITION = " 所需文件通常包括签约人本人的身份证明文件，以及居住在日本国内的代理人的身份证明文件和委托书。法人签约时，还需要提供签发3个月以内的历史事项全部证明书。详情请以官方网站为准。";

function applyZhFixes(zh: string): string {
  let text = zh;

  text = replaceExact(
    text,
    "都是在海外无法直接收取、需要妥善保管的重要邮件",
    "都是在海外难以直接收取的重要邮件",
    1,
    "zh/intro-mail"
  );
  text = replaceExact(
    text,
    "METS虚拟办公室支持免费接收包括挂号信在内的邮件，可以放心地将重要文件托付给他们保管。",
    "METS虚拟办公室支持邮件的接收与管理，但本人限定接收邮件、特别送达、法院文件等可能无法代收。详情请以官方网站为准。",
    1,
    "zh/mail-claim"
  );

  text = replaceExact(text, "## 各套餐的特点与价格", `${ZH_NEW_SECTION}## 各套餐的特点与价格`, 1, "zh/new-section-anchor");

  text = replaceExact(
    text,
    "所需文件的详细信息及审核所需时间，请以官方网站的最新信息为准。",
    `所需文件的详细信息及审核所需时间，请以官方网站的最新信息为准。${ZH_REQUIRED_DOCS}`,
    1,
    "zh/apply-section-anchor"
  );

  text = replaceExact(
    text,
    "此外，海外居住者签约时需要指定一名居住在日本国内的代理人，并提供代理人的身份证明文件及委托书。",
    `此外，海外居住者签约时需要指定一名居住在日本国内的代理人，并提供代理人的身份证明文件及委托书。${ZH_FAQ1_ADDITION}`,
    1,
    "zh/faq1"
  );

  text = replaceExact(
    text,
    "【PR】本文包含联盟广告链接。（本文创建日期：2026年7月30日）",
    "【PR】本文包含联盟广告链接。通过本文链接申请可能会为本站带来报酬。（本文创建日期：2026年7月30日）",
    1,
    "zh/pr-top"
  );
  text = replaceExact(
    text,
    "*本文包含联盟广告链接。*",
    "*本文包含联盟广告链接。通过本文链接申请可能会为本站带来报酬。*",
    1,
    "zh/pr-bottom"
  );

  return text;
}

// ───────────────────────── 検証・更新 ─────────────────────────

function stripTags(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

const NG_ABBREVIATION = /METSオフィス(?!バーチャル)/;
const FORBIDDEN: { pattern: RegExp; label: string }[] = [
  { pattern: /example\.com/i, label: "example.com混入" },
  { pattern: /I'm sorry,?\s+but\s+I\s+can'?t\s+assist/i, label: "GPT拒否(EN)" },
  { pattern: /申し訳ありませんが/, label: "GPT拒否(JA)" },
  { pattern: /我无法(提供|访问|获取|生成)/, label: "GPT拒否(ZH)" },
];

function validate(label: string, text: string) {
  for (const { pattern, label: reason } of FORBIDDEN) {
    if (pattern.test(text)) throw new Error(`[${label}] 禁止パターン検出: ${reason}`);
  }
  if (NG_ABBREVIATION.test(text)) throw new Error(`[${label}] NG略称「METSオフィス」が混入`);
  const hrefCount = text.split(AFFILIATE_HREF).length - 1;
  if (hrefCount < 2) throw new Error(`[${label}] アフィリエイトhrefの出現回数が想定未満 (${hrefCount}回)`);
  const pixelCount = text.split(PIXEL_SRC).length - 1;
  if (pixelCount !== 1) throw new Error(`[${label}] トラッキングピクセルの出現回数が想定外 (${pixelCount}回)`);
}

async function main() {
  const { data: before, error: beforeErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, title, description, content, category, is_promotion, locales, pinned")
    .eq("slug", SLUG)
    .single();
  if (beforeErr || !before) throw new Error(`取得失敗: ${beforeErr?.message}`);
  if (before.is_published !== false) throw new Error(`is_publishedがfalseではありません: ${before.is_published}`);

  const beforeContent = before.content as Record<string, string>;

  const newContent = {
    ja: applyJaFixes(beforeContent.ja),
    en: applyEnFixes(beforeContent.en),
    zh: applyZhFixes(beforeContent.zh),
  };

  for (const [lang, text] of Object.entries(newContent)) validate(lang, text);

  const jaStripped = stripTags(newContent.ja).length;
  console.log(`JA タグ除去後: ${jaStripped}字（要件6000字以上）`);
  if (jaStripped < 6000) throw new Error(`[ja] タグ除去後6000字未満です（${jaStripped}字）`);

  assertBlogPayload(
    { title: before.title, description: before.description, content: newContent, locales: ["ja", "en", "zh"] },
    SLUG
  );

  const { error: updateErr } = await sb.from("blog_posts").update({ content: newContent }).eq("slug", SLUG);
  if (updateErr) throw new Error(`更新失敗: ${updateErr.message}`);

  const { data: after, error: afterErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, title, description, content, category, is_promotion, locales, pinned")
    .eq("slug", SLUG)
    .single();
  if (afterErr || !after) throw new Error(`更新後取得失敗: ${afterErr?.message}`);

  if (after.is_published !== before.is_published) throw new Error("is_publishedが変化しています");
  if (JSON.stringify(after.title) !== JSON.stringify(before.title)) throw new Error("titleが変化しています");
  if (JSON.stringify(after.description) !== JSON.stringify(before.description)) throw new Error("descriptionが変化しています");
  if (after.category !== before.category) throw new Error("categoryが変化しています");
  if (after.is_promotion !== before.is_promotion) throw new Error("is_promotionが変化しています");
  if (JSON.stringify(after.locales) !== JSON.stringify(before.locales)) throw new Error("localesが変化しています");
  if (after.pinned !== before.pinned) throw new Error("pinnedが変化しています");

  console.log("✅ is_published/title/description/category/is_promotion/locales/pinned 不変を確認:", after.is_published);
  for (const lang of ["ja", "en", "zh"] as const) {
    console.log(`[${lang}] 文字数: ${beforeContent[lang].length}字 → ${(after.content as Record<string, string>)[lang].length}字`);
  }

  console.log("\n=== 修正後のhref/src抽出（変更されていないことの確認） ===");
  const afterContent = after.content as Record<string, string>;
  for (const lang of ["ja", "en", "zh"] as const) {
    const hrefs = [...afterContent[lang].matchAll(/<a\s+href="([^"]+)"/g)].map((m) => m[1]);
    const srcs = [...afterContent[lang].matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
    console.log(`[${lang}] href:`, hrefs);
    console.log(`[${lang}] img src:`, srcs);
  }
}

main().catch((e) => {
  console.error("❌", e.message ?? e);
  process.exit(1);
});
