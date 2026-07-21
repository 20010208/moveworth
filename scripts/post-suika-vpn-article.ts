/**
 * suika-vpn-overseas-japanese-streaming-guide-2026 の新規draft投稿
 * is_published: false（draft保存のみ、公開は別途 --publish-only 相当の承認後ステップ）
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

const SLUG = "suika-vpn-overseas-japanese-streaming-guide-2026";
const AFFILIATE_LINK = `<a href="https://www.suika-v2.com/?im=tu6">スイカVPN公式サイト</a>`;

const jaContent = `【PR】本記事はアフィリエイト広告を含みます。

## 海外にいると日本の動画サイトが見られない、という悩み

海外移住や海外赴任、留学などで日本を離れると、多くの人が最初にぶつかるのが「日本の動画配信サービスが見られなくなる」という問題です。Amazonプライム・Netflix・TVer・AbemaTVといった、日本にいたときに普段見ていたコンテンツが、海外からのアクセスだと制限されてしまいます。

また、Twitter（X）・Instagram・LINEといったSNS・通信アプリも、国によっては接続が不安定になったり、利用そのものが制限されたりするケースがあります。特に中国など検閲が厳しい国では、こうしたサービスに日常的にアクセスできないことが、海外生活の大きなストレスになっている方も少なくありません。

こうした「海外から日本のコンテンツやサービスにアクセスしたい」というニーズに応えるのが、VPNサービスの**スイカVPN**です。

${AFFILIATE_LINK}

## スイカVPNとは

スイカVPNは2021年からサービス運営を行っているVPNサービスです。運営元は通信・ネットワーク分野で14年の実績を持ち、その知見を活かして日本人の海外在住者・海外渡航者向けにサービスを提供しています。

## 対応しているサービス

スイカVPNを利用することで、以下のような日本国内向けサービスに海外からアクセスしやすくなります。

- Amazonプライム・ビデオ
- Netflix（日本向けコンテンツ）
- TVer
- AbemaTV
- Twitter（X）
- Instagram
- LINE

普段使っているアプリやサービスを、海外に出てからもそのまま使い続けたいという方に向いています。

## 中国など検閲の厳しい国での活用

中国をはじめ、インターネット検閲が厳しい国・地域に滞在・移住する場合、通常の接続方法ではSNSや日本のサービスにアクセスできないことがあります。スイカVPNは、こうした環境でも接続を維持しやすい設計になっており、検閲の厳しい国に住む・渡航する予定がある方のニーズにも対応しています。

## プラン・料金・クーポンコード

スイカVPNには複数の契約期間のプランが用意されています。現在、以下のクーポンコードを利用すると、契約期間に応じて無料延長を受けられます。

- **6ヶ月プラン**：クーポンコード「6m-ad2m2608」の入力で+2ヶ月延長
- **1年プラン**：クーポンコード「12m-ad7m2608」の入力で+7ヶ月延長
- **2年プラン**：クーポンコード「24m-ad30m2608」の入力で+30ヶ月延長

※クーポンの有効期限は2026年8月31日までです。具体的な料金・最新のキャンペーン内容は公式サイトでご確認ください。

## 申し込み方法

1. 公式サイトにアクセスする
2. 希望するプラン（6ヶ月・1年・2年）を選択する
3. 上記のクーポンコードを入力する
4. 決済情報を入力して申し込みを完了する
5. アプリをダウンロードし、案内に従って接続設定を行う

## まとめ

海外にいても日本のAmazonプライムやNetflix、TVerなどを楽しみたい、SNSや連絡手段をこれまで通り使いたいという方にとって、スイカVPNは選択肢の一つになります。特に検閲の厳しい国への移住・渡航を予定している方は、事前にチェックしておくと安心です。

クーポンコードには期限がありますので、気になる方は早めに公式サイトをチェックしてみてください。

${AFFILIATE_LINK}

*本記事はアフィリエイト広告を含みます。*`;

const enContent = `【PR】This article contains affiliate links.

## The problem: you can't watch Japanese streaming sites from overseas

When you relocate abroad, move for work, or study overseas, one of the first frustrations many people run into is losing access to Japanese streaming services. Amazon Prime Video, Netflix, TVer, and AbemaTV — content you used to watch freely in Japan — often become restricted once you're connecting from outside the country.

Social and messaging apps such as Twitter (X), Instagram, and LINE can also become unstable or restricted in certain countries. In places with strict internet censorship, such as China, not being able to access these everyday services can become a real source of stress in daily life abroad.

**Suika VPN** is a VPN service built to address exactly this need — accessing Japanese content and everyday apps from anywhere in the world.

${AFFILIATE_LINK}

## What is Suika VPN?

Suika VPN has been operating as a VPN service since 2021. The operator brings 14 years of experience in the telecommunications and networking field, applying that expertise to serve Japanese nationals living or traveling abroad.

## Supported services

Using Suika VPN makes it easier to access the following Japan-based services from overseas:

- Amazon Prime Video
- Netflix (Japan-region content)
- TVer
- AbemaTV
- Twitter (X)
- Instagram
- LINE

It's designed for people who want to keep using the apps and services they rely on, even after moving abroad.

## Use in countries with strict censorship, such as China

In China and other regions with strict internet censorship, standard connections often can't reach social media or Japanese services at all. Suika VPN is designed to maintain connectivity more reliably in these environments, making it a relevant option for anyone living in, or traveling to, a heavily censored country.

## Plans, pricing, and coupon codes

Suika VPN offers several subscription plans of different lengths. The following coupon codes currently extend your subscription for free when applied:

- **6-month plan**: enter coupon code "6m-ad2m2608" for +2 months free
- **1-year plan**: enter coupon code "12m-ad7m2608" for +7 months free
- **2-year plan**: enter coupon code "24m-ad30m2608" for +30 months free

These coupons are valid until August 31, 2026. Please check the official site for current pricing and campaign details.

## How to sign up

1. Visit the official website
2. Choose your plan (6 months, 1 year, or 2 years)
3. Enter the coupon code above
4. Enter your payment details to complete the purchase
5. Download the app and follow the setup instructions to connect

## Summary

If you want to keep enjoying Amazon Prime Video, Netflix, TVer, and other Japanese services from abroad — and keep using the social apps you rely on — Suika VPN is worth considering, especially if you're moving to or traveling in a country with strict internet censorship.

The coupon codes above are valid for a limited time, so it's worth checking the official site sooner rather than later.

${AFFILIATE_LINK}

*This article contains affiliate links.*`;

const zhContent = `【PR】本文包含联盟广告链接。

## 出国后看不了日本的视频网站，怎么办？

移居海外、外派工作或留学后，很多人首先会遇到一个问题：以前常看的日本视频平台突然无法观看了。Amazon Prime Video、Netflix、TVer、AbemaTV等在日本国内可以自由观看的内容，一旦从海外访问就会受到限制。

同时，Twitter（X）、Instagram、LINE等社交与通讯应用，在部分国家和地区也可能出现连接不稳定甚至无法使用的情况。尤其是在网络审查严格的中国等国家/地区，无法正常使用这些日常应用，会给海外生活带来不小的压力。

**Suika VPN** 正是为解决这一需求而生的VPN服务，帮助您在海外也能访问日本的内容与常用应用。

${AFFILIATE_LINK}

## 什么是Suika VPN？

Suika VPN自2021年起提供服务，运营方在通信与网络领域拥有14年的从业经验，并将这些经验应用于面向海外日本人的服务中。

## 支持的服务

使用Suika VPN，您可以更方便地从海外访问以下日本国内服务：

- Amazon Prime Video
- Netflix（日本地区内容）
- TVer
- AbemaTV
- Twitter（X）
- Instagram
- LINE

适合希望移居海外后依然能像在日本一样使用这些应用和服务的用户。

## 在中国等审查严格的国家使用

在中国等网络审查严格的国家和地区，通过常规方式往往无法访问社交媒体和日本相关服务。Suika VPN在设计上更注重在这类环境中保持连接的稳定性，因此对计划移居或前往审查严格国家的用户来说，也是一个值得关注的选项。

## 套餐、价格与优惠券代码

Suika VPN提供多种不同期限的套餐。目前使用以下优惠券代码，可根据套餐获得免费延长：

- **6个月套餐**：输入优惠券代码「6m-ad2m2608」可延长2个月
- **1年套餐**：输入优惠券代码「12m-ad7m2608」可延长7个月
- **2年套餐**：输入优惠券代码「24m-ad30m2608」可延长30个月

※优惠券有效期至2026年8月31日。具体价格及最新活动内容请以官方网站为准。

## 申请方法

1. 访问官方网站
2. 选择套餐（6个月/1年/2年）
3. 输入上述优惠券代码
4. 填写支付信息完成申请
5. 下载App，按提示完成连接设置

## 总结

如果您希望在海外也能继续观看Amazon Prime Video、Netflix、TVer等日本内容，并继续使用平时依赖的社交应用，Suika VPN是值得考虑的选择之一。尤其是计划移居或前往网络审查严格国家的用户，建议提前了解。

优惠券代码有使用期限，如有需要请尽早前往官方网站查看详情。

${AFFILIATE_LINK}

*本文包含联盟广告链接。*`;

const payload = {
  slug: SLUG,
  category: "money",
  published_at: new Date().toISOString().slice(0, 10),
  reading_minutes: 5,
  thumbnail: null,
  title: {
    ja: "【PR】海外から日本の動画サイトを見たい！スイカVPNで解決【2026年最新版】",
    en: "【PR】Can't Watch Japanese Streaming Sites Abroad? Suika VPN Has the Fix (2026 Edition)",
    zh: "【PR】人在海外看不了日本视频网站？Suika VPN来解决【2026最新版】",
  },
  description: {
    ja: "海外移住・留学中に日本のAmazonプライムやNetflix、TVerが見られない悩みを解決するVPNサービス「スイカVPN」を紹介。対応サービス、中国など検閲の厳しい国での活用法、期間限定クーポンコードまで解説します。",
    en: "Introducing Suika VPN, a VPN service that solves the problem of not being able to watch Japanese streaming services like Amazon Prime, Netflix, and TVer while living or studying abroad. Covers supported services, use in heavily censored countries like China, and limited-time coupon codes.",
    zh: "介绍能解决移居或留学海外后无法观看Amazon Prime、Netflix、TVer等日本视频平台问题的VPN服务「Suika VPN」。涵盖支持的服务、在中国等审查严格国家的使用方法，以及限时优惠券代码。",
  },
  content: {
    ja: jaContent,
    en: enContent,
    zh: zhContent,
  },
  locales: ["ja", "en", "zh"],
  pinned: false,
  is_published: false,
  is_promotion: true,
};

const FORBIDDEN_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /example\.com/i, label: "example.com混入" },
  { pattern: /I'm sorry,?\s+but\s+I\s+can'?t\s+assist/i, label: "GPT拒否(EN)" },
  { pattern: /申し訳ありませんが/, label: "GPT拒否(JA)" },
  { pattern: /我无法(提供|访问|获取|生成)/, label: "GPT拒否(ZH)" },
];

async function main() {
  // 既存レコード確認（重複insert防止）
  const { data: existing } = await sb.from("blog_posts").select("slug").eq("slug", SLUG).maybeSingle();
  if (existing) {
    console.error(`❌ 既に slug="${SLUG}" が存在します。insertを中断します。`);
    process.exit(1);
  }

  // アフィリエイトリンク完全一致確認
  for (const lang of ["ja", "en", "zh"] as const) {
    const text = payload.content[lang];
    const count = text.split(AFFILIATE_LINK).length - 1;
    if (count < 2) {
      console.error(`❌ [${lang}] アフィリエイトリンクの出現回数が想定未満 (${count}回)`);
      process.exit(1);
    }
  }

  // 拒否パターン・example.com混入チェック
  for (const lang of ["ja", "en", "zh"] as const) {
    const text = payload.content[lang];
    for (const { pattern, label } of FORBIDDEN_PATTERNS) {
      if (pattern.test(text)) {
        console.error(`❌ [${lang}] 禁止パターン検出: ${label}`);
        process.exit(1);
      }
    }
  }

  // 必須クーポン文字列確認
  const REQUIRED_STRINGS = ["6m-ad2m2608", "12m-ad7m2608", "24m-ad30m2608", "2026年8月31日"];
  for (const s of REQUIRED_STRINGS) {
    if (!payload.content.ja.includes(s)) {
      console.error(`❌ JA本文に必須文字列が見つかりません: ${s}`);
      process.exit(1);
    }
  }

  assertBlogPayload(payload, SLUG);

  console.log(`JA本文文字数: ${payload.content.ja.length}字`);
  console.log(`EN本文文字数: ${payload.content.en.length}字`);
  console.log(`ZH本文文字数: ${payload.content.zh.length}字`);

  const { error } = await sb.from("blog_posts").insert(payload);
  if (error) {
    console.error("❌ 投稿失敗:", error.message);
    process.exit(1);
  }
  console.log(`\n✅ draft投稿完了: ${SLUG} (is_published: false)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
