/**
 * miricanvas-ai-presentation-guide-2026 の新規draft投稿（2サイト）
 * - blog_posts (moveworthapp.com): is_published:false, is_promotion:true
 * - study_blog_posts (study.moveworthapp.com): is_published:false
 *   ※study_blog_postsにはis_promotionカラムが存在しないため設定しない（PR開示は本文内表記のみ）
 * - アフィリエイトリンクのhref・表示テキストは両サイト共通。ただしレンダラー差異のため:
 *   - blog_posts: 生HTML `<a>` を <!-- html --> ブロックで囲む（renderContentのHTML許可仕様）
 *   - study_blog_posts: Markdownリンク [label](url)（study側レンダラーはHTMLブロック非対応のため）
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

const SLUG = "miricanvas-ai-presentation-guide-2026";
const AFFILIATE_HREF = "https://abr.ge/0xaw24";
const AFFILIATE_LABEL = "MiriCanvas公式サイトはこちら";
const CREATED_DATE_JA = "2026年7月22日";
const CREATED_DATE_EN = "July 22, 2026";
const CREATED_DATE_ZH = "2026年7月22日";

function htmlAffiliateBlock(): string {
  return `<!-- html -->
<div style="text-align:center;margin:16px 0;">
<a href="${AFFILIATE_HREF}" style="font-size:16px;font-weight:bold;color:#0070f3;">${AFFILIATE_LABEL}</a>
</div>
<!-- /html -->`;
}

function mdAffiliateLink(): string {
  return `[${AFFILIATE_LABEL}](${AFFILIATE_HREF})`;
}

// ===== JA =====
function jaBody(link: string): string {
  return `【PR】本記事はアフィリエイト広告を含みます。（本記事の作成日：${CREATED_DATE_JA}）

## 資料作成に時間がかかりすぎる、という悩み

会社員の企画資料、学生のゼミ発表、フリーランサーの提案資料——プレゼンテーション資料が必要な場面は多いものの、「デザインを一から考える時間がない」「PowerPointの操作に慣れていない」と感じたことがある方は多いのではないでしょうか。

構成を考え、スライドごとにレイアウトを整え、色やフォントを揃える——この作業だけで数時間かかってしまうことも珍しくありません。こうした「資料作成の時間を短縮したい」という悩みを解決してくれるのが、AIデザインツール**MiriCanvas（ミリキャンバス）**です。

${link}

## MiriCanvasとは

MiriCanvasは、世界1,800万人以上が利用しているブラウザ完結型のデザインツールです。アプリのインストールは不要で、ブラウザさえあればすぐにデザイン作業を始められます。

最大の特徴は、**miricle AI**によるAIプレゼンテーション生成機能です。作りたい資料のテーマやキーワードを入力するだけで、構成案からデザインまでをAIが自動で組み立て、最短3分でプレゼン資料の叩き台が完成します。ゼロから考える必要がなく、叩き台をベースに調整していくだけで資料が仕上がるため、大幅な時間短縮につながります。

なお、AIプレゼンテーション生成機能は現時点でPC環境からの利用に対応しています。スマートフォン・タブレットからの利用を検討している方は、この点にご注意ください。

## 主な機能・特徴

MiriCanvasには、資料作成を効率化するための機能が数多く搭載されています。

- **AIによる構成・デザインの自動構築**：テーマを入力するだけで、章立てやスライド構成、配色やレイアウトまでAIが自動で提案
- **日本向けテンプレート・日本語フォントが充実**：海外製ツールにありがちな「日本語が崩れる」「テンプレートが日本のビジネスシーンに合わない」といった不便が少ない
- **PPTX形式でのエクスポートに対応**：作成した資料はPowerPoint形式（PPTX）で書き出せるため、社内共有や印刷など既存のPowerPoint運用ともスムーズに連携できる
- **チームでの共同編集・共有ドライブ機能**：複数人で同時に同じ資料を編集したり、チーム専用の共有ドライブでファイルを管理したりできる

## 活用シーン

MiriCanvasは、さまざまな立場の方に活用されています。

- **会社員**：企画書、提案資料、社内報告資料などをスピーディーに作成したい方
- **学生**：ゼミ発表、卒業論文の中間発表、サークル・部活動の資料作成に時間をかけたくない方
- **フリーランサー**：クライアントへの提案資料や実績紹介資料を、デザインスキルがなくても見栄えよく仕上げたい方

「デザインは苦手だけど、伝わる資料は作りたい」という方にとって、心強い味方になるツールです。

## 無料登録方法と二次認証（必須）

MiriCanvasは無料で登録・利用を開始できます。登録の流れは以下の通りです。

1. 公式サイトにアクセスし、新規登録ボタンをクリックする
2. メールアドレスとパスワードを入力する（Googleアカウント等での登録も選択可能）
3. 氏名・利用目的などの基本情報を入力する
4. メール認証送信画面が表示され、登録したメールアドレス宛にMiriCanvasから認証メールが届く
5. 届いたメールを開き、「メール認証をする」をクリックする
6. 「認証成功！」画面が表示されるので、「確認」をクリックして登録完了

**注意点**：Hotmail（Outlook.com）のメールアドレスの場合、認証メールが届かないケースが報告されています。GmailやYahoo!メールなど、他のメールアドレスでの登録をおすすめします。また、認証メールが届かない場合は、迷惑メールフォルダに振り分けられていないかもあわせてご確認ください。

## まとめ

資料作成にかかる時間を短縮したい、デザインに自信がなくても見栄えのよい資料を作りたい——そんな方には、AIプレゼンテーション生成機能を備えたMiriCanvasがおすすめです。最短3分で叩き台が完成するスピード感と、日本語対応の充実度、PowerPointとの互換性の高さから、会社員・学生・フリーランサーまで幅広い場面で活用できます。

まずは無料登録から、その使いやすさを体験してみてください。

${link}

*本記事はアフィリエイト広告を含みます。*`;
}

// ===== EN =====
function enBody(link: string): string {
  return `【PR】This article contains affiliate links. (Article created: ${CREATED_DATE_EN})

## The problem: presentations take too long to make

Whether it's a proposal deck for work, a seminar presentation for university, or a pitch deck for a freelance client, presentations come up constantly — and many people run into the same frustration: no time to design from scratch, and no confidence using PowerPoint.

Planning the structure, laying out each slide, matching colors and fonts — this alone can eat up hours. **MiriCanvas**, an AI design tool, is built to solve exactly this problem: cutting down the time it takes to create a presentation.

${link}

## What is MiriCanvas?

MiriCanvas is a browser-based design tool used by more than 18 million people worldwide. There's nothing to install — you can start designing the moment you open your browser.

Its standout feature is AI presentation generation powered by **miricle AI**. Just enter the theme or keywords for the presentation you want to create, and the AI automatically builds out the structure and design, producing a first draft in as little as 3 minutes. Instead of starting from a blank page, you simply refine the AI-generated draft, which saves a significant amount of time.

Note that, at this time, the AI presentation generation feature is available on PC only. Keep this in mind if you were planning to use it from a smartphone or tablet.

## Key features

MiriCanvas comes packed with features designed to speed up presentation creation:

- **Automatic structure and design generation by AI**: just enter a theme, and the AI proposes the outline, slide structure, colors, and layout
- **Extensive Japanese templates and Japanese fonts**: avoids the common issue with overseas tools where Japanese text breaks or templates don't fit Japanese business conventions
- **PPTX export support**: finished presentations can be exported in PowerPoint format (PPTX), making it easy to integrate with existing PowerPoint-based workflows for sharing or printing
- **Team collaboration and shared drives**: multiple people can edit the same presentation simultaneously, and teams can manage files in a dedicated shared drive

## Who it's for

MiriCanvas is used by a wide range of people:

- **Office workers** who want to quickly put together proposals, reports, or internal presentations
- **Students** who don't want to spend hours on seminar presentations, thesis progress reports, or club materials
- **Freelancers** who want polished-looking proposal or portfolio decks without needing design skills

If you want your presentations to communicate well but design isn't your strong suit, MiriCanvas is a reliable tool to have on hand.

## Free sign-up and two-step email verification (required)

MiriCanvas can be signed up for and used free of charge. Here's the sign-up flow:

1. Visit the official website and click the sign-up button
2. Enter your email address and password (or sign up with a Google account, etc.)
3. Enter basic information such as your name and intended use
4. An email verification screen appears, and MiriCanvas sends a verification email to the address you registered
5. Open the email and click "Verify Email"
6. A "Verification successful!" screen appears — click "Confirm" to complete registration

**Note**: If you use a Hotmail (Outlook.com) address, there have been reports of the verification email not arriving. We recommend using a different email address, such as Gmail or Yahoo Mail. If the email doesn't arrive, please also check your spam/junk folder.

## Summary

If you want to cut down the time spent creating presentations — or you want polished-looking slides even without design confidence — MiriCanvas, with its AI presentation generation feature, is worth trying. With drafts ready in as little as 3 minutes, strong Japanese-language support, and PowerPoint compatibility, it's useful for office workers, students, and freelancers alike.

Start with the free sign-up and see how easy it is to use.

${link}

*This article contains affiliate links.*`;
}

// ===== ZH =====
function zhBody(link: string): string {
  return `【PR】本文包含联盟广告链接。（本文创建日期：${CREATED_DATE_ZH}）

## 制作资料太花时间的烦恼

无论是公司职员的企划资料、学生的研讨会发表，还是自由职业者的提案资料，很多人都会遇到同样的烦恼："没有时间从零开始设计"、"不熟悉PowerPoint的操作"。

思考结构、调整每一页的排版、统一颜色和字体——仅这些工作就可能耗费数小时。能够解决"想缩短资料制作时间"这一烦恼的，正是AI设计工具**MiriCanvas**。

${link}

## 什么是MiriCanvas？

MiriCanvas是一款全球1,800万以上用户使用的浏览器端设计工具。无需安装应用程序，只要有浏览器就能立即开始设计。

其最大的特点是由**miricle AI**驱动的AI演示文稿生成功能。只需输入想制作资料的主题或关键词，AI就会自动构建结构和设计，最短3分钟即可完成演示文稿初稿。无需从零开始思考，只需在AI生成的初稿基础上进行调整即可完成资料，大幅缩短了制作时间。

需要注意的是，AI演示文稿生成功能目前仅支持在电脑环境下使用。如果您计划通过智能手机或平板电脑使用，请留意这一点。

## 主要功能与特点

MiriCanvas搭载了众多提升资料制作效率的功能。

- **AI自动构建结构与设计**：只需输入主题，AI就会自动提出章节结构、幻灯片构成、配色和排版方案
- **丰富的日本风格模板与日文字体**：减少了海外工具常见的"日文显示错乱"、"模板不符合日本商务场景"等不便
- **支持导出为PPTX格式**：制作完成的资料可导出为PowerPoint格式（PPTX），方便与现有的PowerPoint办公流程衔接，用于内部共享或打印
- **团队协作编辑与共享云端硬盘功能**：多人可同时编辑同一份资料，团队还可通过专用共享硬盘管理文件

## 适用场景

MiriCanvas被各种身份的用户广泛使用：

- **公司职员**：希望快速制作企划书、提案资料、内部报告资料的人
- **学生**：不想在研讨会发表、毕业论文中期报告、社团活动资料上花费太多时间的人
- **自由职业者**：希望在没有设计技能的情况下，也能制作出美观的客户提案或作品展示资料的人

对于"不擅长设计，但想做出有说服力的资料"的人来说，MiriCanvas是一个可靠的帮手。

## 免费注册方法与二次验证（必须）

MiriCanvas可以免费注册和使用。注册流程如下：

1. 访问官方网站，点击注册按钮
2. 输入邮箱地址和密码（也可选择使用Google账号等注册）
3. 输入姓名、使用目的等基本信息
4. 显示邮箱验证发送画面，MiriCanvas会向您注册的邮箱地址发送验证邮件
5. 打开收到的邮件，点击"进行邮箱验证"
6. 显示"验证成功！"画面后，点击"确认"即完成注册

**注意事项**：使用Hotmail（Outlook.com）邮箱时，有报告称验证邮件可能无法送达。建议使用Gmail、Yahoo邮箱等其他邮箱地址注册。此外，如果一直未收到验证邮件，也请检查一下是否被归类到垃圾邮件文件夹中。

## 总结

如果您希望缩短制作资料的时间，或者即使对设计没有信心也想做出美观的资料，配备AI演示文稿生成功能的MiriCanvas值得一试。最短3分钟即可完成初稿的速度、丰富的日语支持，以及与PowerPoint的高兼容性，使其能在公司职员、学生、自由职业者等广泛场景中发挥作用。

不妨先从免费注册开始，体验一下它的易用性。

${link}

*本文包含联盟广告链接。*`;
}

const titleJa = "【PR】3分で完成するAIプレゼンテーション！MiriCanvasの使い方【2026年最新版】";
const titleEn = "【PR】Create an AI Presentation in 3 Minutes! How to Use MiriCanvas (2026 Edition)";
const titleZh = "【PR】3分钟完成AI演示文稿！MiriCanvas使用方法【2026最新版】";

const descJa = "世界1,800万人以上が利用するMiriCanvasのAIプレゼンテーション生成機能を紹介。最短3分で資料の叩き台が完成し、PPTX形式でのエクスポートやチーム共同編集にも対応。無料登録方法・二次認証の手順も解説します。";
const descEn = "Introducing MiriCanvas's AI presentation generation feature, used by over 18 million people worldwide. Create a draft in as little as 3 minutes, export to PPTX, and collaborate with your team. Includes free sign-up and email verification steps.";
const descZh = "介绍全球1,800万以上用户使用的MiriCanvas的AI演示文稿生成功能。最短3分钟即可完成资料初稿，支持导出为PPTX格式及团队协作编辑。同时解说免费注册方法与二次验证步骤。";

const FORBIDDEN: { pattern: RegExp; label: string }[] = [
  { pattern: /example\.com/i, label: "example.com混入" },
  { pattern: /I'm sorry,?\s+but\s+I\s+can'?t\s+assist/i, label: "GPT拒否(EN)" },
  { pattern: /申し訳ありませんが/, label: "GPT拒否(JA)" },
  { pattern: /我无法(提供|访问|获取|生成)/, label: "GPT拒否(ZH)" },
];

function checkForbidden(label: string, text: string) {
  for (const { pattern, label: reason } of FORBIDDEN) {
    if (pattern.test(text)) {
      console.error(`❌ [${label}] 禁止パターン検出: ${reason}`);
      process.exit(1);
    }
  }
}

async function main() {
  // ---- blog_posts (生HTML + <!-- html --> ラップ) ----
  const htmlLink = htmlAffiliateBlock();
  const blogContent = {
    ja: jaBody(htmlLink),
    en: enBody(htmlLink),
    zh: zhBody(htmlLink),
  };

  for (const [lang, text] of Object.entries(blogContent)) {
    checkForbidden(`blog_posts/${lang}`, text);
    if (!text.includes(AFFILIATE_HREF)) {
      console.error(`❌ [blog_posts/${lang}] アフィリエイトhrefが見つかりません`);
      process.exit(1);
    }
  }
  if (!blogContent.ja.includes(CREATED_DATE_JA)) {
    console.error("❌ [blog_posts/ja] 作成日の記載が見つかりません");
    process.exit(1);
  }

  const blogPayload = {
    slug: SLUG,
    category: "money",
    published_at: new Date().toISOString().slice(0, 10),
    reading_minutes: 6,
    thumbnail: null,
    title: { ja: titleJa, en: titleEn, zh: titleZh },
    description: { ja: descJa, en: descEn, zh: descZh },
    content: blogContent,
    locales: ["ja", "en", "zh"],
    pinned: false,
    is_published: false,
    is_promotion: true,
  };

  assertBlogPayload(blogPayload, `${SLUG} (blog_posts)`);

  const { data: existingBlog } = await sb.from("blog_posts").select("slug").eq("slug", SLUG).maybeSingle();
  if (existingBlog) {
    console.error(`❌ blog_posts に既に slug="${SLUG}" が存在します`);
    process.exit(1);
  }

  const { error: blogErr } = await sb.from("blog_posts").insert(blogPayload);
  if (blogErr) {
    console.error("❌ blog_posts 投稿失敗:", blogErr.message);
    process.exit(1);
  }
  console.log(`✅ blog_posts draft投稿完了: ${SLUG} (is_published: false)`);
  console.log(`   JA ${blogContent.ja.length}字 / EN ${blogContent.en.length}字 / ZH ${blogContent.zh.length}字`);

  // ---- study_blog_posts (Markdownリンク、is_promotionカラムなし) ----
  const mdLink = mdAffiliateLink();
  const studyContent = {
    ja: jaBody(mdLink),
    en: enBody(mdLink),
    zh: zhBody(mdLink),
  };

  for (const [lang, text] of Object.entries(studyContent)) {
    checkForbidden(`study_blog_posts/${lang}`, text);
    if (!text.includes(AFFILIATE_HREF)) {
      console.error(`❌ [study_blog_posts/${lang}] アフィリエイトhrefが見つかりません`);
      process.exit(1);
    }
  }
  if (!studyContent.ja.includes(CREATED_DATE_JA)) {
    console.error("❌ [study_blog_posts/ja] 作成日の記載が見つかりません");
    process.exit(1);
  }

  const studyPayload = {
    slug: SLUG,
    category: "guide",
    date: new Date().toISOString().slice(0, 10),
    reading_time: 6,
    title: { ja: titleJa, en: titleEn, zh: titleZh },
    description: { ja: descJa, en: descEn, zh: descZh },
    content: studyContent,
    is_published: false,
  };

  assertBlogPayload({ ...studyPayload, locales: ["ja", "en", "zh"] }, `${SLUG} (study_blog_posts)`);

  const { data: existingStudy } = await sb.from("study_blog_posts").select("slug").eq("slug", SLUG).maybeSingle();
  if (existingStudy) {
    console.error(`❌ study_blog_posts に既に slug="${SLUG}" が存在します`);
    process.exit(1);
  }

  const { error: studyErr } = await sb.from("study_blog_posts").insert(studyPayload);
  if (studyErr) {
    console.error("❌ study_blog_posts 投稿失敗:", studyErr.message);
    process.exit(1);
  }
  console.log(`✅ study_blog_posts draft投稿完了: ${SLUG} (is_published: false)`);
  console.log(`   JA ${studyContent.ja.length}字 / EN ${studyContent.en.length}字 / ZH ${studyContent.zh.length}字`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
