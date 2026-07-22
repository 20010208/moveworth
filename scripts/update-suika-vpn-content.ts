/**
 * suika-vpn-overseas-japanese-streaming-guide-2026 のcontent更新
 * - 画像3枚をSupabase Storageへ圧縮アップロード
 * - content.ja/en/zh のみをターゲットパッチ（is_published・thumbnail・title・description等は変更しない）
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
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
const AFFILIATE_HREF = "https://www.suika-v2.com/?im=tu6";
const BUCKET = "blog-images";

const IMAGES = [
  { local: "C:\\Users\\chiji\\Downloads\\suika-vpn-features.png", storagePath: "Suika/suika-vpn-features.png" },
  { local: "C:\\Users\\chiji\\Downloads\\suika-vpn-pricing.png", storagePath: "Suika/suika-vpn-pricing.png" },
  { local: "C:\\Users\\chiji\\Downloads\\suika-vpn-speed-comparison.png", storagePath: "Suika/suika-vpn-speed-comparison.png" },
];

async function uploadImage(local: string, storagePath: string): Promise<string> {
  const original = readFileSync(local);
  const compressed = await sharp(original)
    .resize(1400, null, { withoutEnlargement: true })
    .png({ quality: 80, compressionLevel: 9 })
    .toBuffer();
  const saved = Math.round((1 - compressed.length / original.length) * 100);
  console.log(
    `  ${storagePath}: ${Math.round(original.length / 1024)}KB → ${Math.round(compressed.length / 1024)}KB (${saved}%削減)`
  );
  const { error } = await sb.storage.from(BUCKET).upload(storagePath, compressed, {
    contentType: "image/png",
    upsert: true,
  });
  if (error) throw new Error(`アップロード失敗 (${storagePath}): ${error.message}`);
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

function affiliateBlock(label: string): string {
  return `<!-- html -->
<div style="text-align:center;margin:16px 0;">
<a href="${AFFILIATE_HREF}" style="font-size:16px;font-weight:bold;color:#0070f3;">${label}</a>
</div>
<!-- /html -->`;
}

async function main() {
  console.log("=== 画像アップロード ===");
  const urls: Record<string, string> = {};
  for (const img of IMAGES) {
    urls[img.storagePath] = await uploadImage(img.local, img.storagePath);
  }
  const featuresUrl = urls["Suika/suika-vpn-features.png"];
  const pricingUrl = urls["Suika/suika-vpn-pricing.png"];
  const speedUrl = urls["Suika/suika-vpn-speed-comparison.png"];
  console.log("✅ 画像アップロード完了\n");

  // 更新前のベースライン取得（保護対象フィールドの不変確認用）
  const { data: before, error: beforeErr } = await sb
    .from("blog_posts")
    .select("slug,category,is_published,is_promotion,locales,pinned,title,description,thumbnail,reading_minutes,published_at")
    .eq("slug", SLUG)
    .single();
  if (beforeErr || !before) {
    console.error("❌ 更新前レコード取得失敗:", beforeErr?.message);
    process.exit(1);
  }

  const jaAffiliate = affiliateBlock("スイカVPN公式サイトはこちら");
  const enAffiliate = affiliateBlock("スイカVPN公式サイトはこちら");
  const zhAffiliate = affiliateBlock("スイカVPN公式サイトはこちら");

  const jaContent = `【PR】本記事はアフィリエイト広告を含みます。

## 海外にいると日本の動画サイトが見られない、という悩み

海外移住や海外赴任、留学などで日本を離れると、多くの人が最初にぶつかるのが「日本の動画配信サービスが見られなくなる」という問題です。Amazonプライム・Netflix・TVer・AbemaTVといった、日本にいたときに普段見ていたコンテンツが、海外からのアクセスだと制限されてしまいます。

また、Twitter（X）・Instagram・LINEといったSNS・通信アプリも、国によっては接続が不安定になったり、利用そのものが制限されたりするケースがあります。特に中国など検閲が厳しい国では、こうしたサービスに日常的にアクセスできないことが、海外生活の大きなストレスになっている方も少なくありません。

こうした「海外から日本のコンテンツやサービスにアクセスしたい」というニーズに応えるのが、VPNサービスのスイカVPNです。

${jaAffiliate}

![スイカVPNのオリジナル図解](${featuresUrl})

## スイカVPNとは

スイカVPNは2021年からサービス運営を行っているVPNサービスです。運営元は通信・ネットワーク分野で14年の実績を持ち、世界45都市のVPNサーバーを同時に利用できます。スマホ・PC・タブレットなどマルチデバイスに対応し、初心者でも簡単にワンクリックで接続できます。

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

## 接続速度について

![スイカVPNの接続速度比較](${speedUrl})

2026年6月の計測データでは、日本サーバーへの接続でNordVPN・ExpressVPN・MillenVPNを上回る速度を記録しています。（Android・docomo 4G・IKEv2接続、2週間平均）

## プラン・料金・クーポンコード

![スイカVPNの料金表](${pricingUrl})

| プラン | 月額 | 合計 |
|--------|------|------|
| 1ヶ月 | 1,097円 | 1,097円 |
| 3ヶ月 | 1,048円 | 3,144円 |
| 6ヶ月 | 988円 | 5,932円 |
| 1年 | 938円 | 11,258円 |
| 2年 | 878円 | 21,094円 |

クーポンコードを使うとさらにお得！

| プラン | クーポンコード | 実質期間 | 実質月額 |
|--------|------|------|------|
| 6ヶ月 | 6m-ad2m2608 | 8ヶ月 | 約742円/月 |
| 1年 | 12m-ad7m2608 | 19ヶ月 | 約593円/月 |
| 2年 | 24m-ad30m2608 | 54ヶ月 | 約391円/月 |

※クーポンの有効期限は2026年8月31日までです。
※2年プランにクーポンを適用すると実質54ヶ月（約4年半）使えて月額約391円と最もお得です。

## 申し込み方法

1. 公式サイトにアクセスする
2. 希望するプランを選択する
3. クーポンコードを入力する
4. 決済情報を入力して申し込みを完了する
5. アプリをダウンロードして接続設定を行う

## まとめ

海外にいても日本のAmazonプライムやNetflix、TVerなどを楽しみたい、SNSや連絡手段をこれまで通り使いたいという方にとって、スイカVPNは選択肢の一つになります。特に検閲の厳しい国への移住・渡航を予定している方は、事前にチェックしておくと安心です。

2年プランにクーポンコード「24m-ad30m2608」を適用すると実質月額約391円で利用できます。クーポンの有効期限は2026年8月31日までです。

${jaAffiliate}

*本記事はアフィリエイト広告を含みます。*`;

  const enContent = `【PR】This article contains affiliate links.

## The problem: you can't watch Japanese streaming sites from overseas

When you relocate abroad, move for work, or study overseas, one of the first frustrations many people run into is losing access to Japanese streaming services. Amazon Prime Video, Netflix, TVer, and AbemaTV — content you used to watch freely in Japan — often become restricted once you're connecting from outside the country.

Social and messaging apps such as Twitter (X), Instagram, and LINE can also become unstable or restricted in certain countries. In places with strict internet censorship, such as China, not being able to access these everyday services can become a real source of stress in daily life abroad.

**Suika VPN** is a VPN service built to address exactly this need.

${enAffiliate}

![Suika VPN original diagram](${featuresUrl})

## What is Suika VPN?

Suika VPN has been operating as a VPN service since 2021. The operator brings 14 years of experience in the telecommunications and networking field, and gives you simultaneous access to VPN servers in 45 cities worldwide. It supports multiple devices — smartphone, PC, and tablet — with a simple one-click connection even for first-time users.

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

## Connection speed

![Suika VPN connection speed comparison](${speedUrl})

According to measurements from June 2026, Suika VPN recorded faster connection speeds to Japanese servers than NordVPN, ExpressVPN, and MillenVPN (Android, docomo 4G, IKEv2 connection, 2-week average).

## Plans, pricing, and coupon codes

![Suika VPN pricing table](${pricingUrl})

Prices below are in Japanese yen (¥), the currency in which Suika VPN bills its plans.

| Plan | Monthly | Total |
|--------|------|------|
| 1 month | ¥1,097 | ¥1,097 |
| 3 months | ¥1,048 | ¥3,144 |
| 6 months | ¥988 | ¥5,932 |
| 1 year | ¥938 | ¥11,258 |
| 2 years | ¥878 | ¥21,094 |

Coupon codes make it even more affordable:

| Plan | Coupon code | Effective period | Effective monthly rate |
|--------|------|------|------|
| 6 months | 6m-ad2m2608 | 8 months | approx. ¥742/month |
| 1 year | 12m-ad7m2608 | 19 months | approx. ¥593/month |
| 2 years | 24m-ad30m2608 | 54 months | approx. ¥391/month |

*These coupons are valid until August 31, 2026.
*Applying the coupon to the 2-year plan gives you an effective 54 months (about 4.5 years) of use, at roughly ¥391/month — the best value of the three.

## How to sign up

1. Visit the official website
2. Choose your plan
3. Enter the coupon code
4. Enter your payment details to complete the purchase
5. Download the app and complete the connection setup

## Summary

If you want to keep enjoying Amazon Prime Video, Netflix, TVer, and other Japanese services from abroad — and keep using the social apps you rely on — Suika VPN is worth considering, especially if you're moving to or traveling in a country with strict internet censorship.

Applying coupon code "24m-ad30m2608" to the 2-year plan brings the effective monthly rate to about ¥391. The coupon is valid until August 31, 2026.

${enAffiliate}

*This article contains affiliate links.*`;

  const zhContent = `【PR】本文包含联盟广告链接。

## 出国后看不了日本的视频网站，怎么办？

移居海外、外派工作或留学后，很多人首先会遇到一个问题：以前常看的日本视频平台突然无法观看了。Amazon Prime Video、Netflix、TVer、AbemaTV等在日本国内可以自由观看的内容，一旦从海外访问就会受到限制。

同时，Twitter（X）、Instagram、LINE等社交与通讯应用，在部分国家和地区也可能出现连接不稳定甚至无法使用的情况。尤其是在网络审查严格的中国等国家/地区，无法正常使用这些日常应用，会给海外生活带来不小的压力。

**Suika VPN** 正是为解决这一需求而生的VPN服务。

${zhAffiliate}

![Suika VPN原创图解](${featuresUrl})

## 什么是Suika VPN？

Suika VPN自2021年起提供服务，运营方在通信与网络领域拥有14年的从业经验，可同时使用全球45个城市的VPN服务器。支持手机、电脑、平板等多设备，即使是初次使用者也能一键轻松连接。

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

## 关于连接速度

![Suika VPN连接速度对比](${speedUrl})

根据2026年6月的测速数据，Suika VPN在连接日本服务器时的速度超过了NordVPN、ExpressVPN和MillenVPN（Android、docomo 4G、IKEv2连接，2周平均值）。

## 套餐、价格与优惠券代码

![Suika VPN价格表](${pricingUrl})

以下价格单位为日元（¥）。

| 套餐 | 月费 | 总额 |
|--------|------|------|
| 1个月 | ¥1,097 | ¥1,097 |
| 3个月 | ¥1,048 | ¥3,144 |
| 6个月 | ¥988 | ¥5,932 |
| 1年 | ¥938 | ¥11,258 |
| 2年 | ¥878 | ¥21,094 |

使用优惠券代码更划算：

| 套餐 | 优惠券代码 | 实际使用期 | 实际月费 |
|--------|------|------|------|
| 6个月 | 6m-ad2m2608 | 8个月 | 约¥742/月 |
| 1年 | 12m-ad7m2608 | 19个月 | 约¥593/月 |
| 2年 | 24m-ad30m2608 | 54个月 | 约¥391/月 |

※优惠券有效期至2026年8月31日。
※2年套餐使用优惠券后，实际可使用54个月（约4年半），月费约¥391，是三者中最划算的选择。

## 申请方法

1. 访问官方网站
2. 选择套餐
3. 输入优惠券代码
4. 填写支付信息完成申请
5. 下载App并完成连接设置

## 总结

如果您希望在海外也能继续观看Amazon Prime Video、Netflix、TVer等日本内容，并继续使用平时依赖的社交应用，Suika VPN是值得考虑的选择之一。尤其是计划移居或前往网络审查严格国家的用户，建议提前了解。

2年套餐使用优惠券代码「24m-ad30m2608」后，实际月费约¥391。优惠券有效期至2026年8月31日。

${zhAffiliate}

*本文包含联盟广告链接。*`;

  const newContent = { ja: jaContent, en: enContent, zh: zhContent };

  // アフィリエイトhref完全一致・出現回数確認
  for (const [lang, text] of Object.entries(newContent)) {
    const count = (text.match(new RegExp(AFFILIATE_HREF.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length;
    if (count < 2) {
      console.error(`❌ [${lang}] アフィリエイトhrefの出現回数が想定未満 (${count}回)`);
      process.exit(1);
    }
  }

  // 禁止パターン・example.com混入チェック
  const FORBIDDEN: { pattern: RegExp; label: string }[] = [
    { pattern: /example\.com/i, label: "example.com混入" },
    { pattern: /I'm sorry,?\s+but\s+I\s+can'?t\s+assist/i, label: "GPT拒否(EN)" },
    { pattern: /申し訳ありませんが/, label: "GPT拒否(JA)" },
    { pattern: /我无法(提供|访问|获取|生成)/, label: "GPT拒否(ZH)" },
  ];
  for (const [lang, text] of Object.entries(newContent)) {
    for (const { pattern, label } of FORBIDDEN) {
      if (pattern.test(text)) {
        console.error(`❌ [${lang}] 禁止パターン検出: ${label}`);
        process.exit(1);
      }
    }
  }

  // 必須文字列確認（JA基準：クーポン・料金・画像URL）
  const REQUIRED_JA = [
    "6m-ad2m2608", "12m-ad7m2608", "24m-ad30m2608", "2026年8月31日",
    "1,097円", "988円", "938円", "878円",
    featuresUrl, pricingUrl, speedUrl,
  ];
  for (const s of REQUIRED_JA) {
    if (!newContent.ja.includes(s)) {
      console.error(`❌ JA本文に必須文字列が見つかりません: ${s}`);
      process.exit(1);
    }
  }

  assertBlogPayload({ content: newContent, locales: ["ja", "en", "zh"] }, SLUG);

  console.log(`JA本文文字数: ${newContent.ja.length}字`);
  console.log(`EN本文文字数: ${newContent.en.length}字`);
  console.log(`ZH本文文字数: ${newContent.zh.length}字`);

  const { error: updateErr } = await sb.from("blog_posts").update({ content: newContent }).eq("slug", SLUG);
  if (updateErr) {
    console.error("❌ DB更新失敗:", updateErr.message);
    process.exit(1);
  }

  // 更新後の保護対象フィールド不変確認
  const { data: after, error: afterErr } = await sb
    .from("blog_posts")
    .select("slug,category,is_published,is_promotion,locales,pinned,title,description,thumbnail,reading_minutes,published_at,content")
    .eq("slug", SLUG)
    .single();
  if (afterErr || !after) {
    console.error("❌ 更新後レコード取得失敗:", afterErr?.message);
    process.exit(1);
  }

  const unchanged =
    before.is_published === after.is_published &&
    before.is_promotion === after.is_promotion &&
    before.category === after.category &&
    before.pinned === after.pinned &&
    before.thumbnail === after.thumbnail &&
    before.reading_minutes === after.reading_minutes &&
    before.published_at === after.published_at &&
    JSON.stringify(before.title) === JSON.stringify(after.title) &&
    JSON.stringify(before.description) === JSON.stringify(after.description) &&
    JSON.stringify(before.locales) === JSON.stringify(after.locales);

  if (!unchanged) {
    console.error("❌ content以外のフィールドが変化しています！");
    console.error("before:", before);
    console.error("after:", after);
    process.exit(1);
  }
  console.log("✅ content以外のフィールド（is_published含む）不変を確認");

  for (const lang of ["ja", "en", "zh"] as const) {
    const c = (after.content as Record<string, string>)[lang];
    if (!c.includes(AFFILIATE_HREF)) {
      console.error(`❌ [${lang}] 更新後本文にアフィリエイトhrefが見つかりません`);
      process.exit(1);
    }
  }
  console.log("✅ 更新後本文の全言語でアフィリエイトhref保持を確認");

  console.log(`\n✅ content更新完了: ${SLUG} (is_published: ${after.is_published})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
