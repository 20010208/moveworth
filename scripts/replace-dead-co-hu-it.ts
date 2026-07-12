// CO / HU / IT 死亡URL置換スクリプト
// 1. DB status カウント確認
// 2. country_sources に代替URLを挿入
// 3. blog_posts 記事の参考文献セクションを更新
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const REPLACEMENTS: Record<string, { deadUrls: string[]; newUrl: string; purpose: string }> = {
  CO: {
    deadUrls: [
      "https://www.cancilleria.gov.co/v/nomadadigital",
      "https://www.cancilleria.gov.co/v/trabajador",
    ],
    newUrl: "https://www.cancilleria.gov.co/tramites_servicios/visas/solicitar-visa",
    purpose: "visa",
  },
  HU: {
    deadUrls: ["https://www.kormany.hu/en/ministry-of-human-resources"],
    newUrl: "https://ndh.gov.hu/en",
    purpose: "study",
  },
  IT: {
    deadUrls: [
      "https://www.esteri.it/en/sportello_info/domandefrequenti/sezione_visti_entrare_in_italia/",
    ],
    newUrl: "https://vistoperitalia.esteri.it/",
    purpose: "visa",
  },
};

function replaceRefsInContent(
  text: string,
  deadUrls: string[],
  newUrl: string
): string {
  const lines = text.split("\n");
  const result: string[] = [];
  let inRefs = false;
  let newUrlPresent = text.includes(newUrl);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^#{1,3}\s*(参考資料|References|参考文献|参考资料)/.test(line)) {
      inRefs = true;
      result.push(line);
      continue;
    }

    if (inRefs) {
      if (/^#{1,3}\s+\S/.test(line) && !/^#{1,3}\s*(参考資料|References|参考文献|参考资料)/.test(line)) {
        if (!newUrlPresent) {
          result.push(`- ${newUrl}`);
          newUrlPresent = true;
        }
        inRefs = false;
        result.push(line);
        continue;
      }

      const isDead = deadUrls.some((u) => line.includes(u));
      if (isDead) continue;

      result.push(line);
    } else {
      result.push(line);
    }
  }

  if (inRefs && !newUrlPresent) {
    result.push(`- ${newUrl}`);
  }

  return result.join("\n");
}

async function main() {
  // === 1. DB status カウント確認 ===
  console.log("=== DB status カウント ===");
  const { data: counts, error: countErr } = await supabase
    .from("country_sources")
    .select("status");

  if (countErr) { console.error("カウント取得エラー:", countErr.message); process.exit(1); }

  const tally = { alive: 0, dead: 0, unverified: 0, unknown: 0, total: 0 };
  for (const row of counts ?? []) {
    tally[row.status as keyof typeof tally]++;
    tally.total++;
  }
  console.log(`  alive:       ${tally.alive}`);
  console.log(`  unverified:  ${tally.unverified}`);
  console.log(`  dead:        ${tally.dead}`);
  console.log(`  unknown:     ${tally.unknown}`);
  console.log(`  total:       ${tally.total}`);
  console.log();

  // === 2. 代替URLを country_sources に upsert ===
  console.log("=== country_sources 代替URL挿入 ===");
  for (const [code, { newUrl, purpose }] of Object.entries(REPLACEMENTS)) {
    const { data: existing } = await supabase
      .from("country_sources")
      .select("id, status")
      .eq("country_code", code)
      .eq("url", newUrl)
      .single();

    if (existing) {
      console.log(`  [${code}] 既存: ${newUrl}  (status=${existing.status}) — スキップ`);
      continue;
    }

    const { error } = await supabase.from("country_sources").insert({
      country_code: code,
      purpose,
      url: newUrl,
      status: "alive",
      source: "manual",
      last_verified_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`  [${code}] 挿入エラー: ${error.message}`);
    } else {
      console.log(`  [${code}] 挿入OK: ${newUrl}`);
    }
  }
  console.log();

  // === 3. 記事参考文献の差し替え ===
  console.log("=== 記事参考文献 差し替え ===");

  const slugMap: Record<string, string> = {
    CO: "visa-co",
    HU: "visa-hu",
    IT: "visa-it",
  };

  for (const [code, { deadUrls, newUrl }] of Object.entries(REPLACEMENTS)) {
    const slug = slugMap[code];
    console.log(`\n[${code}] slug=${slug}`);

    const { data: post, error: fetchErr } = await supabase
      .from("blog_posts")
      .select("id, content")
      .eq("slug", slug)
      .single();

    if (fetchErr || !post) {
      console.log(`  ⚠️  記事が見つかりません: ${fetchErr?.message}`);
      continue;
    }

    const content = post.content as Record<string, string>;
    const langs = ["ja", "en", "zh"] as const;
    let anyChanged = false;
    const newContent: Record<string, string> = { ...content };

    for (const lang of langs) {
      const original = content[lang];
      if (!original) { console.log(`  [${lang}] なし — スキップ`); continue; }

      const hasDeadUrl = deadUrls.some((u) => original.includes(u));
      if (!hasDeadUrl) {
        console.log(`  [${lang}] dead URLなし — スキップ`);
        continue;
      }

      const updated = replaceRefsInContent(original, deadUrls, newUrl);

      if (updated !== original) {
        newContent[lang] = updated;
        anyChanged = true;
        const newUrlAlreadyWas = original.includes(newUrl);
        console.log(`  [${lang}] dead URL除去${newUrlAlreadyWas ? "" : "、代替URL追加"} ✓`);
      } else {
        console.log(`  [${lang}] 変更なし（ref セクション外に URL がある可能性）`);
      }
    }

    if (!anyChanged) {
      console.log(`  → 全言語変更なし — DBは更新しません`);
      continue;
    }

    const { error: updateErr } = await supabase
      .from("blog_posts")
      .update({ content: newContent })
      .eq("id", post.id);

    if (updateErr) {
      console.error(`  ❌ 更新エラー: ${updateErr.message}`);
    } else {
      console.log(`  ✅ blog_posts 更新完了`);
    }
  }

  console.log("\n=== 完了 ===");
}

main().catch(console.error);
