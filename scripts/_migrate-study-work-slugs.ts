/**
 * study-{code} → study-work-{code} スラグ統一スクリプト
 *
 * 動作:
 *   --dry-run (省略時): 変更内容をプレビューのみ
 *   --apply:            実際にDB変更を実施
 *
 * ロジック:
 *   a) study-work-{code} が既存 → study-{code} を削除（重複解消）
 *   b) study-work-{code} が未存在 → study-{code} をリネーム（内容・is_published 維持）
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const APPLY = process.argv.includes("--apply");

async function main() {
  console.log(`=== study-work-{code} スラグ統一 ${APPLY ? "[--apply]" : "[--dry-run]"} ===\n`);

  // 全 study_blog_posts を取得
  const { data: allRows, error } = await sb
    .from("study_blog_posts")
    .select("slug, category, is_published, title, description, content, date, reading_time")
    .order("slug");

  if (error) { console.error("DB取得エラー:", error.message); process.exit(1); }

  const rows = allRows ?? [];
  console.log(`総記事数: ${rows.length} 件\n`);

  // study-{code} 形式の記事を抽出（study-country-* と study-work-* 以外）
  const shortSlugRows = rows.filter(r => {
    if (r.slug.startsWith("study-country-")) return false;
    if (r.slug.startsWith("study-work-")) return false;
    return /^study-[a-z]+$/.test(r.slug);
  });

  // study-work-{code} 形式の記事をマップ
  const workSlugSet = new Set(
    rows.filter(r => r.slug.startsWith("study-work-")).map(r => r.slug)
  );

  console.log(`study-{code} 形式の記事数: ${shortSlugRows.length} 件`);
  console.log(`study-work-{code} 形式の記事数: ${workSlugSet.size} 件\n`);

  const toDelete: typeof shortSlugRows = [];
  const toRename: typeof shortSlugRows = [];

  for (const r of shortSlugRows) {
    const code = r.slug.replace(/^study-/, "");
    const workSlug = `study-work-${code}`;
    if (workSlugSet.has(workSlug)) {
      toDelete.push(r);
    } else {
      toRename.push(r);
    }
  }

  // a) 重複削除
  if (toDelete.length > 0) {
    console.log(`--- a) 重複削除（study-work-{code} が既存のため study-{code} を削除）: ${toDelete.length} 件 ---`);
    for (const r of toDelete) {
      const code = r.slug.replace(/^study-/, "");
      console.log(`  削除: ${r.slug}  (study-work-${code} が存在)`);
      if (APPLY) {
        const { error: delErr } = await sb.from("study_blog_posts").delete().eq("slug", r.slug);
        if (delErr) console.error(`    ❌ 削除失敗: ${delErr.message}`);
        else console.log(`    ✅ 削除完了`);
      }
    }
  } else {
    console.log("a) 重複削除: 対象なし\n");
  }

  // b) リネーム
  if (toRename.length > 0) {
    console.log(`\n--- b) リネーム（study-{code} → study-work-{code}）: ${toRename.length} 件 ---`);
    for (const r of toRename) {
      const code = r.slug.replace(/^study-/, "");
      const newSlug = `study-work-${code}`;
      const pubStatus = r.is_published ? "公開" : "draft";
      console.log(`  ${r.slug} → ${newSlug}  [${pubStatus}]`);
      if (APPLY) {
        // INSERT with new slug
        const { error: insErr } = await sb.from("study_blog_posts").insert({
          slug: newSlug,
          category: r.category,
          is_published: r.is_published,
          date: r.date,
          reading_time: r.reading_time,
          title: r.title,
          description: r.description,
          content: r.content,
        });
        if (insErr) {
          console.error(`    ❌ INSERT失敗: ${insErr.message}`);
          continue;
        }
        // DELETE old slug
        const { error: delErr } = await sb.from("study_blog_posts").delete().eq("slug", r.slug);
        if (delErr) {
          console.error(`    ❌ 旧スラグ削除失敗: ${delErr.message}`);
        } else {
          console.log(`    ✅ リネーム完了`);
        }
      }
    }
  } else {
    console.log("\nb) リネーム: 対象なし");
  }

  // 最終集計（apply後 or dry-run時は現状集計）
  console.log("\n=== 集計（移行後イメージ） ===");

  // 移行後のスラグセットを計算（dry-runの場合は仮想的に）
  const finalWorkSlugs = new Set<string>();
  for (const r of rows) {
    if (r.slug.startsWith("study-work-")) finalWorkSlugs.add(r.slug);
  }
  // リネーム分を追加
  for (const r of toRename) {
    const code = r.slug.replace(/^study-/, "");
    finalWorkSlugs.add(`study-work-${code}`);
  }

  const MASTER = ["nz","be","tn","pl","ee","cy","hr","hu","ro","fi","bg","my","th","au","us","sg","gb","nl","fr","it","at","ie","ca","kr","se","no","dk","cz","gr","mt","ae","de","ge","hk","in","jp","ph","tw","za","br","cn","co","id","vn","ar","ch","pt","es","mx","tr"];

  // 移行後の状態マップ（is_published）
  const workMap = new Map<string, boolean>();
  for (const r of rows) {
    if (r.slug.startsWith("study-work-")) {
      const code = r.slug.replace(/^study-work-/, "");
      workMap.set(code, r.is_published);
    }
  }
  // リネーム分を上書き
  for (const r of toRename) {
    const code = r.slug.replace(/^study-/, "");
    workMap.set(code, r.is_published);
  }

  const published = MASTER.filter(c => workMap.has(c) && workMap.get(c));
  const draft = MASTER.filter(c => workMap.has(c) && !workMap.get(c));
  const missing = MASTER.filter(c => !workMap.has(c));

  console.log(`\n公開済み: ${published.length} 件 → [${published.sort().join(", ")}]`);
  console.log(`draft:    ${draft.length} 件 → [${draft.sort().join(", ")}]`);
  console.log(`未生成:   ${missing.length} 件 → [${missing.sort().join(", ")}]`);

  if (!APPLY) {
    console.log("\n--apply を付けて実行すると上記変更が適用されます。");
  } else {
    console.log("\n✅ 移行完了");
  }
}

main().catch(e => { console.error(e); process.exit(1); });
