/**
 * PRESET外 VISA専用21カ国の現在の公開状態を確認する（読み取り専用）
 * 段階的非公開化の計画に使用する。
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

const VISA_ONLY_21 = [
  { code: "al", name: "アルバニア" },
  { code: "cl", name: "チリ" },
  { code: "ec", name: "エクアドル" },
  { code: "gh", name: "ガーナ" },
  { code: "jo", name: "ヨルダン" },
  { code: "ke", name: "ケニア" },
  { code: "kh", name: "カンボジア" },
  { code: "la", name: "ラオス" },
  { code: "lk", name: "スリランカ" },
  { code: "lt", name: "リトアニア" },
  { code: "lv", name: "ラトビア" },
  { code: "ma", name: "モロッコ" },
  { code: "me", name: "モンテネグロ" },
  { code: "mk", name: "北マケドニア" },
  { code: "mu", name: "モーリシャス" },
  { code: "np", name: "ネパール" },
  { code: "pe", name: "ペルー" },
  { code: "rs", name: "セルビア" },
  { code: "si", name: "スロベニア" },
  { code: "sk", name: "スロバキア" },
  { code: "uy", name: "ウルグアイ" },
];

async function main() {
  const slugs = VISA_ONLY_21.map((c) => `visa-${c.code}`);

  const { data, error } = await sb
    .from("blog_posts")
    .select("slug, is_published, title, published_at")
    .in("slug", slugs);

  if (error) { console.error("取得失敗:", error.message); process.exit(1); }

  const rows = data ?? [];
  const found = new Map(rows.map((r: { slug: string; is_published: boolean; title: Record<string,string>; published_at: string | null }) => [r.slug, r]));

  let publishedCount = 0;
  let draftCount = 0;
  let notFoundCount = 0;

  console.log("=".repeat(70));
  console.log("PRESET外 VISA専用21カ国 — 公開状態確認");
  console.log("=".repeat(70));
  console.log(`${"コード".padEnd(6)} ${"国名".padEnd(14)} ${"slug".padEnd(22)} ${"状態".padEnd(10)} published_at`);
  console.log("─".repeat(70));

  for (const c of VISA_ONLY_21) {
    const slug = `visa-${c.code}`;
    const row = found.get(slug);
    if (!row) {
      console.log(`${c.code.padEnd(6)} ${c.name.padEnd(14)} ${slug.padEnd(22)} ${"記事なし".padEnd(10)}`);
      notFoundCount++;
    } else if (row.is_published) {
      console.log(`${c.code.padEnd(6)} ${c.name.padEnd(14)} ${slug.padEnd(22)} ${"✅ 公開中".padEnd(10)} ${row.published_at ?? "—"}`);
      publishedCount++;
    } else {
      console.log(`${c.code.padEnd(6)} ${c.name.padEnd(14)} ${slug.padEnd(22)} ${"📝 draft".padEnd(10)}`);
      draftCount++;
    }
  }

  console.log("─".repeat(70));
  console.log(`公開中: ${publishedCount}件 / draft: ${draftCount}件 / 記事なし: ${notFoundCount}件`);
  console.log();
  if (publishedCount > 0) {
    console.log("⚠️  公開中の記事が存在します。段階的に非公開化してください。");
    console.log("   npx tsx scripts/_unpublish-visa-only-one.ts --code=<code>");
  } else {
    console.log("✅ 公開中の記事はありません。draft/未生成のみ。");
  }
}

main().catch(e => { console.error(e); process.exit(1); });
