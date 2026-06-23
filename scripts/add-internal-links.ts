/**
 * visa-my と visa-gr の記事内に詳細ガイドへの内部リンクを追加する
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
    const val = t.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// テキストを置換してリンク化するヘルパー
function addLink(content: string, text: string, url: string, linkText?: string): string {
  const display = linkText ?? text;
  // すでにリンクになっている場合はスキップ
  if (content.includes(`[${display}](`)) return content;
  return content.replaceAll(text, `[${display}](${url})`);
}

async function run() {
  const MM2H_URL = "/blog/malaysia-mm2h-visa-complete-guide-2026";
  const GREECE_URL = "/blog/greece-residency-visa-cost-2026";

  // ── visa-my ──────────────────────────────────────────────────────
  console.log("📝 visa-my を更新中...");
  const { data: myPost } = await supabase
    .from("blog_posts")
    .select("content")
    .eq("slug", "visa-my")
    .single();

  if (!myPost) { console.error("visa-my not found"); process.exit(1); }

  // テーブル行の MM2H をリンク化 + セクション見出し下に「詳細記事」誘導を追加
  let jaContent: string = myPost.content.ja;
  let enContent: string = myPost.content.en;
  let zhContent: string = myPost.content.zh;

  // JA: テーブルの MM2H をリンク化
  jaContent = jaContent.replace(
    /^\| MM2H \|/m,
    `| [MM2H](${MM2H_URL}) |`
  );
  // JA: セクション見出し直下に誘導文を追加
  jaContent = jaContent.replace(
    /^(### MM2H（Malaysia My Second Home）\n)/m,
    `$1> 📖 **[MM2H完全ガイド（費用・条件・10年更新）を読む](${MM2H_URL})**\n\n`
  );

  // EN: table row link
  enContent = enContent.replace(
    /^\| MM2H \|/m,
    `| [MM2H](${MM2H_URL}) |`
  );
  enContent = enContent.replace(
    /^(### MM2H[^\n]*\n)/m,
    `$1> 📖 **[Read the Full MM2H Guide (Requirements, Costs & 10-Year Renewal)](${MM2H_URL})**\n\n`
  );

  // ZH: table row link
  if (zhContent) {
    zhContent = zhContent.replace(
      /^\| MM2H \|/m,
      `| [MM2H](${MM2H_URL}) |`
    );
    zhContent = zhContent.replace(
      /^(### MM2H[^\n]*\n)/m,
      `$1> 📖 **[阅读MM2H完整指南（条件·费用·10年更新）](${MM2H_URL})**\n\n`
    );
  }

  const { error: myError } = await supabase
    .from("blog_posts")
    .update({
      content: {
        ja: jaContent,
        en: enContent,
        zh: zhContent,
      },
    })
    .eq("slug", "visa-my");

  if (myError) console.error("visa-my update failed:", myError.message);
  else console.log("✅ visa-my 更新完了");

  // ── visa-gr ──────────────────────────────────────────────────────
  console.log("📝 visa-gr を更新中...");
  const { data: grPost } = await supabase
    .from("blog_posts")
    .select("content")
    .eq("slug", "visa-gr")
    .single();

  if (!grPost) { console.error("visa-gr not found"); process.exit(1); }

  let grJa: string = grPost.content.ja;
  let grEn: string = grPost.content.en;
  let grZh: string = grPost.content.zh;

  // JA: ゴールデンビザ・デジタルノマドビザをリンク化
  grJa = grJa.replace(
    /\*\*ゴールデンビザ（不動産投資）\*\*/,
    `**[ゴールデンビザ（不動産投資）](${GREECE_URL})**`
  );
  grJa = grJa.replace(
    /\*\*デジタルノマドビザ（Digital Nomad Visa）\*\*/,
    `**[デジタルノマドビザ（Digital Nomad Visa）](${GREECE_URL})**`
  );
  // JA: 「主なビザの種類」セクション直下に誘導文追加
  grJa = grJa.replace(
    /^(### 主なビザの種類\n)/m,
    `$1> 📖 **[ギリシャ居住ビザの費用・条件を詳しく見る](${GREECE_URL})**\n\n`
  );

  // EN
  grEn = grEn.replace(
    /\*\*Golden Visa[^*]*\*\*/,
    `**[Golden Visa (Real Estate Investment)](${GREECE_URL})**`
  );
  grEn = grEn.replace(
    /\*\*Digital Nomad Visa\*\*/,
    `**[Digital Nomad Visa](${GREECE_URL})**`
  );
  grEn = grEn.replace(
    /^(### Main Visa Types?\n)/m,
    `$1> 📖 **[Full Greece Residency Visa Cost Guide](${GREECE_URL})**\n\n`
  );

  // ZH
  if (grZh) {
    grZh = grZh.replace(
      /\*\*黄金签证[^*]*\*\*/,
      `**[黄金签证（房产投资）](${GREECE_URL})**`
    );
    grZh = grZh.replace(
      /\*\*数字游牧签证[^*]*\*\*/,
      `**[数字游牧签证（Digital Nomad Visa）](${GREECE_URL})**`
    );
    grZh = grZh.replace(
      /^(### 主要签证类型\n)/m,
      `$1> 📖 **[希腊居留签证费用详细指南](${GREECE_URL})**\n\n`
    );
  }

  const { error: grError } = await supabase
    .from("blog_posts")
    .update({
      content: {
        ja: grJa,
        en: grEn,
        zh: grZh,
      },
    })
    .eq("slug", "visa-gr");

  if (grError) console.error("visa-gr update failed:", grError.message);
  else console.log("✅ visa-gr 更新完了");

  console.log("\n✅ 内部リンク追加完了");
}

run().catch(console.error);
